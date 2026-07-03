"""Moteur de decision CNTS.

Regles metier transparentes (pas de modele ML) qui transforment un etat de
stock/demande en recommandations operationnelles priorisees :
- classification du risque de penurie par region x groupe sanguin
- detection des opportunites de redistribution entre regions en surplus et
  regions en deficit, pour un meme groupe sanguin
- explication des causes probables d'un risque (V1.0)
- estimation chiffree de l'impact d'une collecte (V1.0)
- simulation de scenarios "et si ?" et comparaison de strategies (V1.0)
"""

from __future__ import annotations

from math import ceil

import pandas as pd

# Seuils de coverage_ratio (stock disponible / demande hospitaliere).
# Alignes sur la logique du dataset simule (voir cnts_data_dictionary.csv)
# afin de pouvoir valider le moteur contre les etiquettes historiques.
RISK_THRESHOLDS = {
    "eleve_max": 0.85,   # coverage_ratio < 0.85          -> Eleve
    "moyen_max": 1.05,   # 0.85 <= coverage_ratio < 1.05  -> Moyen
    # coverage_ratio >= 1.05                               -> Faible
}

# Au-dela de ce ratio, une region est consideree en surplus mobilisable
# pour une redistribution vers une region en deficit.
SURPLUS_RATIO_THRESHOLD = 1.3

ACTION_BY_RISK = {
    "Eleve": "Collecte ciblee urgente + verifier une redistribution depuis une region en surplus",
    "Moyen": "Surveillance renforcee, planifier une collecte sous 2 semaines",
    "Faible": "Aucune action requise",
}

# Fenetre glissante (en mois) utilisee comme reference "normale" pour detecter
# une baisse de collecte ou une hausse de demande inhabituelle.
TREND_WINDOW_MONTHS = 3

# En dessous de 85% de la moyenne glissante, on considere que les collectes
# ont baisse. Au-dessus de 115% de la moyenne glissante, on considere que la
# demande a connu une hausse inhabituelle.
COLLECTE_DROP_RATIO = 0.85
DEMAND_SPIKE_RATIO = 1.15


def compute_coverage_ratio(df: pd.DataFrame) -> pd.Series:
    """Stock disponible / demande hospitaliere, arrondi comme dans le dataset source."""
    return (df["available_stock_units"] / df["hospital_demand_units"]).round(2)


def classify_risk(coverage_ratio: pd.Series) -> pd.Series:
    return pd.cut(
        coverage_ratio,
        bins=[-float("inf"), RISK_THRESHOLDS["eleve_max"], RISK_THRESHOLDS["moyen_max"], float("inf")],
        labels=["Eleve", "Moyen", "Faible"],
    )


def score_period(df: pd.DataFrame, month: str) -> pd.DataFrame:
    """Calcule risque, balance stock/demande et action recommandee pour un mois donne."""
    snapshot = df.loc[df["month"] == month].copy()
    if snapshot.empty:
        raise ValueError(f"Aucune donnee pour le mois {month!r}")

    snapshot["coverage_ratio_calc"] = compute_coverage_ratio(snapshot)
    snapshot["risk_level_calc"] = classify_risk(snapshot["coverage_ratio_calc"])
    snapshot["balance_units"] = snapshot["available_stock_units"] - snapshot["hospital_demand_units"]
    snapshot["action"] = snapshot["risk_level_calc"].map(ACTION_BY_RISK)

    priority_order = {"Eleve": 0, "Moyen": 1, "Faible": 2}
    snapshot["priority"] = snapshot["risk_level_calc"].map(priority_order)
    snapshot = snapshot.sort_values(["priority", "balance_units"]).reset_index(drop=True)
    return snapshot


