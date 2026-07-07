const PERIMETRE = [
  'Donor Risk Advisor uniquement',
  'Données anonymisées ou fictives au départ',
  'Comparaison avec les décisions biologiques habituelles',
  'Validation finale toujours réalisée par les professionnels habilités',
];

const DONNEES_MINIMALES = [
  'Type de donneur : premier don ou donneur régulier',
  'Historique simplifié des dons',
  'Informations du questionnaire',
  'Résultats sérologiques',
  'Paramètres biologiques simples',
  'Décision finale prise par le biologiste',
];

const CRITERES_SUCCES = [
  'Cohérence des recommandations avec les décisions biologiques',
  "Temps moyen d'analyse",
  'Qualité des justifications',
  'Acceptabilité par les utilisateurs',
  "Potentiel d'optimisation des tests complémentaires",
  "Intérêt du DG pour une extension à d'autres modules",
];

const LIVRABLES = [
  'Démonstrateur adapté au contexte CNTS',
  "Rapport d'évaluation",
  "Cartographie des cas d'usage prioritaires",
  'Roadmap LDIS adaptée au CNTS',
];

function ListeCard({ titre, items }: { titre: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-ldis-navy">{titre}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-ldis-steel">
            <span className="text-ldis-navy">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PiloteSection() {
  return (
    <section id="pilote" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
      <h2 className="text-center text-xl font-semibold text-ldis-navy">
        Proposition de pilote CNTS
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ldis-steel">
        L&rsquo;objectif d&rsquo;un pilote ne serait pas de remplacer les processus actuels, mais
        d&rsquo;évaluer en conditions réelles la capacité de LDIS à assister, standardiser et
        documenter certaines décisions biologiques.
      </p>

      <div className="mx-auto mt-6 w-fit rounded-full bg-ldis-mist px-4 py-1.5 text-sm font-semibold text-ldis-navy">
        Durée proposée : 3 mois
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListeCard titre="Périmètre" items={PERIMETRE} />
        <ListeCard titre="Données minimales nécessaires" items={DONNEES_MINIMALES} />
        <ListeCard titre="Critères de succès" items={CRITERES_SUCCES} />
        <ListeCard titre="Livrables du pilote" items={LIVRABLES} />
      </div>
    </section>
  );
}
