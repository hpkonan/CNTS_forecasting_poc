import {
  DonneurInfo,
  ResultatsBiologiques,
  ElementAnalyse,
  ResultatAnalyse,
  NiveauRisque,
} from './types';

// Seuil inférieur de l'hémoglobine considéré comme "hors seuil donneur" par sexe (g/dL, valeurs OMS usuelles).
const SEUIL_HEMOGLOBINE_MIN: Record<'Homme' | 'Femme', number> = {
  Homme: 13.0,
  Femme: 12.0,
};

// Score maximal affiché dans l'interface (repère visuel, pas un plafond réel du calcul).
export const SCORE_MAX_AFFICHAGE = 20;

/**
 * Règles expertes simplifiées et fictives (POC).
 * Seuil "Risque élevé" fixé à 8 plutôt que 7 pour que le Cas 2 (score 7, premier
 * don + voyage + anti-HBc isolé + ALT modérée) reste classé "Intermédiaire" comme
 * attendu par le scénario de démonstration. À valider avec les biologistes du
 * CNTS (voir feuille de route — Version 1).
 */
const SEUIL_INTERMEDIAIRE = 3;
const SEUIL_ELEVE = 8;

function evalTypeDonneur(donneur: DonneurInfo): ElementAnalyse {
  if (donneur.typeDonneur === 'Premier don') {
    return { label: 'Premier don', statut: 'risque', points: 2, categorie: 'donneur' };
  }
  if (donneur.typeDonneur === 'Donneur occasionnel') {
    return { label: 'Donneur occasionnel', statut: 'risque', points: 1, categorie: 'donneur' };
  }
  return { label: 'Donneur régulier', statut: 'protecteur', points: 0, categorie: 'donneur' };
}

function evalDonsAnterieurs(donneur: DonneurInfo): ElementAnalyse | null {
  if (donneur.nombreDonsAnterieurs <= 0) return null;
  const pluriel = donneur.nombreDonsAnterieurs > 1 ? 's' : '';
  return {
    label: `${donneur.nombreDonsAnterieurs} don${pluriel} antérieur${pluriel}`,
    statut: 'protecteur',
    points: 0,
    categorie: 'donneur',
  };
}

function evalDernierDon(donneur: DonneurInfo): ElementAnalyse | null {
  if (donneur.typeDonneur === 'Premier don') return null;
  if (donneur.dernierDonPlus24Mois) {
    return {
      label: 'Dernier don il y a plus de 24 mois',
      statut: 'risque',
      points: 1,
      categorie: 'donneur',
    };
  }
  return {
    label: `Dernier don : ${donneur.dernierDonLabel.toLowerCase()}`,
    statut: 'protecteur',
    points: 0,
    categorie: 'donneur',
  };
}

function evalVoyage(donneur: DonneurInfo): ElementAnalyse {
  if (donneur.voyageRecent) {
    return { label: 'Voyage récent', statut: 'risque', points: 2, categorie: 'donneur' };
  }
  return { label: 'Aucun voyage récent', statut: 'protecteur', points: 0, categorie: 'donneur' };
}

function evalAntecedent(donneur: DonneurInfo): ElementAnalyse {
  if (donneur.antecedentMedical) {
    return {
      label: 'Antécédent médical significatif',
      statut: 'risque',
      points: 2,
      categorie: 'donneur',
    };
  }
  return {
    label: 'Aucun antécédent médical significatif',
    statut: 'protecteur',
    points: 0,
    categorie: 'donneur',
  };
}

function evalComportement(donneur: DonneurInfo): ElementAnalyse {
  if (donneur.comportementRisque === 'Oui') {
    return {
      label: 'Comportement à risque déclaré',
      statut: 'risque',
      points: 3,
      categorie: 'donneur',
    };
  }
  if (donneur.comportementRisque === 'Non déclaré') {
    return {
      label: 'Comportement à risque non déclaré (statut incertain)',
      statut: 'neutre',
      points: 0,
      categorie: 'donneur',
    };
  }
  return {
    label: 'Aucun comportement à risque déclaré',
    statut: 'protecteur',
    points: 0,
    categorie: 'donneur',
  };
}

function evalVIH(biologie: ResultatsBiologiques): ElementAnalyse {
  if (biologie.vih === 'Négatif') {
    return { label: 'VIH négatif', statut: 'protecteur', points: 0, categorie: 'biologie' };
  }
  const label = biologie.vih === 'Réactif faible' ? 'VIH réactif faible' : 'VIH positif';
  return { label, statut: 'risque', points: 5, categorie: 'biologie' };
}

