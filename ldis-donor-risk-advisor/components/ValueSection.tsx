const valeurs = [
  {
    titre: 'Sécurité transfusionnelle',
    texte: 'Aide à identifier les profils nécessitant une vigilance renforcée.',
  },
  {
    titre: 'Standardisation',
    texte: 'Réduit la variabilité des décisions entre utilisateurs.',
  },
  {
    titre: 'Optimisation des coûts',
    texte: 'Aide à prioriser les tests complémentaires coûteux.',
  },
  {
    titre: 'Traçabilité',
    texte: 'Documente les raisons de chaque recommandation.',
  },
  {
    titre: 'Formation',
    texte: "Accompagne les jeunes biologistes et techniciens dans le raisonnement décisionnel.",
  },
  {
    titre: 'Pilotage',
    texte:
      "Prépare une future exploitation des données pour la qualité et la surveillance épidémiologique.",
  },
];

export default function ValueSection() {
  return (
    <section id="valeur-cnts" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">Valeur pour le CNTS</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ldis-steel">
        Le Donor Risk Advisor transforme des informations dispersées en recommandation claire,
        justifiée et traçable.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {valeurs.map((v) => (
          <div key={v.titre} className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ldis-navy">{v.titre}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ldis-steel">{v.texte}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
