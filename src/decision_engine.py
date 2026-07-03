"""Moteur de decision CNTS.

Regles metier transparentes (pas de modele ML) qui transforment un etat de
stock/demande en recommandations operationnelles priorisees :
- classification du risque de penurie par region x groupe sanguin
- detection des opportunites de redistribution entre regions en surplus et
  regions en deficit, pour un meme groupe sanguin
"""

from __future__ import annotations

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
