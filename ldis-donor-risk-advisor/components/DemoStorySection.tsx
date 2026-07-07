const PARCOURS = [
  'Donneur reçu',
  'Données saisies',
  'Résultats biologiques disponibles',
  'Analyse LDIS',
  'Recommandation proposée',
  'Validation biologique finale',
  'Traçabilité',
];

export default function DemoStorySection() {
  return (
    <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-6 pt-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">
        Scénario de démonstration
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ldis-steel">
        Imaginez qu&rsquo;un donneur se présente ce matin au CNTS. Ses informations sont
        recueillies, les résultats biologiques sont disponibles, et le biologiste doit décider
        rapidement si la poche peut être libérée, si un test complémentaire est nécessaire ou si
        une quarantaine doit être appliquée. LDIS analyse le dossier et propose une recommandation
        justifiée.
      </p>

      <ol className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2">
        {PARCOURS.map((etape, index) => (
          <li key={etape} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-ldis-mist px-3 py-1.5 text-xs font-medium text-ldis-navy">
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-ldis-navy text-[10px] text-white">
                {index + 1}
              </span>
              {etape}
            </span>
            {index < PARCOURS.length - 1 && (
              <span aria-hidden className="text-ldis-border">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
