export const DISCLAIMER_TEXTE =
  "Ce POC utilise des données fictives et des règles décisionnelles simplifiées. Il ne " +
  "constitue pas un dispositif médical, ne remplace pas les procédures du CNTS et ne doit " +
  "pas être utilisé pour une décision réelle. Toute décision biologique ou transfusionnelle " +
  "reste sous la responsabilité des professionnels habilités.";

export const DISCLAIMER_RENFORCE =
  "Ce démonstrateur est un POC produit basé sur des données fictives. Il n'est pas destiné à " +
  "une utilisation clinique directe. Toute utilisation réelle nécessiterait une validation " +
  "biologique, réglementaire, qualité et informatique par les équipes habilitées du CNTS.";

export default function Disclaimer() {
  return (
    <footer className="border-t border-ldis-border bg-ldis-mist">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <p className="text-xs leading-relaxed text-ldis-steel">{DISCLAIMER_TEXTE}</p>
        <p className="mt-2 text-xs leading-relaxed text-ldis-steel">{DISCLAIMER_RENFORCE}</p>
      </div>
    </footer>
  );
}
