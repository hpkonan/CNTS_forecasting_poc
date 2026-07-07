# LDIS – Donor Risk Advisor

POC / MVP démonstrateur — Assistant d'aide à la décision pour l'évaluation du risque
résiduel des donneurs de sang, présenté à la Direction Générale du CNTS (Côte d'Ivoire).

> Nous ne remplaçons pas les biologistes. Nous augmentons la qualité et l'homogénéité
> de leurs décisions.

Ce projet est un module autonome de démonstration (`LDIS – Donor Risk Advisor`), distinct
du prototype de prévision de la demande sanguine présent à la racine de ce dépôt.

## Ce que fait le démonstrateur

- 3 cas fictifs sélectionnables (donneur standard, risque intermédiaire, risque élevé).
- Un formulaire donneur + résultats biologiques pré-rempli selon le cas choisi, et
  modifiable pour explorer d'autres combinaisons.
- Un moteur de règles expertes **fictif et simplifié** (`lib/riskEngine.ts`) qui calcule
  un score, un niveau de risque, une décision proposée, les facteurs contributifs et une
  justification métier.
- Un bouton « Copier la recommandation » qui place un résumé dans le presse-papiers.
- Un bloc « Valeur pour le CNTS » et un disclaimer rappelant qu'il ne s'agit pas d'un
  dispositif médical validé.

⚠️ Le scoring n'est pas validé cliniquement. Voir le commentaire en tête de
`lib/riskEngine.ts` pour le détail des seuils retenus pour cette démonstration.

## Installation et lancement local

Prérequis : [Node.js](https://nodejs.org/) 18 ou plus récent (avec npm).

```bash
cd ldis-donor-risk-advisor
npm install
npm run dev
```

L'application est accessible sur http://localhost:3000.

## Build de production (statique)

Le projet est configuré en export statique (`output: 'export'` dans `next.config.mjs`),
sans backend : tout le scoring s'exécute côté navigateur.

```bash
npm run build
```

Le résultat statique est généré dans le dossier `out/`, prêt à être déposé tel quel sur :

- **GitHub Pages** : publier le contenu de `out/` (par ex. dans un dossier `docs/` ou une
  branche `gh-pages`). Si l'app est servie sous un sous-chemin
  (`https://<user>.github.io/ldis-donor-risk-advisor/`), décommenter et adapter la ligne
  `basePath` dans `next.config.mjs` avant de builder.
- **Vercel** : importer le dossier `ldis-donor-risk-advisor/` comme projet Next.js
  (détection automatique, aucune configuration supplémentaire nécessaire).
- **Netlify** : build command `npm run build`, publish directory `out`.

## Structure du projet

```
ldis-donor-risk-advisor/
  app/
    layout.tsx        # Layout racine, métadonnées de la page
    page.tsx           # Page unique (cockpit décisionnel)
    globals.css         # Styles globaux (Tailwind)
  components/
    Header.tsx              # Bannière produit
    PositioningBanner.tsx    # Message de positionnement
    CaseSelector.tsx         # Sélecteur des 3 cas fictifs
    DonorForm.tsx            # Formulaire donneur + biologie
    RiskResultPanel.tsx      # Panneau de résultat + copie presse-papiers
    RiskGauge.tsx            # Jauge visuelle du score
    ValueSection.tsx         # Bloc "Valeur pour le CNTS"
    RoadmapSection.tsx       # Évolutions futures
    Disclaimer.tsx           # Disclaimer obligatoire
    Tooltip.tsx              # Info-bulles (ex. anti-HBc)
  lib/
    types.ts        # Modèle de données (donneur, biologie, résultat)
    cases.ts         # Données fictives des 3 cas
    riskEngine.ts    # Moteur de règles expertes (scoring fictif)
```

## Feuille de route

- **Version 1** : règles expertes validées avec les biologistes du CNTS.
- **Version 2** : intégration de données historiques anonymisées.
- **Version 3** : module de surveillance qualité et épidémiologique.
- **Version 4** : intégration avec le LIMS / système existant.
- **Version 5** : adaptation à d'autres centres de transfusion.