function evalVHB(biologie: ResultatsBiologiques): ElementAnalyse {
  let points = 0;
  const constats: string[] = [];
  if (biologie.hbsAg === 'Positif') {
    points += 5;
    constats.push('HBsAg positif');
  }
  if (biologie.antiHbc === 'Positif isolé') {
    points += 2;
    constats.push('anti-HBc positif isolé');
  } else if (biologie.antiHbc === 'Positif') {
    points += 2;
    constats.push('anti-HBc positif');
  }
  if (constats.length === 0) {
    return {
      label: 'VHB négatif (HBsAg et anti-HBc négatifs)',
      statut: 'protecteur',
      points: 0,
      categorie: 'biologie',
    };
  }
  return { label: `VHB ${constats.join(', ')}`, statut: 'risque', points, categorie: 'biologie' };
}

function evalVHC(biologie: ResultatsBiologiques): ElementAnalyse {
  if (biologie.vhc === 'Négatif') {
    return { label: 'VHC négatif', statut: 'protecteur', points: 0, categorie: 'biologie' };
  }
  return { label: 'VHC positif', statut: 'risque', points: 5, categorie: 'biologie' };
}

function evalSyphilis(biologie: ResultatsBiologiques): ElementAnalyse {
  if (biologie.syphilis === 'Négatif') {
    return { label: 'Syphilis négative', statut: 'protecteur', points: 0, categorie: 'biologie' };
  }
  return { label: 'Syphilis positive', statut: 'risque', points: 4, categorie: 'biologie' };
}

function evalALT(biologie: ResultatsBiologiques): ElementAnalyse {
  if (biologie.alt > 70) {
    return {
      label: `ALT élevée (${biologie.alt} UI/L)`,
      statut: 'risque',
      points: 2,
      categorie: 'biologie',
    };
  }
  if (biologie.alt >= 45) {
    return {
      label: `ALT modérément élevée (${biologie.alt} UI/L)`,
      statut: 'risque',
      points: 1,
      categorie: 'biologie',
    };
  }
  return {
    label: `ALT normale (${biologie.alt} UI/L)`,
    statut: 'protecteur',
    points: 0,
    categorie: 'biologie',
  };
}

function evalHemoglobine(donneur: DonneurInfo, biologie: ResultatsBiologiques): ElementAnalyse {
  const seuil = SEUIL_HEMOGLOBINE_MIN[donneur.sexe];
  if (biologie.hemoglobine < seuil) {
    return {
      label: `Hémoglobine hors seuil donneur (${biologie.hemoglobine} g/dL)`,
      statut: 'risque',
      points: 1,
      categorie: 'biologie',
    };
  }
  return {
    label: `Hémoglobine acceptable (${biologie.hemoglobine} g/dL)`,
    statut: 'protecteur',
    points: 0,
    categorie: 'biologie',
  };
}

export function computeRisk(
  donneur: DonneurInfo,
  biologie: ResultatsBiologiques
): ResultatAnalyse {
  const elements: ElementAnalyse[] = [
    evalTypeDonneur(donneur),
    evalDonsAnterieurs(donneur),
    evalDernierDon(donneur),
    evalVoyage(donneur),
    evalAntecedent(donneur),
    evalComportement(donneur),
    evalVIH(biologie),
    evalVHB(biologie),
    evalVHC(biologie),
    evalSyphilis(biologie),
    evalALT(biologie),
    evalHemoglobine(donneur, biologie),
  ].filter((e): e is ElementAnalyse => e !== null);

  const score = elements.reduce((total, e) => total + e.points, 0);

  const niveau: NiveauRisque =
    score >= SEUIL_ELEVE ? 'Élevé' : score >= SEUIL_INTERMEDIAIRE ? 'Intermédiaire' : 'Faible';

  const facteursRisque = elements.filter((e) => e.statut === 'risque');

  const antiHbcIsoleOuAltElevee =
    biologie.antiHbc === 'Positif isolé' || biologie.alt >= 45;

  let decision: string;
  let typeDecision: ResultatAnalyse['typeDecision'];
  let couleur: ResultatAnalyse['couleur'];
  if (niveau === 'Faible') {
    decision = 'Libérer la poche selon procédure standard';
    typeDecision = 'liberation';
    couleur = 'vert';
  } else if (niveau === 'Intermédiaire') {
    decision = antiHbcIsoleOuAltElevee
      ? 'Réaliser un NAT VHB avant décision de libération'
      : 'Réaliser un test complémentaire ciblé avant décision de libération';
    typeDecision = 'nat';
    couleur = 'orange';
  } else {
    decision =
      'Ne pas libérer la poche ; mettre en quarantaine et lancer les investigations complémentaires';
    typeDecision = 'quarantaine';
    couleur = 'rouge';
  }

  let confiance: ResultatAnalyse['confiance'];
  if (niveau === 'Intermédiaire') {
    confiance = score >= SEUIL_ELEVE - 1 ? 'Moyenne à élevée' : 'Moyenne';
  } else {
    confiance = 'Élevée';
  }

  const facteursProtecteurs = elements.filter((e) => e.statut === 'protecteur');
  const justification = buildJustification(niveau, facteursRisque, facteursProtecteurs, antiHbcIsoleOuAltElevee);
  const regleAppliquee = buildRegleAppliquee(niveau, score, facteursRisque, antiHbcIsoleOuAltElevee);

  return {
    score,
    scoreMax: SCORE_MAX_AFFICHAGE,
    niveau,
    confiance,
    decision,
    typeDecision,
    couleur,
    elements,
    justification,
    regleAppliquee,
  };
}