def find_redistribution_opportunities(snapshot: pd.DataFrame) -> pd.DataFrame:
    """Associe, pour chaque groupe sanguin, les regions en deficit a des regions en surplus.

    Approche gloutonne : les regions en deficit les plus severes sont servies
    en premier par les regions ayant le plus de surplus disponible.
    """
    opportunities: list[dict] = []

    for blood_group, group_df in snapshot.groupby("blood_group", observed=True):
        deficits = group_df[group_df["risk_level_calc"] == "Eleve"].sort_values("balance_units")
        surplus_pool = group_df[
            group_df["coverage_ratio_calc"] >= SURPLUS_RATIO_THRESHOLD
        ][["region", "balance_units"]].set_index("region")["balance_units"].to_dict()

        for _, deficit_row in deficits.iterrows():
            needed = -deficit_row["balance_units"]
            for donor_region, available in sorted(surplus_pool.items(), key=lambda kv: -kv[1]):
                if needed <= 0:
                    break
                if available <= 0:
                    continue
                transfer = min(needed, available)
                opportunities.append(
                    {
                        "blood_group": blood_group,
                        "from_region": donor_region,
                        "to_region": deficit_row["region"],
                        "units_suggested": int(round(transfer)),
                    }
                )
                surplus_pool[donor_region] -= transfer
                needed -= transfer

    return pd.DataFrame(
        opportunities,
        columns=["blood_group", "from_region", "to_region", "units_suggested"],
    )


