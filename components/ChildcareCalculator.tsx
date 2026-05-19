'use client';

import { useMemo, useState } from 'react';
import { Segmented } from './Segmented';
import { Slider } from './Slider';
import { tipsChildcare } from '@/content/optionTips';
import { Disclaimer } from './Disclaimer';
import {
  stateChildcare,
  type StateCode,
  applyCareTypeFactor,
} from '@/data/stateChildcare';
import { formatUSD, formatPercent } from '@/lib/format';

type CareType = 'centerCare' | 'homeCare' | 'nanny' | 'nannyShare' | 'partTime';

export function ChildcareCalculator({
  initialStateCode = 'CA',
}: { initialStateCode?: StateCode } = {}) {
  const [stateCode, setStateCode] = useState<StateCode>(initialStateCode);
  const [careType, setCareType] = useState<CareType>('centerCare');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [months, setMonths] = useState(9);
  const [registrationFee, setRegistrationFee] = useState(150);
  const [supplyFee, setSupplyFee] = useState(50);
  const [income, setIncome] = useState<number | ''>('');

  const state = stateChildcare.find((s) => s.code === stateCode)!;

  const result = useMemo(() => {
    let annualLow: number, annualHigh: number;
    if (careType === 'centerCare') {
      annualLow = state.centerLow;
      annualHigh = state.centerHigh;
    } else if (careType === 'homeCare') {
      annualLow = state.homeLow;
      annualHigh = state.homeHigh;
    } else {
      // nanny / nannyShare / partTime — multipliers come from
      // public/data/childcare_care_type_factors.csv.
      const r = applyCareTypeFactor(state, careType);
      annualLow = r.annualLow;
      annualHigh = r.annualHigh;
    }
    // Adjust for hours per week (40 = full-time baseline)
    const hourMult = hoursPerWeek / 40;
    annualLow *= hourMult;
    annualHigh *= hourMult;

    const monthlyLow = annualLow / 12;
    const monthlyHigh = annualHigh / 12;
    const periodLow = monthlyLow * months + registrationFee + supplyFee;
    const periodHigh = monthlyHigh * months + registrationFee + supplyFee;
    const periodMid = (periodLow + periodHigh) / 2;

    const annualMid = (annualLow + annualHigh) / 2;
    const incomePct = typeof income === 'number' && income > 0 ? (annualMid / income) * 100 : null;

    return {
      monthlyLow, monthlyHigh, periodLow, periodHigh, periodMid,
      annualLow, annualHigh, annualMid, incomePct,
    };
  }, [state, careType, hoursPerWeek, months, registrationFee, supplyFee, income]);

  const compareRows = (() => {
    const nannyShare = applyCareTypeFactor(state, 'nannyShare');
    const nanny = applyCareTypeFactor(state, 'nanny');
    const partTime = applyCareTypeFactor(state, 'partTime');
    return [
      { label: 'Center daycare',     annualLow: state.centerLow, annualHigh: state.centerHigh },
      { label: 'Home daycare',       annualLow: state.homeLow,   annualHigh: state.homeHigh },
      { label: 'Nanny share (1/2)',  annualLow: nannyShare.annualLow, annualHigh: nannyShare.annualHigh },
      { label: 'Nanny (full-time)',  annualLow: nanny.annualLow,      annualHigh: nanny.annualHigh },
      { label: 'Part-time (3 days)', annualLow: partTime.annualLow,   annualHigh: partTime.annualHigh },
    ];
  })();

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
      <div className="card p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="cc-state">State</label>
            <select id="cc-state" className="input" value={stateCode} onChange={(e) => setStateCode(e.target.value as StateCode)}>
              {stateChildcare.map((s) => (<option key={s.code} value={s.code}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <Segmented
              label="Care type"
              value={careType}
              onChange={setCareType}
              options={[
                { value: 'centerCare', label: 'Center',       info: tipsChildcare.centerCare },
                { value: 'homeCare',   label: 'Home daycare', info: tipsChildcare.homeCare   },
                { value: 'nanny',      label: 'Nanny',        info: tipsChildcare.nanny      },
                { value: 'nannyShare', label: 'Nanny share',  info: tipsChildcare.nannyShare },
                { value: 'partTime',   label: 'Part-time',    info: tipsChildcare.partTime   },
              ]}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Hours per week</label>
            <Slider min={10} max={50} step={5} value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" />
          </div>
          <div>
            <label className="label">Months needed</label>
            <Slider min={1} max={12} value={months} onChange={setMonths} suffix="mo" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="label">Registration fee</label>
            <input className="input" type="number" min={0} value={registrationFee}
              onChange={(e) => setRegistrationFee(Number(e.target.value || 0))} />
          </div>
          <div>
            <label className="label">Annual supply fee</label>
            <input className="input" type="number" min={0} value={supplyFee}
              onChange={(e) => setSupplyFee(Number(e.target.value || 0))} />
          </div>
          <div>
            <label className="label">Household income (optional)</label>
            <input className="input" type="number" min={0} placeholder="e.g. 95000"
              value={income}
              onChange={(e) => setIncome(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>

        <hr className="border-ink-100" />

        <div>
          <h3 className="font-semibold text-ink-900 mb-3">Compare care types in {state.name}</h3>
          <div className="overflow-x-auto rounded-lg border border-ink-100">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">Type</th>
                  <th className="text-right font-semibold px-4 py-2.5">Annual range</th>
                  <th className="text-right font-semibold px-4 py-2.5 hidden sm:table-cell">Monthly mid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {compareRows.map((r) => {
                  const mid = (r.annualLow + r.annualHigh) / 2;
                  return (
                    <tr key={r.label}>
                      <td className="px-4 py-2.5 text-ink-800 font-medium">{r.label}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">{formatUSD(r.annualLow)}–{formatUSD(r.annualHigh)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-ink-700 hidden sm:table-cell">{formatUSD(mid / 12)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-ink-900 mb-3">Questions to ask a daycare provider</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
            {[
              'What is your infant-to-staff ratio and group size?',
              'How do you handle nap, feedings, and diapering schedules?',
              'How do you communicate updates to parents during the day?',
              'What is your sick / fever / antibiotic policy?',
              'How are caregivers trained on safe sleep and CPR?',
              'What is your turnover rate for infant teachers?',
              'How are tuition increases announced?',
              'Are registration, supply, and holiday fees in writing?',
              'How long is the waitlist and how does deposit work?',
              'How do you handle separation-anxiety transitions?',
            ].map((q) => (
              <li key={q} className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
        <div className="card p-6 bg-gradient-to-br from-white to-teal-50/40 border-teal-200">
          <p className="pill pill-teal mb-2">Estimated cost over {months} months</p>
          <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
            {formatUSD(result.periodMid)}
          </p>
          <p className="mt-1 text-sm text-ink-600 tabular-nums">
            Range {formatUSD(result.periodLow)} – {formatUSD(result.periodHigh)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-ink-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Monthly</p>
              <p className="text-lg font-bold text-ink-900 tabular-nums">{formatUSD((result.monthlyLow + result.monthlyHigh) / 2)}</p>
            </div>
            <div className="rounded-xl bg-white border border-ink-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Annual mid</p>
              <p className="text-lg font-bold text-ink-900 tabular-nums">{formatUSD(result.annualMid)}</p>
            </div>
          </div>
          {result.incomePct !== null && (
            <p className="mt-3 text-sm text-ink-700 leading-relaxed">
              That's about <strong>{formatPercent(result.incomePct)}</strong> of your household income — {careType === 'centerCare' && state.pctMedianIncome ? `the state median for center care is around ${state.pctMedianIncome}%.` : 'a useful affordability check.'}
            </p>
          )}
        </div>

        <Disclaimer>
          <strong>Childcare prices vary widely.</strong> Always verify with the specific provider —
          tuition, registration, supply, and holiday fees can shift the total significantly.
        </Disclaimer>
      </aside>
    </div>
  );
}
