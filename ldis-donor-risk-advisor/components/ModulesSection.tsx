const MODULES = [
  {
    nom: 'Donor Risk Advisor',
    statut: 'Disponible dans ce démonstrateur',
    disponible: true,
  },
  { nom: 'Serology Interpreter', statut: 'Prochain module', disponible: false },
  { nom: 'NAT Optimizer', statut: 'À venir', disponible: false },
  { nom: 'QC Monitor', statut: 'À venir', disponible: false },
  { nom: 'Blood Release Assistant', statut: 'À venir', disponible: false },
  { nom: 'Epidemiology Watch', statut: 'À venir', disponible: false },
];

export default function ModulesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">
        LDIS, une plateforme modulaire
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ldis-steel">
        Donor Risk Advisor est le premier module d&rsquo;une suite décisionnelle pensée pour les
        laboratoires de transfusion.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.nom}
            className={`rounded-xl border p-5 shadow-sm ${
              m.disponible
                ? 'border-ldis-navy/30 bg-white'
                : 'border-ldis-border bg-ldis-mist/60'
            }`}
          >
            <h3 className={`text-sm font-semibold ${m.disponible ? 'text-ldis-navy' : 'text-ldis-steel'}`}>
              {m.nom}
            </h3>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                m.disponible
                  ? 'bg-risk-lowBg text-risk-low'
                  : 'bg-white text-ldis-steel/70 border border-ldis-border'
              }`}
            >
              {m.statut}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
