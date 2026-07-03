# 🩸 CNTS Blood Decision Support System (CNTS-BDSS)

## Transformer les données en décisions

---

# 1. Contexte

Le Centre National de Transfusion Sanguine (CNTS) joue un rôle essentiel dans la collecte, la préparation, le stockage et la distribution des produits sanguins sur l'ensemble du territoire ivoirien.

Le CNTS dispose aujourd'hui d'outils permettant le suivi opérationnel des activités (collectes, stocks, distributions, etc.). Ces outils offrent une excellente visibilité sur l'état actuel du système.

En revanche, une nouvelle opportunité consiste à exploiter ces données afin d'améliorer l'aide à la décision et d'anticiper les situations à risque.

---

# 2. Vision du projet

L'objectif de ce projet est de développer un prototype de système d'aide à la décision (Decision Support System - DSS) destiné au CNTS.

Ce prototype ne vise pas à remplacer les outils existants, mais à leur ajouter une couche d'intelligence décisionnelle capable de transformer les données opérationnelles en recommandations concrètes.

Le principe est simple :

> Passer d'un système qui décrit la situation actuelle à un système qui aide les décideurs à agir.

---

# 3. Problématique métier

Les responsables du CNTS doivent régulièrement répondre à des questions telles que :

- Quels groupes sanguins risquent d'être en rupture dans les prochaines semaines ?
- Quelles régions présentent un risque élevé de pénurie ?
- Où faut-il organiser les prochaines campagnes de collecte ?
- Existe-t-il des stocks pouvant être redistribués entre régions ?
- Quels indicateurs nécessitent une attention immédiate ?

Aujourd'hui, ces décisions reposent principalement sur l'expérience des équipes et l'analyse des données disponibles.

L'objectif de ce projet est d'apporter un outil complémentaire permettant d'améliorer cette prise de décision grâce à l'analyse prédictive.

---

# 4. Objectif du prototype (MVP)

Le premier prototype répondra à un cas d'usage unique :

**Identifier les régions présentant un risque de pénurie de sang dans les 30 prochains jours et proposer une recommandation opérationnelle.**

Le prototype reposera sur quatre étapes :

1. Prévoir la demande future
2. Comparer cette demande aux stocks disponibles
3. Évaluer le niveau de risque
4. Générer une recommandation opérationnelle

---

# 5. Données utilisées

Dans cette première version, l'ensemble des données est simulé.

L'objectif est de démontrer la faisabilité de l'approche sans utiliser de données réelles du CNTS.

Le jeu de données comprend notamment :

- Date
- Région
- Groupe sanguin
- Demande hospitalière
- Nombre d'unités collectées
- Stock disponible
- Unités expirées
- Contexte saisonnier
- Niveau de risque

---

# 6. Fonctionnalités du prototype

Le prototype intégrera progressivement plusieurs modules.

## Module 1 — Analyse exploratoire

Comprendre les tendances des besoins en sang.

---

## Module 2 — Prévision de la demande

Estimer les besoins futurs par région et groupe sanguin.

---

## Module 3 — Évaluation du risque

Identifier automatiquement les situations de pénurie potentielles.

---

## Module 4 — Recommandations

Proposer des actions telles que :

- lancement d'une campagne de collecte ;
- redistribution de stocks ;
- surveillance renforcée d'une région ;
- priorisation d'un groupe sanguin.

---

## Module 5 — Tableau de bord décisionnel

Présenter aux décideurs une interface simple mettant en évidence :

- les régions critiques ;
- les groupes sanguins sous tension ;
- les recommandations prioritaires.

---

# 7. Comment lancer le prototype

```bash
pip install -r requirements.txt

# Notebooks
jupyter notebook 02_EDA.ipynb
jupyter notebook 03_decision_engine.ipynb

# Tableau de bord
streamlit run app.py
```

---

# 8. Public cible

Le prototype est destiné en priorité :

- au Directeur Général du CNTS ;
- à la Direction des opérations ;
- aux responsables des centres régionaux.

---

# 9. Vision à long terme

Ce prototype constitue la première brique d'une plateforme plus large d'aide à la décision pour les systèmes transfusionnels.

À terme, celle-ci pourrait intégrer :

- prévision des besoins ;
- optimisation des stocks ;
- redistribution intelligente des produits sanguins ;
- planification des campagnes de collecte ;
- aide à l'approvisionnement en matériel de collecte ;
- suivi des performances ;
- détection d'anomalies.

---

# 10. État d'avancement

✅ Prototype en cours de développement.

Version actuelle :

- ✅ données simulées ;
- ✅ analyse exploratoire (`02_EDA.ipynb`) ;
- ✅ moteur de décision par règles métier (`src/decision_engine.py`, démontré dans `03_decision_engine.ipynb`) — reproduit 98,9 % des niveaux de risque historiques du dataset simulé ;
- ✅ tableau de bord décisionnel interactif (`app.py`, Streamlit) ;
- ⏳ à venir : couche de projection à 30 jours (moyenne mobile), narratif de présentation pour le pitch.