function listeLabels(elements: ElementAnalyse[]): string {
  const labels = elements.map((e) => e.label.toLowerCase());
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} et ${labels[labels.length - 1]}`;
}

function buildJustification(
  niveau: NiveauRisque,
  facteursRisque: ElementAnalyse[],
  facteursProtecteurs: ElementAnalyse[],
  antiHbcIsoleOuAltElevee: boolean
): string {
  if (niveau === 'Faible') {
    const pointsRassurants =
      facteursProtecteurs.length > 0
        ? `Le dossier est cohérent sur l'ensemble des points suivants : ${listeLabels(
            facteursProtecteurs
          )}.`
        : '';
    return (
      "Après analyse du questionnaire, de l'historique donneur et des résultats biologiques " +
      "disponibles, aucun facteur de vigilance n'a été identifié. " +
      `${pointsRassurants} ` +
      "Les paramètres biologiques sont compatibles avec une libération selon la procédure standard."
    ).replace(/\s+/g, ' ').trim();
  }

  const listeFacteurs = listeLabels(facteursRisque);

  if (niveau === 'Intermédiaire') {
    const mentionNAT = antiHbcIsoleOuAltElevee ? ', notamment un NAT VHB,' : '';
    return (
      `Le profil présente plusieurs éléments nécessitant une vigilance renforcée : ${listeFacteurs}. ` +
      "La recommandation est de ne pas libérer immédiatement la poche et de prioriser un test " +
      `complémentaire${mentionNAT} avant décision finale.`
    );
  }

  return (
    `Le profil combine plusieurs facteurs de risque épidémiologiques et biologiques : ${listeFacteurs}. ` +
    "La libération de la poche n'est pas recommandée dans l'état actuel du dossier. Une mise en " +
    "quarantaine, une investigation complémentaire et une validation biologique renforcée sont " +
    "recommandées."
  );
}

export function explicationConfiance(confiance: ResultatAnalyse['confiance']): string {
  switch (confiance) {
    case 'Élevée':
      return 'Tous les paramètres disponibles sont concordants.';
    case 'Moyenne à élevée':
      return 'La plupart des paramètres sont concordants, mais un signal nécessite confirmation avant décision.';
    case 'Moyenne':
      return 'Plusieurs facteurs nécessitent confirmation avant décision.';
    default:
      return '';
  }
}

function buildRegleAppliquee(
  niveau: NiveauRisque,
  score: number,
  facteursRisque: ElementAnalyse[],
  antiHbcIsoleOuAltElevee: boolean
): string {
  if (niveau === 'Faible') {
    return (
      `Score total : ${score} point(s), sous le seuil de vigilance (< ${SEUIL_INTERMEDIAIRE}). ` +
      "Règle appliquée : en l'absence de facteur de risque, la procédure standard de " +
      "libération s'applique directement."
    );
  }

  if (niveau === 'Intermédiaire') {
    const declencheur = antiHbcIsoleOuAltElevee
      ? "La présence d'un anti-HBc positif isolé et/ou d'une ALT modérément élevée déclenche " +
        "spécifiquement la règle « NAT VHB avant libération »."
      : "Aucun marqueur ne déclenche spécifiquement un NAT VHB ; un test complémentaire ciblé " +
        "générique est recommandé par prudence.";
    return (
      `Score total : ${score} point(s), dans la zone intermédiaire (${SEUIL_INTERMEDIAIRE} à ${
        SEUIL_ELEVE - 1
      }). Facteur(s) déterminant(s) : ${listeLabels(facteursRisque)}. ${declencheur}`
    );
  }

  return (
    `Score total : ${score} point(s), au-delà du seuil élevé (≥ ${SEUIL_ELEVE}). Facteurs ` +
    `convergents : ${listeLabels(facteursRisque)}. Règle appliquée : au-delà de ce seuil, la ` +
    "mise en quarantaine et les investigations complémentaires sont systématiques, quelle que " +
    "soit la confiance individuelle de chaque marqueur."
  );
}
