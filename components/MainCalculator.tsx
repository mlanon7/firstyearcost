'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Copy, Printer, RotateCcw, Sparkles } from 'lucide-react';
import {
  calculate,
  defaultInputs,
  type CalculatorInputs,
} from '@/lib/calculator';
import { stateChildcare } from '@/data/stateChildcare';
import { presets } from '@/data/presets';
import { Segmented } from './Segmented';
import { Slider } from './Slider';
import { StatCard } from './StatCard';
import { BreakdownBar } from './BreakdownBar';
import { Disclaimer } from './Disclaimer';
import { formatUSD } from '@/lib/format';
import {
  tipsFirstBaby, tipsChildcare, tipsFeeding, tipsFormulaType,
  tipsDiapers, tipsDiaperBrand, tipsGearTier, tipsGearUsed,
  tipsRegistry, tipsInsurance, tipsDelivery,
} from '@/content/optionTips';

// Recharts is ~80kB gzipped — load it only on the client and only when the
// calculator renders, so it doesn't bloat the homepage's initial JS bundle.
const MonthlyChart = dynamic(
  () => import('./MonthlyChart').then((m) => m.MonthlyChart),
  { ssr: false, loading: () => <div className="h-64 rounded-xl bg-ink-50 animate-pulse" aria-hidden /> }
);

