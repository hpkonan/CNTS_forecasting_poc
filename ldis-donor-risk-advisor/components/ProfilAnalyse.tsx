const SOURCES_ANALYSE = [
  'Questionnaire donneur',
  'Historique du donneur',
  'Résultats sérologiques',
  'Paramètres biologiques',
  'Facteurs épidémiologiques',
  'Règles métier fictives',
];

export default function ProfilAnalyse() {
  return (
    <div className="mt-5 rounded-lg border border-ldis-border bg-ldis-mist p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
        Profil analysé
      </span>
      <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {SOURCES_ANALYSE.map((source) => (
          <li key={source} className="text-sm text-ldis-navy">
            <span className="mr-1.5 text-ldis-steel">✓</span>
            {source}
          </li>
        ))}
      </ul>
    </div>
  );
}
