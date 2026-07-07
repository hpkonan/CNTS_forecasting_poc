import { LogoMark } from './icons';

export default function Header() {
  return (
    <header className="border-b border-ldis-border bg-ldis-navy text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            POC démonstrateur — Données fictives
          </span>
          <span className="text-xs text-white/60">Laboratoire · CNTS Côte d&rsquo;Ivoire</span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <LogoMark className="h-8 w-8 self-center text-white/80 sm:h-9 sm:w-9" />
          <span className="text-4xl font-bold tracking-tight sm:text-5xl">LDIS</span>
          <span className="text-sm text-white/60 sm:text-base">
            Laboratory Decision Intelligence Suite
          </span>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Module
          </span>
          <span className="text-sm font-semibold">Donor Risk Advisor</span>
        </div>

        <p className="mt-3 max-w-3xl text-base text-white/80">
          Assistant d&rsquo;aide à la décision pour l&rsquo;évaluation du risque résiduel des
          donneurs de sang
        </p>

        <p className="mt-5 max-w-3xl border-l-2 border-white/30 pl-4 text-sm italic text-white/70">
          « Un copilote décisionnel pour aider les biologistes à prendre des décisions plus
          rapides, plus homogènes et mieux documentées. »
        </p>
      </div>
    </header>
  );
}
