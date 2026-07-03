"""Tableau de bord decisionnel CNTS (prototype).

Demonstre comment transformer stock/demande en recommandations
operationnelles priorisees. Regles metier transparentes, pas de modele ML —
voir src/decision_engine.py pour la logique.

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

st.set_page_config(page_title="CNTS — Aide a la decision", layout="wide")


@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv(DATA_PATH)


def highlight_risk(value: str) -> str:
    return RISK_COLORS.get(value, "")


df = load_data()
months = sorted(df["month"].unique())
regions = sorted(df["region"].unique())
blood_groups = sorted(df["blood_group"].unique())

st.title("CNTS — Tableau de bord decisionnel")
st.caption(
    "Prototype sur donnees simulees. Recommandations issues de regles metier "
    "transparentes (seuils sur le ratio stock/demande), pas d'un modele IA."
)

with st.sidebar:
    st.header("Filtres")
    selected_month = st.selectbox("Mois", months, index=len(months) - 1)
    selected_regions = st.multiselect("Regions", regions, default=regions)
    selected_groups = st.multiselect("Groupes sanguins", blood_groups, default=blood_groups)

snapshot, transfers = de.build_recommendations(df, selected_month)

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
display_cols = [
    "region", "blood_group", "hospital_demand_units", "available_stock_units",
    "coverage_ratio_calc", "risk_level_calc", "action",
]
styled = filtered_snapshot[display_cols].style.map(highlight_risk, subset=["risk_level_calc"])
st.dataframe(styled, use_container_width=True, hide_index=True)

st.subheader("Opportunites de redistribution")
if filtered_transfers.empty:
    st.info(
        "Aucune region en surplus mobilisable ce mois-ci pour les filtres selectionnes : "
        "la priorite est la collecte, pas la redistribution."
    )
else:
    st.dataframe(filtered_transfers, use_container_width=True, hide_index=True)

st.subheader("Recommandations priorisees")
recommendations = de.build_recommendation_texts(filtered_snapshot, transfers)
if not recommendations:
    st.success("Aucune situation a risque pour les filtres selectionnes.")
else:
    for line in recommendations:
        st.markdown(f"- {line}")
