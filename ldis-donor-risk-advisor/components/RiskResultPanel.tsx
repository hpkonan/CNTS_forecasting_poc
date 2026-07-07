'use client';

import { useState } from 'react';
import { DonneurInfo, ResultatAnalyse, TypeDecision } from '@/lib/types';
import { explicationConfiance } from '@/lib/riskEngine';
import RiskGauge from './RiskGauge';
import ProfilAnalyse from './ProfilAnalyse';
import ExplanationPanel from './ExplanationPanel';
import { DISCLAIMER_TEXTE } from './Disclaimer';
import { BeakerIcon, CheckCircleIcon, ShieldAlertIcon } from './icons';

interface RiskResultPanelProps {
  resultat: ResultatAnalyse | null;
  donneur: DonneurInfo;
  casNom: string;
  pourquoiOuvert: boolean;
  onTogglePourquoi: () => void;
}

const niveauStyles: Record<
  ResultatAnalyse['couleur'],
  {
    card: string;
    badge: string;
    decisionBg: string;
    decisionAccent: string;
  }
> = {
  vert: {
    card: 'border-risk-low/40',
    badge: 'bg-risk-lowBg text-risk-low',
    decisionBg: 'bg-risk-lowBg',
    decisionAccent: 'text-risk-low',
  },
  orange: {
    card: 'border-risk-mid/40',
    badge: 'bg-risk-midBg text-risk-mid',
    decisionBg: 'bg-risk-midBg',
    decisionAccent: 'text-risk-mid',
  },
  rouge: {
    card: 'border-risk-high/40',
    badge: 'bg-risk-highBg text-risk-high',
    decisionBg: 'bg-risk-highBg',
    decisionAccent: 'text-risk-high',
  },
};

const iconParDecision: Record<TypeDecision, typeof CheckCircleIcon> = {
  liberation: CheckCircleIcon,
  nat: BeakerIcon,
  quarantaine: ShieldAlertIcon,
};

function buildResume(donneur: DonneurInfo, resultat: ResultatAnalyse): string {
  const lignes = [
    `LDIS – Donor Risk Advisor (POC, données fictives)`,
    `Donneur : ${donneur.identifiant}`,
    `Décision proposée : ${resultat.decision}`,
    `Niveau de risque : ${resultat.niveau} (score ${resultat.score}/${resultat.scoreMax}) — confiance ${resultat.confiance}`,
    `Facteurs de risque : ${
      resultat.elements.filter((e) => e.statut === 'risque').length > 0
        ? resultat.elements
            .filter((e) => e.statut === 'risque')
            .map((e) => e.label)
            .join(', ')
        : 'aucun'
    }`,
    `Justification : ${resultat.justification}`,
  ];
  return lignes.join('\n');
}

function buildCompteRendu(donneur: DonneurInfo, casNom: string, resultat: ResultatAnalyse): string {
  const facteursRisque = resultat.elements.filter((e) => e.statut === 'risque');
  const lignes = [
    'LDIS – Donor Risk Advisor',
    "Compte-rendu d'analyse (POC, données fictives)",
    '='.repeat(48),
    '',
    `Scénario : ${casNom}`,
    `Identifiant donneur : ${donneur.identifiant}`,
    '',
    `Décision proposée : ${resultat.decision}`,
    `Niveau de risque : ${resultat.niveau} (score ${resultat.score}/${resultat.scoreMax})`,
    `Confiance : ${resultat.confiance} — ${explicationConfiance(resultat.confiance)}`,
    '',
    'Raisons principales :',
    ...(facteursRisque.length > 0 ? facteursRisque.map((f) => `  - ${f.label}`) : ['  - Aucune']),
    '',
    'Justification métier :',
    resultat.justification,
    '',
    'Avertissement :',
    DISCLAIMER_TEXTE,
  ];
  return lignes.join('\n');
}

