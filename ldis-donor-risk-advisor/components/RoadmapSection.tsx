const PHASES = [
  {
    phase: 'Phase 1',
    titre: 'Donor Risk Advisor',
    texte: 'Évaluation structurée du risque donneur.',
  },
  {
    phase: 'Phase 2',
    titre: 'Serology Interpreter',
    texte: 'Interprétation des profils sérologiques complexes.',
  },
  {
    phase: 'Phase 3',
    titre: 'Executive Dashboard',
    texte: 'Pilotage des indicateurs de laboratoire et de direction.',
  },
  {
    phase: 'Phase 4',
    titre: 'NAT Optimizer',
    texte: 'Priorisation des tests complémentaires coûteux.',
  },
  {
    phase: 'Phase 5',
    titre: 'QC Monitor',
    texte: 'Surveillance qualité et détection de dérives analytiques.',
  },
  {
    phase: 'Phase 6',
    titre: 'Blood Release Assistant',
    texte: 'Aide à la libération, quarantaine ou rejet des poches.',
  },
  {
    phase: 'Phase 7',
    titre: 'Epidemiology Watch',
    texte: 'Surveillance des tendances infectieuses par région.',
  },
];

export default function RoadmapSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4 pt-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ldis-steel">
        Feuille de route LDIS
      </h2>
      <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((p) => (
          <li
            key={p.phase}
            className="rounded-lg border border-ldis-border bg-white p-3 text-xs text-ldis-navy"
          >
            <span className="font-semibold text-ldis-steel">{p.phase}</span>
            <p className="mt-1 font-semibold">{p.titre}</p>
            <p className="mt-0.5 leading-snug text-ldis-steel">{p.texte}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-center text-sm italic text-ldis-steel">
        Le CNTS pourrait devenir le premier site pilote d&rsquo;une suite décisionnelle
        transfusionnelle adaptée aux réalités africaines.
      </p>
    </section>
  );
}
