'use client';

import { useEffect, useState } from 'react';

const ETAPES = [
  'Analyse du questionnaire',
  'Analyse du profil épidémiologique',
  'Analyse des résultats biologiques',
  'Application des règles métier',
  'Génération de la recommandation',
];

interface AnalysisAnimationProps {
  onComplete: () => void;
}

export default function AnalysisAnimation({ onComplete }: AnalysisAnimationProps) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    const next = () => {
      if (cancelled) return;
      index += 1;
      setVisible(index);
      if (index < ETAPES.length) {
        timer = setTimeout(next, 260);
      } else {
        timer = setTimeout(() => {
          if (!cancelled) onComplete();
        }, 350);
      }
    };

    timer = setTimeout(next, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="flex h-full min-h-[320px] flex-col justify-center rounded-xl border border-ldis-border bg-white p-8">
      <div className="mx-auto w-full max-w-xs space-y-3">
        <p className="mb-1 text-center text-sm font-semibold text-ldis-navy">Analyse en cours…</p>
        {ETAPES.map((etape, index) => {
          const done = index < visible;
          return (
            <div key={etape} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-200 ${
                  done
                    ? 'border-ldis-navy bg-ldis-navy text-white'
                    : 'border-ldis-border text-transparent'
                }`}
              >
                ✓
              </span>
              <span
                className={`text-sm transition-colors duration-200 ${
                  done ? 'text-ldis-navy' : 'text-ldis-steel/50'
                }`}
              >
                {etape}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
