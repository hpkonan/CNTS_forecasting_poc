export default function PourquoiLDIS() {
  return (
    <section id="vision" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">Pourquoi LDIS ?</h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ldis-steel">
        Les laboratoires de transfusion disposent déjà de nombreuses informations : questionnaire
        donneur, historique, résultats sérologiques, paramètres biologiques et contexte
        épidémiologique. Mais ces informations sont souvent analysées séparément. LDIS les réunit
        dans une lecture structurée pour produire une recommandation claire, justifiée et
        traçable.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
            Aujourd&rsquo;hui
          </span>
          <p className="mt-2 text-sm leading-relaxed text-ldis-navy">
            Questionnaire donneur + résultats biologiques + expérience individuelle = décision
            potentiellement variable selon les situations.
          </p>
        </div>
        <div className="rounded-xl border-2 border-ldis-navy/25 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-ldis-navy">
            Avec LDIS
          </span>
          <p className="mt-2 text-sm leading-relaxed text-ldis-navy">
            Données donneur + résultats biologiques + règles métier + analyse structurée =
            recommandation homogène, explicable et traçable.
          </p>
        </div>
      </div>
    </section>
  );
}
