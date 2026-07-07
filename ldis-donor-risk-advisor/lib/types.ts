export type Sexe = 'Homme' | 'Femme';

export type TypeDonneur = 'Donneur régulier' | 'Premier don' | 'Donneur occasionnel';

export type ComportementRisque = 'Oui' | 'Non' | 'Non déclaré';

export type ResultatSerologieVIH = 'Négatif' | 'Réactif faible' | 'Positif';

export type ResultatBinaire = 'Négatif' | 'Positif';

export type ResultatAntiHbc = 'Négatif' | 'Positif isolé' | 'Positif';

export interface DonneurInfo {
  identifiant: string;
  age: number;
  sexe: Sexe;
  region: string;
  typeDonneur: TypeDonneur;
  nombreDonsAnterieurs: number;
  dernierDonLabel: string;
  dernierDonPlus24Mois: boolean;
  voyageRecent: boolean;
  voyageRecentDetail: string;
  antecedentMedical: boolean;
  antecedentMedicalDetail: string;
  comportementRisque: ComportementRisque;
  profession: string;
}

export interface ResultatsBiologiques {
  vih: ResultatSerologieVIH;
  hbsAg: ResultatBinaire;
  antiHbc: ResultatAntiHbc;
  vhc: ResultatBinaire;
  syphilis: ResultatBinaire;
  alt: number;
  hemoglobine: number;
  natRealise: boolean;
}

export interface CasDonneur {
  id: string;
  nom: string;
  description: string;
  donneur: DonneurInfo;
  biologie: ResultatsBiologiques;
}

export type CategorieElement = 'donneur' | 'biologie';

export type StatutElement = 'protecteur' | 'risque' | 'neutre';

export interface ElementAnalyse {
  label: string;
  statut: StatutElement;
  points: number;
  categorie: CategorieElement;
}

export type NiveauRisque = 'Faible' | 'Intermédiaire' | 'Élevé';

export type NiveauConfiance = 'Élevée' | 'Moyenne à élevée' | 'Moyenne';

export type TypeDecision = 'liberation' | 'nat' | 'quarantaine';

export interface ResultatAnalyse {
  score: number;
  scoreMax: number;
  niveau: NiveauRisque;
  confiance: NiveauConfiance;
  decision: string;
  typeDecision: TypeDecision;
  couleur: 'vert' | 'orange' | 'rouge';
  elements: ElementAnalyse[];
  justification: string;
  regleAppliquee: string;
}

export interface KpisExecutifs {
  donsAnalyses: number;
  liberationsStandard: number;
  recommandationsNAT: number;
  quarantaines: number;
}
