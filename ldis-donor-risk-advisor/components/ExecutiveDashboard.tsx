import { KpisExecutifs } from '@/lib/types';

interface ExecutiveDashboardProps {
  kpis: KpisExecutifs;
}

export default function ExecutiveDashboard({ kpis }: ExecutiveDashboardProps) {
  const tuiles = [
    {
      label: 'Dons analysés',
      valeur: kpis.donsAnalyses.toLocaleString('fr-FR'),
      accent: 'text-ldis-navy',
      tendance: '+8 % vs mois précédent',
    },
    {
      label: 'Libérations standard',
      valeur: kpis.liberationsStandard.toLocaleString('fr-FR'),
      accent: 'text-risk-low',
      tendance: '+3 % vs mois précédent',
    },
    {
      label: 'Recommandations NAT',
      valeur: kpis.recommandationsNAT.toLocaleString('fr-FR'),
      accent: 'text-risk-mid',
      tendance: '+12 % recommandations ciblées',
    },
    {
      label: 'Mises en quarantaine',
      valeur: kpis.quarantaines.toLocaleString('fr-FR'),
      accent: 'text-risk-high',
      tendance: '-2 % vs mois précédent',
    },
    {
      label: "Temps moyen d'analyse assistée",
      valeur: '2 min 15 s',
      accent: 'text-ldis-navy',
      tendance: "-35 % temps moyen d'interprétation estimé",
    },
    {
      label: 'Tests complémentaires mieux ciblés',
      valeur: '18 %',
      accent: 'text-risk-mid',
      tendance: '',
    },
    {
      label: 'Recommandations documentées',
      valeur: '100 %',
      accent: 'text-risk-low',
      tendance: '',
    },
    {
      label: 'Donnée réelle utilisée dans ce démonstrateur',
      valeur: '0',
      accent: 'text-ldis-steel',
      tendance: '',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-8">
      <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ldis-navy">
            Executive Dashboard – Simulation mensuelle
          </h2>
          <span className="text-xs text-ldis-steel">
            Volumétrie mensuelle simulée, mise à jour avec vos analyses de cette session
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tuiles.map((t) => (
            <div key={t.label} className="rounded-lg bg-ldis-mist p-4 text-center">
              <div className={`text-2xl font-bold ${t.accent}`}>{t.valeur}</div>
              <div className="mt-1 text-xs text-ldis-steel">{t.label}</div>
              {t.tendance && (
                <div className="mt-0.5 text-[11px] text-ldis-steel/60">{t.tendance}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
