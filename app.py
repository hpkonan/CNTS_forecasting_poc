"""CNTS - Systeme d'aide a la decision (prototype).

Ce n'est pas un outil de prevision : c'est un systeme qui transforme les
donnees de stock/demande deja suivies par le CNTS en decisions concretes,
avec le pourquoi et l'impact chiffre de chaque option. Regles metier
transparentes de bout en bout — voir src/decision_engine.py.

Lancement : streamlit run app.py
"""

from pathlib import Path

import pandas as pd
import streamlit as st

from src import decision_engine as de

DATA_PATH = Path(__file__).parent / "cnts_simulated_blood_demand.csv"

RISK_COLORS = {
    "Eleve": "background-color: #f8d7da",
    "Moyen": "background-color: #fff3cd",
    "Faible": "background-color: #d4edda",
}

st.set_page_config(page_title="CNTS — Systeme d'aide a la decision", layout="wide")


@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv(DATA_PATH)


def highlight_risk(value: str) -> str:
    return RISK_COLORS.get(value, "")


df = load_data()
months = sorted(df["month"].unique())
regions = sorted(df["region"].unique())
blood_groups = sorted(df["blood_group"].unique())

st.title("CNTS — Systeme d'aide a la decision")
st.caption(
    "Prototype sur donnees simulees. Les regles metier, le chiffrage et les recommandations "
    "sont des composants internes — la valeur du systeme est de dire quoi faire, et pourquoi, "
    "plus vite et de facon objective. Pas un modele d'IA."
)

with st.sidebar:
    st.header("Filtres")
    selected_month = st.selectbox("Mois", months, index=len(months) - 1)
    selected_regions = st.multiselect("Regions", regions, default=regions)
    selected_groups = st.multiselect("Groupes sanguins", blood_groups, default=blood_groups)

snapshot, transfers = de.build_recommendations(df, selected_month)
snapshot = de.explain_causes(snapshot, df, selected_month, transfers=transfers)

# --- Resume executif : la situation nationale, avant tout filtre --------
st.header("Resume executif")
summary = de.build_executive_summary(snapshot, transfers)
for line in de.executive_summary_text(summary):
    st.markdown(f"- {line}")

if summary["nb_regions_eleve"] > 0:
    st.markdown("**Priorites nationales — ou agir en premier**")
    priority_list = de.build_priority_list(snapshot, top_n=5)
    priority_list = priority_list.rename(
        columns={
            "region": "Region",
            "blood_group": "Groupe",
            "risk_level_calc": "Risque",
            "jours_de_stock": "Jours de stock restants (estimation)",
        }
    )
    st.dataframe(priority_list, width="stretch", hide_index=True)

st.divider()

# --- Filtrage pour le detail regional -----------------------------------
filtered_snapshot = snapshot[
    snapshot["region"].isin(selected_regions) & snapshot["blood_group"].isin(selected_groups)
]
filtered_transfers = transfers[
    transfers["blood_group"].isin(selected_groups)
    & (transfers["from_region"].isin(selected_regions) | transfers["to_region"].isin(selected_regions))
]

nb_regions_eleve = filtered_snapshot.loc[filtered_snapshot["risk_level_calc"] == "Eleve", "region"].nunique()
nb_groupes_tendus = filtered_snapshot.loc[filtered_snapshot["risk_level_calc"] == "Eleve", "blood_group"].nunique()
deficit_total = -filtered_snapshot.loc[filtered_snapshot["risk_level_calc"] == "Eleve", "balance_units"].sum()
nb_transferts = len(filtered_transfers)

col1, col2, col3, col4 = st.columns(4)
col1.metric("Regions en risque eleve", nb_regions_eleve)
col2.metric("Groupes sanguins sous tension", nb_groupes_tendus)
col3.metric("Deficit total (unites)", int(deficit_total))
col4.metric("Transferts suggeres", nb_transferts)

