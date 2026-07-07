const IMPACTS = [
  {
    titre: 'Sécurité transfusionnelle',
    texte:
      'Réduction du risque de décisions hétérogènes grâce à une lecture structurée des facteurs de risque.',
  },
  {
    titre: 'Homogénéité des pratiques',
    texte:
      "Même logique d'analyse appliquée à tous les dossiers, indépendamment de l'expérience individuelle.",
  },
  {
    titre: 'Optimisation des tests complémentaires',
    texte: 'Priorisation des tests NAT ou confirmations lorsque le profil le justifie.',
  },
  {
    titre: 'Traçabilité',
    texte:
      "Chaque recommandation est accompagnée d'une justification exploitable pour revue interne, qualité ou audit.",
  },
  {
    titre: 'Formation',
    texte: 'Outil pédagogique pour les jeunes biologistes, internes et techniciens.',
  },
  {
    titre: 'Pilotage stratégique',
    texte: 'Indicateurs consolidés pour suivre les décisions, les risques, les volumes et les tendances.',
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">
        Impact attendu pour le CNTS
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IMPACTS.map((i) => (
          <div key={i.titre} className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ldis-navy">{i.titre}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ldis-steel">{i.texte}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
