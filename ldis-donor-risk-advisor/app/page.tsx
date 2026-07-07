'use client';

import { useCallback, useRef, useState } from 'react';
import Header from '@/components/Header';
import PositioningBanner from '@/components/PositioningBanner';
import QuickNav from '@/components/QuickNav';
import PourquoiLDIS from '@/components/PourquoiLDIS';
import Stepper from '@/components/Stepper';
import DemoStorySection from '@/components/DemoStorySection';
import CaseSelector from '@/components/CaseSelector';
import DonorForm from '@/components/DonorForm';
import AnalysisAnimation from '@/components/AnalysisAnimation';
import RiskResultPanel from '@/components/RiskResultPanel';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import ComparisonSection from '@/components/ComparisonSection';
import ModulesSection from '@/components/ModulesSection';
import ImpactSection from '@/components/ImpactSection';
import ValueSection from '@/components/ValueSection';
import PiloteSection from '@/components/PiloteSection';
import FAQSection from '@/components/FAQSection';
import RoadmapSection from '@/components/RoadmapSection';
import Disclaimer from '@/components/Disclaimer';
import { casDonneurs } from '@/lib/cases';
import { computeRisk } from '@/lib/riskEngine';
import { DonneurInfo, KpisExecutifs, ResultatAnalyse, ResultatsBiologiques } from '@/lib/types';

const casInitial = casDonneurs[0];

const KPIS_INITIAUX: KpisExecutifs = {
  donsAnalyses: 1243,
  liberationsStandard: 1011,
  recommandationsNAT: 159,
  quarantaines: 73,
};

export default function Page() {
  const [selectedId, setSelectedId] = useState(casInitial.id);
  const [donneur, setDonneur] = useState<DonneurInfo>(casInitial.donneur);
  const [biologie, setBiologie] = useState<ResultatsBiologiques>(casInitial.biologie);
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [pourquoiOuvert, setPourquoiOuvert] = useState(false);
  const [valeurVue, setValeurVue] = useState(false);
  const [modePresentation, setModePresentation] = useState(false);
  const [kpis, setKpis] = useState<KpisExecutifs>(KPIS_INITIAUX);
  const resultatEnAttente = useRef<ResultatAnalyse | null>(null);

  const handleSelectCase = (id: string) => {
    const cas = casDonneurs.find((c) => c.id === id);
    if (!cas) return;
    setSelectedId(id);
    setDonneur(cas.donneur);
    setBiologie(cas.biologie);
    setResultat(null);
    setAnalyzing(false);
    setPourquoiOuvert(false);
  };

  const handleDonneurChange = (patch: Partial<DonneurInfo>) => {
    setDonneur((prev) => ({ ...prev, ...patch }));
    setResultat(null);
    setAnalyzing(false);
    setPourquoiOuvert(false);
  };

  const handleBiologieChange = (patch: Partial<ResultatsBiologiques>) => {
    setBiologie((prev) => ({ ...prev, ...patch }));
    setResultat(null);
    setAnalyzing(false);
    setPourquoiOuvert(false);
  };

  const handleAnalyser = () => {
    if (analyzing) return;
    resultatEnAttente.current = computeRisk(donneur, biologie);
    setResultat(null);
    setPourquoiOuvert(false);
    setAnalyzing(true);
  };

  const handleAnalysisComplete = useCallback(() => {
    const calc = resultatEnAttente.current;
    if (calc) {
      setResultat(calc);
      setKpis((prev) => ({
        donsAnalyses: prev.donsAnalyses + 1,
        liberationsStandard: prev.liberationsStandard + (calc.typeDecision === 'liberation' ? 1 : 0),
        recommandationsNAT: prev.recommandationsNAT + (calc.typeDecision === 'nat' ? 1 : 0),
        quarantaines: prev.quarantaines + (calc.typeDecision === 'quarantaine' ? 1 : 0),
      }));
    }
    setAnalyzing(false);
  }, []);

  const handleReset = () => {
    handleSelectCase(casInitial.id);
  };

  const handleDecouvrirValeur = () => {
    setValeurVue(true);
    document.getElementById('valeur-cnts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const casActuel = casDonneurs.find((c) => c.id === selectedId) ?? casInitial;

  const etapeActuelle = analyzing
    ? 3
    : !resultat
      ? 2
      : valeurVue
        ? 6
        : pourquoiOuvert
          ? 5
          : 4;

  return (
    <main className={modePresentation ? 'mode-presentation' : undefined}>
      <Header />
      <PositioningBanner />
      <QuickNav
        modePresentation={modePresentation}
        onToggleModePresentation={() => setModePresentation((v) => !v)}
      />
      <PourquoiLDIS />
      <Stepper etapeActuelle={etapeActuelle} />
      <DemoStorySection />
      <CaseSelector cas={casDonneurs} selectedId={selectedId} onSelect={handleSelectCase} />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div key={selectedId} className="ldis-transition grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <DonorForm
              donneur={donneur}
              biologie={biologie}
              onDonneurChange={handleDonneurChange}
              onBiologieChange={handleBiologieChange}
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleAnalyser}
                disabled={analyzing}
                className="flex-1 rounded-md bg-ldis-navy px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ldis-navyLight disabled:cursor-not-allowed disabled:opacity-60"
              >
                {analyzing ? 'Analyse en cours…' : 'Analyser le risque'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-ldis-border px-4 py-3 text-sm font-medium text-ldis-steel transition hover:border-ldis-steel"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          <div id="resultat" className="scroll-mt-24">
            {analyzing ? (
              <AnalysisAnimation onComplete={handleAnalysisComplete} />
            ) : (
              <RiskResultPanel
                resultat={resultat}
                donneur={donneur}
                casNom={casActuel.nom}
                pourquoiOuvert={pourquoiOuvert}
                onTogglePourquoi={() => setPourquoiOuvert((v) => !v)}
              />
            )}

            {resultat && !analyzing && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleDecouvrirValeur}
                  className="text-sm font-medium text-ldis-navy underline decoration-ldis-border underline-offset-4 hover:decoration-ldis-navy"
                >
                  Découvrir la valeur pour le CNTS →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <ExecutiveDashboard kpis={kpis} />
      <ComparisonSection />
      <ModulesSection />
      <ImpactSection />
      <ValueSection />
      <PiloteSection />
      <FAQSection />
      <RoadmapSection />
      <Disclaimer />
    </main>
  );
}