export function MainCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculate(inputs), [inputs]);

  function setField<K extends keyof CalculatorInputs>(k: K, v: CalculatorInputs[K]) {
    setInputs((prev) => {
      const next = { ...prev, [k]: v };
      // When the user picks a plan with no paid childcare, zero the months
      // slider so it doesn't display a stale value. When they switch back to
      // a paid plan from one of those, restore a sensible default — but only
      // if the current value is 0 (to avoid clobbering an intentional setting).
      if (k === 'childcarePlan') {
        const newPlan = v as CalculatorInputs['childcarePlan'];
        const noPaid = newPlan === 'none' || newPlan === 'family';
        if (noPaid) {
          next.childcareMonths = 0;
        } else if (prev.childcareMonths === 0) {
          next.childcareMonths = 9;
        }
      }
      return next;
    });
  }

  function applyPreset(p: typeof presets[number]) {
    setInputs({ ...defaultInputs, ...p.inputs } as CalculatorInputs);
  }

  function handleReset() {
    setInputs(defaultInputs);
  }

  function handleCopy() {
    const lines = [
      `My baby's first-year estimate (planning):`,
      `Total: ${formatUSD(result.total.mid)} (range ${formatUSD(result.total.low)}–${formatUSD(result.total.high)})`,
      `One-time setup: ${formatUSD(result.oneTimeSetup.mid)}`,
      `Childcare: ${formatUSD(result.childcare.mid)}`,
      `Feeding: ${formatUSD(result.feeding.mid)}`,
      `Diapers: ${formatUSD(result.diapers.mid)}`,
      `Gear & clothing: ${formatUSD(result.gear.mid + result.clothing.mid)}`,
      `Medical OOP: ${formatUSD(result.medical.mid)}`,
      `Generated with FirstYearCost.com`,
    ].join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(lines)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }

  function handlePrint() {
    if (typeof window !== 'undefined') window.print();
  }

  // Warm-palette breakdown colors. Kept in sync with MonthlyChart's COLORS.
  const breakdownRows = [
    { label: 'Childcare',          value: result.childcare.mid, color: '#c75f3e' }, // terracotta
    { label: 'Feeding',            value: result.feeding.mid,   color: '#e08515' }, // honey
    { label: 'Diapers & wipes',    value: result.diapers.mid,   color: '#efbb9d' }, // peach
    { label: 'Gear',               value: result.gear.mid,      color: '#6b563b' }, // coffee
    { label: 'Clothing',           value: result.clothing.mid,  color: '#fcdb7a' }, // light honey
    { label: 'Medical out-of-pocket', value: result.medical.mid,color: '#b6371a' }, // sienna
    { label: 'Misc.',              value: result.miscMonthlyYear.mid, color: '#d7c2a1' }, // warm taupe
  ];

  return (
    <section id="calculator" className="container-pg">
      <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
        {/* INPUTS COLUMN */}
        <div className="card p-6 lg:p-8 space-y-6">
          {/* Presets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <h3 className="font-semibold text-ink-900">Try a scenario preset</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-ink-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 transition text-ink-700"
                  title={p.blurb}
                >
                  {p.name}
                </button>
              ))}
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-ink-200 hover:bg-ink-50 transition text-ink-500 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          <hr className="border-ink-100" />

          {/* Location & baby */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label" htmlFor="state">State</label>
              <select
                id="state"
                className="input"
                value={inputs.state}
                onChange={(e) => setField('state', e.target.value as CalculatorInputs['state'])}
              >
                {stateChildcare.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <p className="help">Used for childcare cost ranges.</p>
            </div>

            <div>
              <label className="label">First baby?</label>
              <Segmented
                value={inputs.isFirstBaby ? 'yes' : 'no'}
                onChange={(v) => setField('isFirstBaby', v === 'yes')}
                options={[
                  { value: 'yes', label: 'First baby',       info: tipsFirstBaby.yes },
                  { value: 'no',  label: 'Additional child', info: tipsFirstBaby.no  },
                ]}
                ariaLabel="First baby?"
              />
              <p className="help">Additional children typically reuse gear & clothes.</p>
            </div>
          </div>

          {/* Childcare */}
          <div className="space-y-4">
            <h4 className="h4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Childcare
            </h4>
            <div>
              <label className="label">Childcare plan</label>
              <Segmented
                value={inputs.childcarePlan}
                onChange={(v) => setField('childcarePlan', v)}
                ariaLabel="Childcare plan"
                options={[
                  { value: 'centerCare',  label: 'Center daycare', info: tipsChildcare.centerCare },
                  { value: 'homeCare',    label: 'Home daycare',   info: tipsChildcare.homeCare   },
                  { value: 'nanny',       label: 'Nanny',          info: tipsChildcare.nanny      },
                  { value: 'nannyShare',  label: 'Nanny share',    info: tipsChildcare.nannyShare },
                  { value: 'partTime',    label: 'Part-time',      info: tipsChildcare.partTime   },
                  { value: 'family',      label: 'Family help',    info: tipsChildcare.family     },
                  { value: 'none',        label: 'None',           info: tipsChildcare.none       },
                  { value: 'unsure',      label: 'Unsure',         info: tipsChildcare.unsure     },
                ]}
              />
            </div>
            <div>
              <label className="label">Months of paid childcare in first year</label>
              <Slider
                min={0}
                max={12}
                value={inputs.childcareMonths}
                onChange={(v) => setField('childcareMonths', v)}
                suffix="mo"
                disabled={inputs.childcarePlan === 'none' || inputs.childcarePlan === 'family'}
              />
              <p className="help">
                {inputs.childcarePlan === 'none'
                  ? 'No paid childcare planned — slider locked at 0. Pick a paid plan above to model months.'
                  : inputs.childcarePlan === 'family'
                  ? 'Family help is unpaid — slider locked at 0. Pick a paid plan above to model months.'
                  : 'Many parents start daycare around month 3–4 after parental leave.'}
              </p>
            </div>
          </div>

          {/* Feeding */}
          <div className="space-y-4">
            <h4 className="h4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sun-500" />
              Feeding
            </h4>
            <div>
              <label className="label">Feeding plan</label>
              <Segmented
                value={inputs.feedingPlan}
                onChange={(v) => setField('feedingPlan', v)}
                ariaLabel="Feeding plan"
                options={[
                  { value: 'breastfeeding', label: 'Breastfeeding', info: tipsFeeding.breastfeeding },
                  { value: 'formula',       label: 'Formula',       info: tipsFeeding.formula       },
                  { value: 'combo',         label: 'Combo',         info: tipsFeeding.combo         },
                  { value: 'unsure',        label: 'Unsure',        info: tipsFeeding.unsure        },
                ]}
              />
              <p className="help">No judgment — pick whatever fits your situation. We don't give feeding advice.</p>
            </div>
            {(inputs.feedingPlan === 'formula' || inputs.feedingPlan === 'combo') && (
              <div>
                <label className="label">Formula type</label>
                <Segmented
                  value={inputs.formulaType ?? 'standardPowder'}
                  onChange={(v) => setField('formulaType', v)}
                  ariaLabel="Formula type"
                  options={[
                    { value: 'standardPowder', label: 'Standard powder', info: tipsFormulaType.standardPowder },
                    { value: 'sensitive',      label: 'Sensitive',       info: tipsFormulaType.sensitive      },
                    { value: 'hypoallergenic', label: 'Hypoallergenic',  info: tipsFormulaType.hypoallergenic },
                    { value: 'readyToFeed',    label: 'Ready-to-feed',   info: tipsFormulaType.readyToFeed    },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Diapers */}
          <div className="space-y-4">
            <h4 className="h4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral-500" />
              Diapers
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Diaper plan</label>
                <Segmented
                  value={inputs.diaperPlan}
                  onChange={(v) => setField('diaperPlan', v)}
                  ariaLabel="Diaper plan"
                  options={[
                    { value: 'disposable', label: 'Disposable', info: tipsDiapers.disposable },
                    { value: 'cloth',      label: 'Cloth',      info: tipsDiapers.cloth      },
                    { value: 'mix',        label: 'Mix',        info: tipsDiapers.mix        },
                    { value: 'unsure',     label: 'Unsure',     info: tipsDiapers.unsure     },
                  ]}
                />
              </div>
              <div>
                <label className="label">Brand tier</label>
                <Segmented
                  value={inputs.diaperBrand}
                  onChange={(v) => setField('diaperBrand', v)}
                  ariaLabel="Diaper brand"
                  options={[
                    { value: 'budget',     label: 'Budget',     info: tipsDiaperBrand.budget     },
                    { value: 'mainstream', label: 'Mainstream', info: tipsDiaperBrand.mainstream },
                    { value: 'premium',    label: 'Premium',    info: tipsDiaperBrand.premium    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Gear */}
          <div className="space-y-4">
            <h4 className="h4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ink-700" />
              Gear & nursery
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Gear style</label>
                <Segmented
                  value={inputs.gearTier}
                  onChange={(v) => setField('gearTier', v)}
                  ariaLabel="Gear tier"
                  options={[
                    { value: 'budget',   label: 'Budget',   info: tipsGearTier.budget   },
                    { value: 'standard', label: 'Standard', info: tipsGearTier.standard },
                    { value: 'premium',  label: 'Premium',  info: tipsGearTier.premium  },
                  ]}
                />
              </div>
              <div>
                <label className="label">Used / hand-me-down OK?</label>
                <Segmented
                  value={inputs.gearUsed ? 'yes' : 'no'}
                  onChange={(v) => setField('gearUsed', v === 'yes')}
                  ariaLabel="Used gear"
                  options={[
                    { value: 'yes', label: 'Yes',        info: tipsGearUsed.yes },
                    { value: 'no',  label: 'Mostly new', info: tipsGearUsed.no  },
                  ]}
                />
              </div>
            </div>
            <div>
              <label className="label">Registry / shower help</label>
              <Segmented
                value={inputs.registryHelp}
                onChange={(v) => setField('registryHelp', v)}
                ariaLabel="Registry help"
                options={[
                  { value: 'low',    label: 'Low',    info: tipsRegistry.low    },
                  { value: 'medium', label: 'Medium', info: tipsRegistry.medium },
                  { value: 'high',   label: 'High',   info: tipsRegistry.high   },
                ]}
              />
              <p className="help">Reduces the out-of-pocket gear cost by an assumed coverage %.</p>
            </div>
          </div>

          {/* Birth & insurance */}
          <div className="space-y-4">
            <h4 className="h4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral-400" />
              Birth & insurance
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Insurance type</label>
                <Segmented
                  value={inputs.insurance}
                  onChange={(v) => setField('insurance', v)}
                  ariaLabel="Insurance"
                  options={[
                    { value: 'employer',    label: 'Employer plan',     info: tipsInsurance.employer    },
                    { value: 'marketplace', label: 'Marketplace',       info: tipsInsurance.marketplace },
                    { value: 'medicaid',    label: 'Medicaid',          info: tipsInsurance.medicaid    },
                    { value: 'uninsured',   label: 'Uninsured / unsure',info: tipsInsurance.uninsured   },
                  ]}
                />
              </div>
              <div>
                <label className="label">Expected delivery</label>
                <Segmented
                  value={inputs.delivery}
                  onChange={(v) => setField('delivery', v)}
                  ariaLabel="Delivery"
                  options={[
                    { value: 'unknown',  label: 'Unknown',   info: tipsDelivery.unknown  },
                    { value: 'vaginal',  label: 'Vaginal',   info: tipsDelivery.vaginal  },
                    { value: 'csection', label: 'C-section', info: tipsDelivery.csection },
                  ]}
                />
              </div>
            </div>
            <div>
              <label className="label">Unpaid parental leave (months)</label>
              <Slider
                min={0}
                max={12}
                value={inputs.parentalLeaveUnpaidMonths}
                onChange={(v) => setField('parentalLeaveUnpaidMonths', v)}
                suffix="mo"
              />
              <p className="help">For your awareness — not added to the baby cost total.</p>
            </div>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
          <div className="card p-6 bg-gradient-to-br from-white to-teal-50/40 border-teal-200">
            <p className="pill pill-teal mb-2">Estimated first-year total</p>
            <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
              {formatUSD(result.total.mid)}
            </p>
            <p className="mt-1.5 text-sm text-ink-600 tabular-nums">
              Range {formatUSD(result.total.low)} – {formatUSD(result.total.high)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white border border-ink-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">One-time</p>
                <p className="text-lg font-bold text-ink-900 tabular-nums">{formatUSD(result.oneTimeSetup.mid)}</p>
              </div>
              <div className="rounded-xl bg-white border border-ink-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold" title="Childcare + feeding + diapers + misc, divided by 12. Excludes one-time gear and the birth bill.">Monthly recurring</p>
                <p className="text-lg font-bold text-ink-900 tabular-nums">{formatUSD(result.monthlyRecurringMid)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 no-print">
              <button onClick={handleCopy} className="btn btn-ghost text-xs">
                <Copy className="w-3.5 h-3.5" /> Copy estimate
              </button>
              <button onClick={handlePrint} className="btn btn-ghost text-xs">
                <Printer className="w-3.5 h-3.5" /> Print / save PDF
              </button>
              <span
                aria-live="polite"
                className={`text-xs text-teal-700 transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}
              >
                Copied
              </span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-ink-900 mb-4">Cost breakdown</h3>
            <BreakdownBar rows={breakdownRows} />
          </div>

          <Disclaimer />
        </aside>
      </div>

      {/* Bottom: chart, stats, lists */}
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyChart data={result.monthly} />
        </div>
        <div className="space-y-6">
          <StatCard
            label="Childcare share"
            value={result.childcare.mid}
            range={[result.childcare.low, result.childcare.high]}
            accent="teal"
            hint="Often the single biggest line item — paid only for selected months."
          />
          <StatCard
            label="Birth out-of-pocket"
            value={result.medical.mid}
            range={[result.medical.low, result.medical.high]}
            accent="coral"
            hint="Heavily affected by your deductible, plan, and delivery type."
          />
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sun-500" /> Costs you may be able to delay
          </h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {result.delayItems.map((d, i) => (
              <li key={i} className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-sun-600 mt-0.5 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-coral-500" /> Buy new or verify carefully
          </h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {result.buyNewItems.map((d, i) => (
              <li key={i} className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-coral-600 mt-0.5 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result.notes.length > 0 && (
        <div className="mt-6 card p-5 bg-ink-50/30">
          <ul className="text-sm text-ink-600 space-y-1.5">
            {result.notes.map((n, i) => (
              <li key={i}>• {n}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
