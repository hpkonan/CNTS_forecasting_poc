import { NiveauRisque } from '@/lib/types';

interface RiskGaugeProps {
  score: number;
  scoreMax: number;
  niveau: NiveauRisque;
}

const feux: { niveau: NiveauRisque; label: string; active: string; inactive: string }[] = [
  { niveau: 'Faible', label: 'Faible', active: 'bg-risk-low', inactive: 'bg-risk-low/20' },
  { niveau: 'Intermédiaire', label: 'Intermédiaire', active: 'bg-risk-mid', inactive: 'bg-risk-mid/20' },
  { niveau: 'Élevé', label: 'Élevé', active: 'bg-risk-high', inactive: 'bg-risk-high/20' },
];

export default function RiskGauge({ score, scoreMax, niveau }: RiskGaugeProps) {
  return (
    <div>
      <div className="flex gap-2">
        {feux.map((feu) => {
          const active = feu.niveau === niveau;
          return (
            <div key={feu.niveau} className="flex-1">
              <div
                className={`rounded-full transition-all duration-300 ${
                  active ? `h-4 shadow-sm ${feu.active}` : `h-2 ${feu.inactive}`
                }`}
              />
              <div
                className={`mt-1 text-center text-[11px] font-medium ${
                  active ? 'text-ldis-navy' : 'text-ldis-steel/60'
                }`}
              >
                {feu.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="presentation-hide mt-2 text-center text-xs text-ldis-steel">
        Score de risque (indicatif) : <span className="font-semibold text-ldis-navy">{score}</span>{' '}
        / {scoreMax}
      </div>
    </div>
  );
}