export default function RiskResultPanel({
  resultat,
  donneur,
  casNom,
  pourquoiOuvert,
  onTogglePourquoi,
}: RiskResultPanelProps) {
  const [copie, setCopie] = useState(false);
  const [exporte, setExporte] = useState(false);

  if (!resultat) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-ldis-border bg-white/60 p-8 text-center">
        <p className="text-sm text-ldis-steel">
          Renseignez ou sélectionnez un cas, puis cliquez sur « Analyser le risque » pour
          afficher la recommandation.
        </p>
      </div>
    );
  }

  const styles = niveauStyles[resultat.couleur];
  const Icon = iconParDecision[resultat.typeDecision];
  const facteursProtecteurs = resultat.elements.filter((e) => e.statut === 'protecteur');
  const facteursRisque = resultat.elements.filter((e) => e.statut === 'risque');

  const handleCopy = async () => {
    const texte = buildResume(donneur, resultat);
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : on ignore silencieusement.
    }
  };

  const handleExport = () => {
    const contenu = buildCompteRendu(donneur, casNom, resultat);
    const blob = new Blob([contenu], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `LDIS_compte-rendu_${donneur.identifiant}.txt`;
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(url);
    setExporte(true);
    setTimeout(() => setExporte(false), 2000);
  };

  return (
    <div className={`rounded-xl border-2 bg-white p-5 shadow-sm ${styles.card}`}>
      <p className="text-sm italic leading-relaxed text-ldis-steel">
        Le profil du donneur a été analysé. Voici la recommandation générée à partir du
        questionnaire, de l&rsquo;historique donneur et des résultats biologiques disponibles.
      </p>

      {/* 1. La décision d'abord */}
      <div className={`mt-4 flex items-start gap-4 rounded-lg p-4 ${styles.decisionBg}`}>
        <Icon className={`h-9 w-9 flex-shrink-0 ${styles.decisionAccent}`} />
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wide ${styles.decisionAccent}`}>
            Décision proposée
          </div>
          <div className="mt-1 text-lg font-bold leading-snug text-ldis-navy">
            {resultat.decision}
          </div>
        </div>
      </div>

      {/* 2. Niveau de risque, confiance et score en secondaire */}
      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
            Niveau de risque
          </span>
          <div className={`mt-1 inline-flex rounded-md px-3 py-1 text-sm font-semibold ${styles.badge}`}>
            {resultat.niveau}
          </div>
        </div>
        <div className="max-w-[55%] text-right">
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
            Confiance
          </span>
          <div className="mt-1 text-sm font-medium text-ldis-navy">{resultat.confiance}</div>
          <p className="mt-0.5 text-xs leading-snug text-ldis-steel">
            {explicationConfiance(resultat.confiance)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <RiskGauge score={resultat.score} scoreMax={resultat.scoreMax} niveau={resultat.niveau} />
      </div>

      {/* 3. Profil analysé */}
      <ProfilAnalyse />

      {/* 4. Raisonnement : facteurs protecteurs et raisons de risque */}
      {facteursProtecteurs.length > 0 && (
        <div className="mt-5 rounded-lg border border-risk-low/30 bg-risk-lowBg p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-risk-low">
            Facteurs protecteurs
          </span>
          <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {facteursProtecteurs.map((f) => (
              <li key={f.label} className="text-sm text-ldis-navy">
                <span className="mr-1.5 text-risk-low">✓</span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {facteursRisque.length > 0 && (
        <div className="mt-5 rounded-lg border border-risk-high/30 bg-risk-highBg p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-risk-high">
            Raisons principales
          </span>
          <ul className="mt-2 space-y-1">
            {facteursRisque.map((f) => (
              <li key={f.label} className="flex items-center justify-between text-sm text-ldis-navy">
                <span>
                  <span className="mr-1.5 text-risk-high">⚠</span>
                  {f.label}
                </span>
                <span className="text-xs font-medium text-ldis-steel">+{f.points}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Justification métier */}
      <div className="mt-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
          Justification métier
        </span>
        <p className="mt-1 text-sm leading-relaxed text-ldis-navy">{resultat.justification}</p>
      </div>

      {/* 5. Pourquoi ? */}
      <ExplanationPanel resultat={resultat} ouvert={pourquoiOuvert} onToggle={onTogglePourquoi} />

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-md border border-ldis-navy px-4 py-2 text-sm font-medium text-ldis-navy transition hover:bg-ldis-navy hover:text-white"
        >
          {copie ? 'Recommandation copiée ✓' : 'Copier la recommandation'}
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex-1 rounded-md border border-ldis-border px-4 py-2 text-sm font-medium text-ldis-steel transition hover:border-ldis-steel hover:text-ldis-navy"
        >
          {exporte ? 'Compte-rendu exporté ✓' : 'Exporter le compte-rendu'}
        </button>
      </div>
    </div>
  );
}
