'use client';

import { CasDonneur } from '@/lib/types';

interface CaseSelectorProps {
  cas: CasDonneur[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CaseSelector({ cas, selectedId, onSelect }: CaseSelectorProps) {
  return (
    <section aria-label="Sélection d'un cas fictif" className="mx-auto max-w-6xl px-6 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ldis-steel">
        Scénarios de démonstration
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cas.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={active}
              className={`rounded-lg border p-4 text-left transition ${
                active
                  ? 'border-ldis-navy bg-ldis-navy text-white shadow-md'
                  : 'border-ldis-border bg-white text-ldis-navy hover:border-ldis-steel'
              }`}
            >
              <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-ldis-navy'}`}>
                {c.nom}
              </div>
              <div className={`mt-1 text-xs ${active ? 'text-white/70' : 'text-ldis-steel'}`}>
                {c.description}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
