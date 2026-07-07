import { ResultatAnalyse } from '@/lib/types';

interface ExplanationPanelProps {
  resultat: ResultatAnalyse;
  ouvert: boolean;
  onToggle: () => void;
}

const couleurStatut: Record<string, string> = {
  risque: 'text-risk-high',
  protecteur: 'text-risk-low',
  neutre: 'text-ldis-steel',
};

export default function ExplanationPanel({ resultat, ouvert, onToggle }: ExplanationPanelProps) {
  return (
    <div className="mt-5 border-t border-ldis-border pt-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={ouvert}
        className="flex w-full items-center justify-between text-sm font-semibold text-ldis-navy"
      >
        <span>Pourquoi cette recommandation ?</span>
        <span className="text-lg leading-none text-ldis-steel">{ouvert ? '−' : '+'}</span>
      </button>

      {ouvert && (
        <div className="mt-3 space-y-4 rounded-lg bg-ldis-mist p-4 text-sm text-ldis-navy">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
              Règle métier appliquée
            </div>
            <p className="mt-1 leading-relaxed">{resultat.regleAppliquee}</p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ldis-steel">
              Détail du score (tous les facteurs évalués)
            </div>
            <ul className="mt-2 space-y-1">
              {resultat.elements.map((e) => (
                <li key={e.label} className="flex items-center justify-between gap-3">
                  <span className={couleurStatut[e.statut]}>{e.label}</span>
                  <span className="whitespace-nowrap font-medium text-ldis-navy">
                    {e.points > 0 ? `+${e.points}` : '0'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
