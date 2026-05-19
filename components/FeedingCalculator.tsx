'use client';

import { useMemo, useState } from 'react';
import { Segmented } from './Segmented';
import {
  tipsFeeding, tipsFormulaType, tipsPumpCovered, tipsBottlesGear, tipsLactationConsult,
} from '@/content/optionTips';
import { Disclaimer } from './Disclaimer';
import {
  formulaCostPerMonth,
  breastfeedingSupplies,
  comboFeedingMultiplier,
} from '@/data/assumptions';
import { formatUSD } from '@/lib/format';

type Plan = 'breastfeeding' | 'formula' | 'combo';
type FormulaType = 'standardPowder' | 'sensitive' | 'hypoallergenic' | 'readyToFeed';

export function FeedingCalculator() {
  const [plan, setPlan] = useState<Plan>('combo');
  const [formulaType, setFormulaType] = useState<FormulaType>('standardPowder');
  const [pumpCovered, setPumpCovered] = useState<'yes'|'no'|'unsure'>('yes');
  const [bottlesGear, setBottlesGear] = useState<'minimal'|'standard'|'full'>('standard');
  const [lactationConsult, setLactationConsult] = useState<'no'|'yes'>('no');

  const result = useMemo(() => {
    let formulaAnnualLow = 0, formulaAnnualMid = 0, formulaAnnualHigh = 0;
    if (plan === 'formula' || plan === 'combo') {
      const f = formulaCostPerMonth[formulaType];
      const factor = plan === 'combo' ? comboFeedingMultiplier : 1;
      formulaAnnualLow = f.low * 12 * factor;
      formulaAnnualMid = f.mid * 12 * factor;
      formulaAnnualHigh = f.high * 12 * factor;
    }

    let suppliesLow = 0, suppliesMid = 0, suppliesHigh = 0;
    if (plan === 'breastfeeding' || plan === 'combo') {
      const s = breastfeedingSupplies;
      const pump =
        pumpCovered === 'yes' ? s.pumpOutOfPocket.low :
        pumpCovered === 'no'  ? s.pumpOutOfPocket.high :
        s.pumpOutOfPocket.mid;
      suppliesLow += pump;
      suppliesMid += pump;
      suppliesHigh += pump;

      const bottles =
        bottlesGear === 'minimal'  ? s.bottlesAndStorage.low :
        bottlesGear === 'standard' ? s.bottlesAndStorage.mid :
        s.bottlesAndStorage.high;
      suppliesLow += bottles * 0.85;
      suppliesMid += bottles;
      suppliesHigh += bottles * 1.2;

      suppliesLow += s.pumpPartsReplacement.low + s.bras.low + s.pads.low;
      suppliesMid += s.pumpPartsReplacement.mid + s.bras.mid + s.pads.mid;
      suppliesHigh += s.pumpPartsReplacement.high + s.bras.high + s.pads.high;

      if (lactationConsult === 'yes') {
        suppliesLow += s.lactationConsultOOP.low;
        suppliesMid += s.lactationConsultOOP.mid;
        suppliesHigh += s.lactationConsultOOP.high;
      }
    }

    const total = {
      low: formulaAnnualLow + suppliesLow,
      mid: formulaAnnualMid + suppliesMid,
      high: formulaAnnualHigh + suppliesHigh,
    };

    return { formulaAnnualLow, formulaAnnualMid, formulaAnnualHigh, suppliesLow, suppliesMid, suppliesHigh, total };
  }, [plan, formulaType, pumpCovered, bottlesGear, lactationConsult]);

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
      <div className="card p-6 lg:p-8 space-y-6">
        <div>
          <Segmented
            label="Feeding plan"
            value={plan}
            onChange={setPlan}
            options={[
              { value: 'breastfeeding', label: 'Breastfeeding', info: tipsFeeding.breastfeeding },
              { value: 'formula',       label: 'Formula',       info: tipsFeeding.formula       },
              { value: 'combo',         label: 'Combo',         info: tipsFeeding.combo         },
            ]}
            help="No judgment — pick what fits your situation."
          />
        </div>

        {(plan === 'formula' || plan === 'combo') && (
          <div>
            <Segmented
              label="Formula type"
              value={formulaType}
              onChange={setFormulaType}
              options={[
                { value: 'standardPowder', label: 'Standard powder', info: tipsFormulaType.standardPowder },
                { value: 'sensitive',      label: 'Sensitive',       info: tipsFormulaType.sensitive      },
                { value: 'hypoallergenic', label: 'Hypoallergenic',  info: tipsFormulaType.hypoallergenic },
                { value: 'readyToFeed',    label: 'Ready-to-feed',   info: tipsFormulaType.readyToFeed    },
              ]}
              help="Specialty formulas can run 2–3× standard. Talk with your pediatrician before switching types."
            />
          </div>
        )}

        {(plan === 'breastfeeding' || plan === 'combo') && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Segmented
                  label="Pump covered by insurance?"
                  value={pumpCovered}
                  onChange={setPumpCovered}
                  options={[
                    { value: 'yes',    label: 'Yes',    info: tipsPumpCovered.yes    },
                    { value: 'unsure', label: 'Unsure', info: tipsPumpCovered.unsure },
                    { value: 'no',     label: 'No',     info: tipsPumpCovered.no     },
                  ]}
                />
              </div>
              <div>
                <Segmented
                  label="Bottles & storage gear"
                  value={bottlesGear}
                  onChange={setBottlesGear}
                  options={[
                    { value: 'minimal',  label: 'Minimal',    info: tipsBottlesGear.minimal  },
                    { value: 'standard', label: 'Standard',   info: tipsBottlesGear.standard },
                    { value: 'full',     label: 'Full setup', info: tipsBottlesGear.full     },
                  ]}
                />
              </div>
            </div>
            <div>
              <Segmented
                label="Plan to use lactation consultant out-of-pocket?"
                value={lactationConsult}
                onChange={setLactationConsult}
                options={[
                  { value: 'no',  label: 'No',  info: tipsLactationConsult.no  },
                  { value: 'yes', label: 'Yes', info: tipsLactationConsult.yes },
                ]}
                help="Many insurers cover lactation consults; check with your plan first."
              />
            </div>
          </>
        )}

        <div className="rounded-xl bg-ink-50/40 border border-ink-100 p-4 text-sm text-ink-700">
          <strong className="text-ink-900">Note:</strong> We do not provide medical or feeding advice.
          Talk with your pediatrician about formula choice, allergies, and feeding concerns. The ranges
          here are planning estimates only.
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
        <div className="card p-6 bg-gradient-to-br from-white to-sun-50/40 border-sun-200">
          <p className="pill pill-sun mb-2">Estimated first-year feeding cost</p>
          <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
            {formatUSD(result.total.mid)}
          </p>
          <p className="mt-1 text-sm text-ink-600 tabular-nums">
            Range {formatUSD(result.total.low)} – {formatUSD(result.total.high)}
          </p>
          <hr className="my-4 border-ink-100" />
          {(plan === 'formula' || plan === 'combo') && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-ink-600">Formula portion</span>
              <span className="font-semibold text-ink-900 tabular-nums">{formatUSD(result.formulaAnnualMid)}</span>
            </div>
          )}
          {(plan === 'breastfeeding' || plan === 'combo') && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-ink-600">Breastfeeding supplies</span>
              <span className="font-semibold text-ink-900 tabular-nums">{formatUSD(result.suppliesMid)}</span>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink-900 mb-3 text-sm">Ballpark monthly costs</h3>
          <ul className="text-xs text-ink-700 space-y-1.5">
            <li className="flex justify-between"><span>Standard powder formula</span><span className="tabular-nums">$150–$320/mo</span></li>
            <li className="flex justify-between"><span>Sensitive formula</span><span className="tabular-nums">$220–$450/mo</span></li>
            <li className="flex justify-between"><span>Hypoallergenic formula</span><span className="tabular-nums">$380–$800/mo</span></li>
            <li className="flex justify-between"><span>Ready-to-feed</span><span className="tabular-nums">$350–$700/mo</span></li>
            <li className="flex justify-between"><span>Breastfeeding supplies (yr 1)</span><span className="tabular-nums">$150–$1,300</span></li>
          </ul>
        </div>

        <Disclaimer />
      </aside>
    </div>
  );
}
