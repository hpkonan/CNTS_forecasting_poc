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

Ce projet n'est pas un outil de prévision : c'est un système d'aide à la décision. Le forecasting, les règles métier et les recommandations en sont des composants internes — la valeur livrée est d'aider le CNTS à décider plus vite, de façon plus objective, plus transparente et plus explicable.

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
jupyter notebook 04_dss_v1.ipynb
jupyter notebook 05_dss_v1_1.ipynb

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

# 9. Roadmap produit

Le logiciel actuel du CNTS répond à *« Que se passe-t-il ? »*. Le DSS doit répondre à *« Que devons-nous faire maintenant, et pourquoi ? »*

## Version 0.1 — Dashboard ✅

- Moteur de règles métier (risque par seuils de couverture stock/demande)
- Recommandations opérationnelles simples
- Tableau de bord interactif, filtrable par mois / région / groupe sanguin

## Version 1.0 — Aide à la décision ✅

- **Causes** : chaque niveau de risque est expliqué (baisse de collecte, hausse inhabituelle de la demande, stock sous le seuil de sécurité), comparé à la moyenne glissante des 3 mois précédents
- **Impact** : chaque recommandation de collecte est chiffrée (« collecter ~43 unités ferait passer le risque d'Élevé à Moyen »)
- **Scénarios** : simulateur « et si ? » — collecte supplémentaire, transfert reçu, variation de la demande — avec recalcul immédiat du risque
- **Stratégies** : comparaison transfert / campagne de collecte / statu quo, avec risque résultant et effort estimé

## Version 1.1 — Présentable en réunion de direction ✅

- **Résumé exécutif** : la situation nationale (régions à risque, déficit total, groupes sous tension, priorités) en tête de page, compréhensible en 15 secondes
- **Causes enrichies** : ajout du cas « aucune région excédentaire disponible pour redistribuer »
- **Horizon temporel** : estimation du nombre de jours de stock restants au rythme de consommation du mois (une estimation de rythme, pas une prévision)
- **Priorités nationales** : classement des situations à risque par urgence réelle (jours de stock), pas seulement par niveau de risque
- **Stratégies notées** : impact et effort en étoiles, avec une recommandation explicite (ex. transfert préféré à une collecte quand il est disponible et moins coûteux)
- **Simulateur par décisions** : le décideur choisit une décision métier (« organiser une campagne ciblée », « redistribuer », « ne rien faire ») — le moteur calcule les unités, pas l'inverse

*Hors scope de cette version : scénarios multi-régions (« campagne nationale »), qui mériteraient leur propre section plutôt que d'être compressés dans le panneau par situation.*

## Version 2.0 — Anticipation (à venir, nécessite des données réelles)

- Prévision de la demande à 30 jours
- Optimisation des transferts et des campagnes de collecte
- Calibration des seuils et des règles avec les équipes du CNTS
- Intégration avec le logiciel existant du CNTS

---

# 10. État d'avancement

✅ Prototype fonctionnel — Version 1.1.

- ✅ données simulées ;
- ✅ analyse exploratoire (`02_EDA.ipynb`) ;
- ✅ moteur de décision par règles métier (`src/decision_engine.py`, démontré dans `03_decision_engine.ipynb`) — reproduit 98,9 % des niveaux de risque historiques du dataset simulé ;
- ✅ tableau de bord décisionnel interactif (`app.py`, Streamlit) ;
- ✅ causes, impact chiffré, simulation de scénarios et comparaison de stratégies (`04_dss_v1.ipynb`) ;
- ✅ résumé exécutif, priorités nationales, horizon temporel, simulateur par décisions, stratégies notées (`05_dss_v1_1.ipynb`, intégré dans `app.py`) ;
- ⏳ à venir (V2.0) : prévision à 30 jours, calibration sur données réelles du CNTS.