const ETAPES = [
  'Sélectionner un scénario',
  'Consulter le profil donneur',
  'Analyser',
  'Recevoir la recommandation',
  'Comprendre pourquoi',
  'Découvrir la valeur pour le CNTS',
];

interface StepperProps {
  etapeActuelle: number;
}

export default function Stepper({ etapeActuelle }: StepperProps) {
  return (
    <nav
      aria-label="Parcours de démonstration"
      className="presentation-hide mx-auto max-w-6xl px-6 pt-6"
    >
      <ol className="flex flex-wrap items-center gap-y-2 text-xs">
        {ETAPES.map((etape, index) => {
          const numero = index + 1;
          const done = numero < etapeActuelle;
          const active = numero === etapeActuelle;
          return (
            <li key={etape} className="flex items-center">
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
                  active
                    ? 'bg-ldis-navy text-white'
                    : done
                      ? 'bg-ldis-mist text-ldis-navy'
                      : 'text-ldis-steel/50'
                }`}
              >
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] ${
                    active
                      ? 'bg-white/20 text-white'
                      : done
                        ? 'bg-ldis-navy text-white'
                        : 'border border-ldis-border'
                  }`}
                >
                  {done ? '✓' : numero}
                </span>
                {etape}
              </span>
              {numero < ETAPES.length && (
                <span aria-hidden className="mx-1 text-ldis-border">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
