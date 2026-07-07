'use client';

import {
  ComportementRisque,
  DonneurInfo,
  ResultatAntiHbc,
  ResultatBinaire,
  ResultatsBiologiques,
  ResultatSerologieVIH,
  Sexe,
  TypeDonneur,
} from '@/lib/types';
import Tooltip from './Tooltip';

interface DonorFormProps {
  donneur: DonneurInfo;
  biologie: ResultatsBiologiques;
  onDonneurChange: (patch: Partial<DonneurInfo>) => void;
  onBiologieChange: (patch: Partial<ResultatsBiologiques>) => void;
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ldis-steel">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full rounded-md border border-ldis-border bg-white px-3 py-2 text-sm text-ldis-navy focus:border-ldis-steel focus:outline-none focus:ring-1 focus:ring-ldis-steel';

export default function DonorForm({
  donneur,
  biologie,
  onDonneurChange,
  onBiologieChange,
}: DonorFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ldis-navy">
          Données donneur
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Identifiant donneur">
            <input
              className={inputClass}
              value={donneur.identifiant}
              onChange={(e) => onDonneurChange({ identifiant: e.target.value })}
            />
          </Field>
          <Field label="Âge">
            <input
              type="number"
              className={inputClass}
              value={donneur.age}
              onChange={(e) => onDonneurChange({ age: Number(e.target.value) })}
            />
          </Field>
          <Field label="Sexe">
            <select
              className={inputClass}
              value={donneur.sexe}
              onChange={(e) => onDonneurChange({ sexe: e.target.value as Sexe })}
            >
              <option>Homme</option>
              <option>Femme</option>
            </select>
          </Field>
          <Field label="Région">
            <input
              className={inputClass}
              value={donneur.region}
              onChange={(e) => onDonneurChange({ region: e.target.value })}
            />
          </Field>
          <Field label="Type de donneur">
            <select
              className={inputClass}
              value={donneur.typeDonneur}
              onChange={(e) => onDonneurChange({ typeDonneur: e.target.value as TypeDonneur })}
            >
              <option>Donneur régulier</option>
              <option>Premier don</option>
              <option>Donneur occasionnel</option>
            </select>
          </Field>
          <Field label="Nombre de dons antérieurs">
            <input
              type="number"
              className={inputClass}
              value={donneur.nombreDonsAnterieurs}
              onChange={(e) => onDonneurChange({ nombreDonsAnterieurs: Number(e.target.value) })}
            />
          </Field>
          <Field label="Dernier don">
            <input
              className={inputClass}
              value={donneur.dernierDonLabel}
              onChange={(e) => onDonneurChange({ dernierDonLabel: e.target.value })}
            />
          </Field>
          <Field label="Dernier don > 24 mois ?">
            <select
              className={inputClass}
              value={donneur.dernierDonPlus24Mois ? 'Oui' : 'Non'}
              onChange={(e) => onDonneurChange({ dernierDonPlus24Mois: e.target.value === 'Oui' })}
            >
              <option>Non</option>
              <option>Oui</option>
            </select>
          </Field>
          <Field label="Profession">
            <input
              className={inputClass}
              value={donneur.profession}
              onChange={(e) => onDonneurChange({ profession: e.target.value })}
            />
          </Field>
          <Field label="Voyage récent ?">
            <select
              className={inputClass}
              value={donneur.voyageRecent ? 'Oui' : 'Non'}
              onChange={(e) => onDonneurChange({ voyageRecent: e.target.value === 'Oui' })}
            >
              <option>Non</option>
              <option>Oui</option>
            </select>
          </Field>
          <Field label="Antécédent médical significatif ?">
            <select
              className={inputClass}
              value={donneur.antecedentMedical ? 'Oui' : 'Non'}
              onChange={(e) => onDonneurChange({ antecedentMedical: e.target.value === 'Oui' })}
            >
              <option>Non</option>
              <option>Oui</option>
            </select>
          </Field>
          <Field label="Comportement à risque déclaré">
            <select
              className={inputClass}
              value={donneur.comportementRisque}
              onChange={(e) =>
                onDonneurChange({ comportementRisque: e.target.value as ComportementRisque })
              }
            >
              <option>Non</option>
              <option>Oui</option>
              <option>Non déclaré</option>
            </select>
          </Field>
          {donneur.voyageRecent && (
            <Field label="Détail du voyage">
              <input
                className={inputClass}
                value={donneur.voyageRecentDetail}
                onChange={(e) => onDonneurChange({ voyageRecentDetail: e.target.value })}
              />
            </Field>
          )}
          {donneur.antecedentMedical && (
            <Field label="Détail de l'antécédent">
              <input
                className={inputClass}
                value={donneur.antecedentMedicalDetail}
                onChange={(e) => onDonneurChange({ antecedentMedicalDetail: e.target.value })}
              />
            </Field>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-ldis-border bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ldis-navy">
          Résultats biologiques
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="VIH sérologie">
            <select
              className={inputClass}
              value={biologie.vih}
              onChange={(e) => onBiologieChange({ vih: e.target.value as ResultatSerologieVIH })}
            >
              <option>Négatif</option>
              <option>Réactif faible</option>
              <option>Positif</option>
            </select>
          </Field>
          <Field label="VHB HBsAg">
            <select
              className={inputClass}
              value={biologie.hbsAg}
              onChange={(e) => onBiologieChange({ hbsAg: e.target.value as ResultatBinaire })}
            >
              <option>Négatif</option>
              <option>Positif</option>
            </select>
          </Field>
          <Field label={<TooltipLabel />}>
            <select
              className={inputClass}
              value={biologie.antiHbc}
              onChange={(e) => onBiologieChange({ antiHbc: e.target.value as ResultatAntiHbc })}
            >
              <option>Négatif</option>
              <option>Positif isolé</option>
              <option>Positif</option>
            </select>
          </Field>
          <Field label="VHC">
            <select
              className={inputClass}
              value={biologie.vhc}
              onChange={(e) => onBiologieChange({ vhc: e.target.value as ResultatBinaire })}
            >
              <option>Négatif</option>
              <option>Positif</option>
            </select>
          </Field>
          <Field label="Syphilis">
            <select
              className={inputClass}
              value={biologie.syphilis}
              onChange={(e) => onBiologieChange({ syphilis: e.target.value as ResultatBinaire })}
            >
              <option>Négatif</option>
              <option>Positif</option>
            </select>
          </Field>
          <Field label="ALT (UI/L)">
            <input
              type="number"
              className={inputClass}
              value={biologie.alt}
              onChange={(e) => onBiologieChange({ alt: Number(e.target.value) })}
            />
          </Field>
          <Field label="Hémoglobine (g/dL)">
            <input
              type="number"
              step="0.1"
              className={inputClass}
              value={biologie.hemoglobine}
              onChange={(e) => onBiologieChange({ hemoglobine: Number(e.target.value) })}
            />
          </Field>
          <Field label="NAT">
            <div className="flex h-[38px] items-center text-sm text-ldis-steel">
              Non réalisé
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}

function TooltipLabel() {
  return (
    <Tooltip label="Anticorps anti-HBc : marqueur d'un contact antérieur avec le virus de l'hépatite B. Un résultat positif isolé (sans HBsAg) peut justifier un test complémentaire.">
      <span>VHB anti-HBc</span>
    </Tooltip>
  );
}