def build_recommendations(df: pd.DataFrame, month: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Point d'entree principal : renvoie (snapshot priorise, transferts suggeres)."""
    snapshot = score_period(df, month)
    transfers = find_redistribution_opportunities(snapshot)
    return snapshot, transfers


def to_recommendation_text(row: pd.Series, transfers: pd.DataFrame) -> str:
    """Traduit une ligne de snapshot (+ transferts associes) en phrase lisible."""
    base = (
        f"{row['region']} / {row['blood_group']} — risque {row['risk_level_calc']} "
        f"(couverture {row['coverage_ratio_calc']:.2f}). {row['action']}."
    )
    match = transfers[
        (transfers["to_region"] == row["region"]) & (transfers["blood_group"] == row["blood_group"])
    ]
    if not match.empty:
        details = "; ".join(
            f"{m.units_suggested} unites depuis {m.from_region}" for m in match.itertuples()
        )
        base += f" Transfert suggere : {details}."
    return base


def build_recommendation_texts(snapshot: pd.DataFrame, transfers: pd.DataFrame) -> list[str]:
    """Recommandations textuelles priorisees (risque Moyen ou Eleve uniquement)."""
    priority_cases = snapshot[snapshot["risk_level_calc"] != "Faible"]
    if priority_cases.empty:
        return []
    return priority_cases.apply(to_recommendation_text, axis=1, transfers=transfers).tolist()


# ---------------------------------------------------------------------------
# V1.0 — expliquer les causes, chiffrer l'impact, simuler des scenarios
# ---------------------------------------------------------------------------


def compute_trailing_baseline(df: pd.DataFrame, month: str, window: int = TREND_WINDOW_MONTHS) -> pd.DataFrame:
    """Moyenne de demande/collecte par region x groupe sanguin sur les `window` mois precedents.

    Sert de reference "normale" pour detecter une baisse de collecte ou une
    hausse de demande inhabituelle. Vide pour les tout premiers mois du
    dataset (pas assez d'historique).
    """
    months = sorted(df["month"].unique())
    if month not in months:
        raise ValueError(f"Mois inconnu : {month!r}")

    window_months = months[max(0, months.index(month) - window) : months.index(month)]
    columns = ["region", "blood_group", "baseline_demand", "baseline_collected"]
    if not window_months:
        return pd.DataFrame(columns=columns)

    return (
        df[df["month"].isin(window_months)]
        .groupby(["region", "blood_group"], observed=True)
        .agg(baseline_demand=("hospital_demand_units", "mean"), baseline_collected=("collected_units", "mean"))
        .reset_index()
    )


def _causes_for_row(row: pd.Series, window: int, regions_with_transfer: set) -> list[str]:
    causes: list[str] = []

    if pd.notna(row.get("baseline_collected")) and row["baseline_collected"] > 0:
        ratio = row["collected_units"] / row["baseline_collected"]
        if ratio < COLLECTE_DROP_RATIO:
            causes.append(
                f"Baisse des collectes : {row['collected_units']:.0f} unites contre "
                f"{row['baseline_collected']:.0f} en moyenne sur les {window} derniers mois "
                f"({(1 - ratio):.0%} de moins)."
            )

    if pd.notna(row.get("baseline_demand")) and row["baseline_demand"] > 0:
        ratio = row["hospital_demand_units"] / row["baseline_demand"]
        if ratio > DEMAND_SPIKE_RATIO:
            causes.append(
                f"Hausse inhabituelle de la demande : {row['hospital_demand_units']:.0f} unites contre "
                f"{row['baseline_demand']:.0f} en moyenne sur les {window} derniers mois "
                f"({(ratio - 1):.0%} de plus)."
            )

    if row["risk_level_calc"] == "Eleve":
        causes.append(
            f"Stock sous le seuil de securite : couverture de {row['coverage_ratio_calc']:.2f} "
            f"contre {RISK_THRESHOLDS['eleve_max']:.2f} minimum recommande."
        )
        if (row["region"], row["blood_group"]) not in regions_with_transfer:
            causes.append("Aucune region excedentaire disponible pour redistribuer ce groupe sanguin ce mois-ci.")
    elif row["risk_level_calc"] == "Moyen":
        causes.append(f"Stock proche du seuil de vigilance : couverture de {row['coverage_ratio_calc']:.2f}.")

    if not causes:
        causes.append("Situation equilibree, aucune cause de risque identifiee.")

    return causes


def explain_causes(
    snapshot: pd.DataFrame,
    df: pd.DataFrame,
    month: str,
    transfers: pd.DataFrame | None = None,
    window: int = TREND_WINDOW_MONTHS,
) -> pd.DataFrame:
    """Ajoute une colonne `causes` (liste de phrases) expliquant chaque niveau de risque."""
    baseline = compute_trailing_baseline(df, month, window=window)
    enriched = snapshot.merge(baseline, on=["region", "blood_group"], how="left")

    regions_with_transfer = (
        set(zip(transfers["to_region"], transfers["blood_group"]))
        if transfers is not None and not transfers.empty
        else set()
    )
    enriched["causes"] = enriched.apply(
        _causes_for_row, axis=1, window=window, regions_with_transfer=regions_with_transfer
    )
    return enriched


def units_needed_for_target(current_stock: float, demand: float, target_risk: str) -> int:
    """Unites de stock supplementaires necessaires pour atteindre un niveau de risque cible.

    `classify_risk` est inclusif a droite (0.85 reste "Eleve"), donc on vise
    0.01 au-dela du seuil pour basculer reellement dans la categorie cible.
    """
    if target_risk not in ("Moyen", "Faible"):
        raise ValueError("target_risk doit etre 'Moyen' ou 'Faible'")
    threshold = RISK_THRESHOLDS["eleve_max"] if target_risk == "Moyen" else RISK_THRESHOLDS["moyen_max"]
    return max(0, ceil((threshold + 0.01) * demand - current_stock))


def impact_of_collecte(row: pd.Series, target_risk: str = "Moyen") -> dict:
    """Traduit `units_needed_for_target` en phrase actionnable pour une situation donnee."""
    units = units_needed_for_target(row["available_stock_units"], row["hospital_demand_units"], target_risk)
    if units == 0:
        text = f"{row['region']} / {row['blood_group']} est deja au niveau {target_risk} ou mieux."
    else:
        text = (
            f"Une collecte d'environ {units} unites supplementaires ferait passer "
            f"{row['region']} / {row['blood_group']} de {row['risk_level_calc']} a {target_risk}."
        )
    return {"units": units, "text": text}


def simulate_scenario(
    row: pd.Series,
    collecte_delta: float = 0,
    transfert_delta: float = 0,
    demand_pct_change: float = 0.0,
) -> pd.Series:
    """Recalcule stock, couverture et risque pour une situation hypothetique ("et si ?").

    Ne modifie pas les donnees sources : renvoie une copie enrichie de colonnes `*_scenario`.
    """
    scenario = row.copy()
    new_demand = row["hospital_demand_units"] * (1 + demand_pct_change)
    new_stock = row["available_stock_units"] + collecte_delta + transfert_delta

    scenario["hospital_demand_units_scenario"] = round(new_demand, 1)
    scenario["available_stock_units_scenario"] = new_stock
    ratio = round(new_stock / new_demand, 2) if new_demand > 0 else float("inf")
    scenario["coverage_ratio_scenario"] = ratio
    scenario["risk_level_scenario"] = classify_risk(pd.Series([ratio])).iloc[0]
    return scenario


IMPACT_STARS_BY_RISK = {"Faible": 5, "Moyen": 3, "Eleve": 1}
EFFORT_STARS_BY_STRATEGY = {"Transfert": 2, "Campagne de collecte": 3, "Aucune action": 0}
RISK_RANK = {"Faible": 0, "Moyen": 1, "Eleve": 2}


def _stars(count: int, total: int = 5) -> str:
    count = max(0, min(total, count))
    return "★" * count + "☆" * (total - count)


def compare_strategies(row: pd.Series, transfers: pd.DataFrame) -> pd.DataFrame:
    """Compare jusqu'a 3 strategies operationnelles pour une situation a risque donnee :
    transfert (si une opportunite existe), campagne de collecte, et statu quo.

    Chaque strategie est notee en impact (risque obtenu) et en effort
    operationnel, et la meilleure option actionnable est marquee "recommandee".
    """
    strategies: list[dict] = []

    match = transfers[(transfers["to_region"] == row["region"]) & (transfers["blood_group"] == row["blood_group"])]
    if not match.empty:
        units = int(match["units_suggested"].sum())
        sim = simulate_scenario(row, transfert_delta=units)
        strategies.append(
            {
                "strategie": "Transfert",
                "detail": f"{units} unites depuis {', '.join(match['from_region'])}",
                "risque_resultant": str(sim["risk_level_scenario"]),
                "cout_effort": "Faible",
            }
        )

    impact = impact_of_collecte(row, target_risk="Moyen")
    sim = simulate_scenario(row, collecte_delta=impact["units"])
    strategies.append(
        {
            "strategie": "Campagne de collecte",
            "detail": f"+{impact['units']} unites collectees",
            "risque_resultant": str(sim["risk_level_scenario"]),
            "cout_effort": "Moyen",
        }
    )

    strategies.append(
        {
            "strategie": "Aucune action",
            "detail": "Statu quo",
            "risque_resultant": str(row["risk_level_calc"]),
            "cout_effort": "Risque de rupture eleve" if row["risk_level_calc"] == "Eleve" else "A surveiller",
        }
    )

    result = pd.DataFrame(strategies, columns=["strategie", "detail", "risque_resultant", "cout_effort"])
    result["impact"] = result["risque_resultant"].map(IMPACT_STARS_BY_RISK).fillna(1).astype(int).map(_stars)
    result["effort"] = result["strategie"].map(EFFORT_STARS_BY_STRATEGY).fillna(0).astype(int).map(_stars)

    result["recommandee"] = ""
    actionable = result[result["strategie"] != "Aucune action"].copy()
    if not actionable.empty:
        actionable["_risk_rank"] = actionable["risque_resultant"].map(RISK_RANK)
        actionable["_effort_rank"] = actionable["strategie"].map(EFFORT_STARS_BY_STRATEGY)
        best_label = actionable.sort_values(["_risk_rank", "_effort_rank"]).iloc[0]["strategie"]
        result.loc[result["strategie"] == best_label, "recommandee"] = "✅ Recommandee"

    return result[["strategie", "detail", "risque_resultant", "impact", "effort", "recommandee"]]


def available_scenarios(row: pd.Series, transfers: pd.DataFrame) -> dict[str, dict]:
    """Traduit des decisions metier lisibles en parametres pour `simulate_scenario`.

    Le decideur choisit une decision ("organiser une campagne", "redistribuer",
    "ne rien faire") — le moteur calcule les unites correspondantes, pas l'inverse.
    """
    scenarios: dict[str, dict] = {}

    impact = impact_of_collecte(row, target_risk="Moyen")
    label = f"Organiser une campagne ciblee a {row['region']} (+{impact['units']} unites)"
    scenarios[label] = {"collecte_delta": impact["units"], "transfert_delta": 0, "demand_pct_change": 0.0}

    match = transfers[(transfers["to_region"] == row["region"]) & (transfers["blood_group"] == row["blood_group"])]
    if not match.empty:
        units = int(match["units_suggested"].sum())
        donors = ", ".join(match["from_region"].unique())
        label = f"Redistribuer depuis {donors} (+{units} unites)"
        scenarios[label] = {"collecte_delta": 0, "transfert_delta": units, "demand_pct_change": 0.0}

    scenarios["Ne rien faire"] = {"collecte_delta": 0, "transfert_delta": 0, "demand_pct_change": 0.0}

    return scenarios


# ---------------------------------------------------------------------------
# V1.1 — resume executif, horizon temporel, priorites, scenarios nommes
# ---------------------------------------------------------------------------

# Les donnees sont mensuelles : on approxime un rythme de consommation
# quotidien en divisant la demande du mois par 30. C'est une estimation de
# rythme, pas une prevision — a ne jamais presenter comme une prediction.
DAYS_PER_MONTH = 30


def estimate_days_of_stock(row: pd.Series) -> float:
    """Jours de stock restants au rythme de consommation moyen du mois en cours."""
    daily_demand = row["hospital_demand_units"] / DAYS_PER_MONTH
    if daily_demand <= 0:
        return float("inf")
    return round(row["available_stock_units"] / daily_demand, 1)


def build_priority_list(snapshot: pd.DataFrame, top_n: int = 5) -> pd.DataFrame:
    """Classe les situations a risque par urgence (jours de stock restants croissants)."""
    at_risk = snapshot[snapshot["risk_level_calc"] != "Faible"].copy()
    if at_risk.empty:
        return pd.DataFrame(columns=["region", "blood_group", "risk_level_calc", "jours_de_stock"])

    at_risk["jours_de_stock"] = at_risk.apply(estimate_days_of_stock, axis=1)
    at_risk = at_risk.sort_values("jours_de_stock").head(top_n).reset_index(drop=True)
    return at_risk[["region", "blood_group", "risk_level_calc", "jours_de_stock"]]


def build_executive_summary(snapshot: pd.DataFrame, transfers: pd.DataFrame) -> dict:
    """Chiffres cles de la situation nationale du mois, pour un resume en 15 secondes."""
    at_risk = snapshot[snapshot["risk_level_calc"] == "Eleve"]

    tense_groups = (
        at_risk.groupby("blood_group", observed=True)["balance_units"].sum().sort_values().index[:2].tolist()
        if not at_risk.empty
        else []
    )
    priority_regions = (
        at_risk.groupby("region", observed=True)["balance_units"].sum().sort_values().index[:2].tolist()
        if not at_risk.empty
        else []
    )

    return {
        "nb_regions_eleve": int(at_risk["region"].nunique()),
        "deficit_total": int(-at_risk["balance_units"].sum()) if not at_risk.empty else 0,
        "tense_groups": tense_groups,
        "priority_regions": priority_regions,
        "has_redistribution": not transfers.empty,
    }


def executive_summary_text(summary: dict) -> list[str]:
    """Traduit `build_executive_summary` en phrases pretes pour un resume executif."""
    if summary["nb_regions_eleve"] == 0:
        return ["Situation stable au niveau national : aucune region en risque eleve. Poursuivre la surveillance de routine."]

    lines = [
        f"{summary['nb_regions_eleve']} region(s) presentent un risque eleve.",
        f"Le deficit estime est de {summary['deficit_total']} unites.",
    ]
    if summary["tense_groups"]:
        lines.append(f"Les groupes {' et '.join(summary['tense_groups'])} sont les plus sous tension.")
    if summary["priority_regions"]:
        lines.append(f"La priorite est une campagne ciblee a {' et '.join(summary['priority_regions'])}.")
    lines.append(
        "Des redistributions sont disponibles ce mois-ci pour limiter la collecte necessaire."
        if summary["has_redistribution"]
        else "Aucune redistribution suffisante n'est disponible ce mois-ci : la priorite est la collecte."
    )
    return lines
