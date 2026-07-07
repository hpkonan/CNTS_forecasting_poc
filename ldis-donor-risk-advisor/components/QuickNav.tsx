'use client';

interface QuickNavProps {
  modePresentation: boolean;
  onToggleModePresentation: () => void;
}

const LIENS = [
  { href: '#vision', label: 'Vision' },
  { href: '#demo', label: 'Démo' },
  { href: '#resultat', label: 'Résultat' },
  { href: '#impact', label: 'Impact' },
  { href: '#pilote', label: 'Pilote' },
  { href: '#faq', label: 'FAQ' },
];

export default function QuickNav({ modePresentation, onToggleModePresentation }: QuickNavProps) {
  return (
    <nav
      aria-label="Navigation rapide"
      className="sticky top-0 z-30 border-b border-ldis-border bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2">
        <ul className="flex flex-1 gap-1 overflow-x-auto text-sm">
          {LIENS.map((lien) => (
            <li key={lien.href} className="flex-shrink-0">
              <a
                href={lien.href}
                className="block whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium text-ldis-steel transition hover:bg-ldis-mist hover:text-ldis-navy"
              >
                {lien.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onToggleModePresentation}
          aria-pressed={modePresentation}
          className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            modePresentation
              ? 'border-ldis-navy bg-ldis-navy text-white'
              : 'border-ldis-border text-ldis-steel hover:border-ldis-steel'
          }`}
        >
          {modePresentation ? 'Mode présentation : activé' : 'Mode présentation'}
        </button>
      </div>
    </nav>
  );
}
