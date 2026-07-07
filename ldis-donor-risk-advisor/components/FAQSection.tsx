const FAQ = [
  {
    q: 'Est-ce que LDIS remplace le biologiste ?',
    r: 'Non. LDIS assiste la décision, propose une recommandation et fournit une justification. La décision finale reste toujours humaine et réglementaire.',
  },
  {
    q: 'Avez-vous besoin de beaucoup de données pour commencer ?',
    r: "Non. La première version peut fonctionner avec des règles métier et des scénarios structurés. Les données historiques permettront ensuite d'améliorer et d'adapter le système.",
  },
  {
    q: 'Est-ce une intelligence artificielle ?',
    r: "La première version est un système d'aide à la décision basé sur des règles expertes. Des modules IA pourront être ajoutés progressivement si les données disponibles le permettent.",
  },
  {
    q: 'Est-ce connecté au système informatique du CNTS ?',
    r: 'Pas dans ce démonstrateur. Une connexion au LIMS ou aux bases internes peut être envisagée dans une phase ultérieure.',
  },
  {
    q: 'Quels sont les risques ?',
    r: "Les principaux risques sont la qualité des données d'entrée, l'acceptabilité par les utilisateurs et la nécessité de valider les règles métier avec les biologistes.",
  },
  {
    q: 'Quelle est la première étape réaliste ?',
    r: "Un pilote limité de trois mois sur Donor Risk Advisor, avec données anonymisées, revue biologique et rapport d'évaluation.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">FAQs</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {FAQ.map((item, index) => (
          <details
            key={item.q}
            className="group rounded-lg border border-ldis-border bg-white p-4 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-ldis-navy marker:content-none">
              <span className="mr-2 text-ldis-steel">Q{index + 1}.</span>
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ldis-steel">
              <span className="font-semibold text-ldis-navy">R. </span>
              {item.r}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
