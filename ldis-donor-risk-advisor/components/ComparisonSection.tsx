const sansLDIS = ['Questionnaire', 'Résultats de laboratoire', 'Interprétation individuelle', 'Décision'];

const avecLDIS = [
  'Questionnaire + résultats de laboratoire + profil épidémiologique',
  'Analyse unifiée',
  'Recommandation transparente',
  'Décision traçable',
];

function Flow({ etapes, itemClass }: { etapes: string[]; itemClass: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {etapes.map((etape, index) => (
        <div key={etape} className="flex items-center gap-2">
          <div className={`rounded-lg border px-3 py-2 text-xs sm:text-sm ${itemClass}`}>{etape}</div>
          {index < etapes.length - 1 && (
            <span aria-hidden className="text-ldis-steel/60">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">Ce que change LDIS</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ldis-steel">
        Le même dossier donneur, traité avec ou sans copilote décisionnel.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
            Sans LDIS
          </span>
          <div className="mt-3">
            <Flow etapes={sansLDIS} itemClass="border-ldis-border bg-ldis-mist text-ldis-steel" />
          </div>
        </div>

        <div className="rounded-xl border-2 border-ldis-navy/25 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-navy">
            Avec LDIS
          </span>
          <div className="mt-3">
            <Flow
              etapes={avecLDIS}
              itemClass="border-ldis-navy/30 bg-ldis-mist font-semibold text-ldis-navy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