st.subheader(f"Demande vs stock par region — {selected_month}")
chart_data = (
    filtered_snapshot.groupby("region", observed=True)[["hospital_demand_units", "available_stock_units"]]
    .sum()
    .rename(columns={"hospital_demand_units": "Demande", "available_stock_units": "Stock"})
)
st.bar_chart(chart_data)

st.subheader("Detail par region x groupe sanguin")
display_snapshot = filtered_snapshot.copy()
display_snapshot["jours_de_stock"] = display_snapshot.apply(de.estimate_days_of_stock, axis=1)
display_cols = [
    "region", "blood_group", "hospital_demand_units", "available_stock_units",
    "coverage_ratio_calc", "risk_level_calc", "jours_de_stock", "action",
]
styled = display_snapshot[display_cols].style.map(highlight_risk, subset=["risk_level_calc"])
st.dataframe(styled, width="stretch", hide_index=True)
st.caption("« Jours de stock » : estimation au rythme de consommation du mois (demande mensuelle / 30), pas une prevision.")

st.subheader("Opportunites de redistribution")
if filtered_transfers.empty:
    st.info(
        "Aucune region en surplus mobilisable ce mois-ci pour les filtres selectionnes : "
        "la priorite est la collecte, pas la redistribution."
    )
else:
    st.dataframe(filtered_transfers, width="stretch", hide_index=True)

st.subheader("Recommandations priorisees")
recommendations = de.build_recommendation_texts(filtered_snapshot, transfers)
if not recommendations:
    st.success("Aucune situation a risque pour les filtres selectionnes.")
else:
    for line in recommendations:
        st.markdown(f"- {line}")

st.divider()
st.header("Analyse decisionnelle")
st.caption(
    "Le tableau ci-dessus dit quoi surveiller. Cette section explique pourquoi, "
    "chiffre l'impact d'une decision, et compare les options avant de trancher."
)

at_risk = filtered_snapshot[filtered_snapshot["risk_level_calc"] != "Faible"].reset_index(drop=True)

if at_risk.empty:
    st.success("Aucune situation a risque pour les filtres selectionnes : rien a analyser en detail.")
else:
    situation_labels = [
        f"{row.region} / {row.blood_group} — risque {row.risk_level_calc}" for row in at_risk.itertuples()
    ]
    choice_label = st.selectbox("Situation a analyser", situation_labels)
    focus_row = at_risk.iloc[situation_labels.index(choice_label)]

    col_causes, col_impact = st.columns(2)
    with col_causes:
        st.markdown("**Pourquoi ce risque ?**")
        for cause in focus_row["causes"]:
            st.markdown(f"- {cause}")

    with col_impact:
        st.markdown("**Impact d'une collecte ciblee**")
        impact = de.impact_of_collecte(focus_row, target_risk="Moyen")
        st.markdown(impact["text"])
        st.markdown(f"Au rythme actuel, le stock couvre encore environ **{de.estimate_days_of_stock(focus_row)} jours** de demande.")

    st.markdown("**Simuler une decision ( « et si ? » )**")
    st.caption("Choisissez une decision metier — le moteur calcule les unites et le risque resultant, pas l'inverse.")
    scenarios = de.available_scenarios(focus_row, transfers)
    scenario_label = st.radio("Decision", list(scenarios.keys()), label_visibility="collapsed")
    scenario = de.simulate_scenario(focus_row, **scenarios[scenario_label])

    before_col, after_col = st.columns(2)
    before_col.metric(
        "Risque actuel",
        str(focus_row["risk_level_calc"]),
        f"couverture {focus_row['coverage_ratio_calc']:.2f}",
    )
    after_col.metric(
        "Risque apres decision",
        str(scenario["risk_level_scenario"]),
        f"couverture {scenario['coverage_ratio_scenario']:.2f}",
    )

    st.markdown("**Comparer les strategies**")
    strategies = de.compare_strategies(focus_row, transfers)
    st.dataframe(strategies, width="stretch", hide_index=True)
