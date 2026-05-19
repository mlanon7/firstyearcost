'use client';

import { useMemo, useState } from 'react';
import { Segmented } from './Segmented';
import { Slider } from './Slider';
import { Disclaimer } from './Disclaimer';
import {
  diaperUsageByMonth,
  diaperCostPerUnit,
  wipesCostPerWipe,
  wipesPerChange as defaultWipesPerChange,
  clothDiaperUpfront,
  clothDiaperWashing,
} from '@/data/assumptions';
import { formatUSD } from '@/lib/format';

type Brand = 'budget' | 'mainstream' | 'premium';
type Plan = 'disposable' | 'cloth' | 'mix';

export function DiaperCalculator() {
  const [plan, setPlan] = useState<Plan>('disposable');
  const [brand, setBrand] = useState<Brand>('mainstream');
  const [wipesPerChange, setWipesPerChange] = useState(defaultWipesPerChange);
  const [bulkBuy, setBulkBuy] = useState(true);
  const [perDayOverride, setPerDayOverride] = useState<number | null>(null);

  const result = useMemo(() => {
    const monthly = diaperUsageByMonth.map((m) => {
      const perDay = perDayOverride ?? m.perDay;
      const days = 30.4;
      const numDiapers = perDay * days;
      let dispCost = 0;
      let clothCost = 0;
      const c = diaperCostPerUnit[brand];
      const unitCost = bulkBuy ? c.low * 1.05 : c.high * 0.95;

      if (plan === 'disposable') dispCost = numDiapers * unitCost;
      else if (plan === 'cloth') clothCost = (clothDiaperUpfront.mid / 12) + ((clothDiaperWashing.perMonthLow + clothDiaperWashing.perMonthHigh) / 2);
      else {
        dispCost = numDiapers * 0.6 * unitCost;
        clothCost = (clothDiaperUpfront.mid * 0.7 / 12) + ((clothDiaperWashing.perMonthLow + clothDiaperWashing.perMonthHigh) / 2 * 0.6);
      }

      const wipeRate = brand === 'budget' ? wipesCostPerWipe.budget : brand === 'premium' ? wipesCostPerWipe.premium : wipesCostPerWipe.mainstream;
      const wipeCost = numDiapers * wipesPerChange * wipeRate;
      const monthCost = dispCost + clothCost + wipeCost;

      return {
        month: m.month,
        perDay,
        numDiapers: Math.round(numDiapers),
        dispCost,
        clothCost,
        wipeCost,
        monthCost,
      };
    });

    const totalDiapers = monthly.reduce((a, m) => a + m.numDiapers, 0);
    const annual = monthly.reduce((a, m) => a + m.monthCost, 0);
    const monthlyAvg = annual / 12;

    return { monthly, totalDiapers, annual, monthlyAvg };
  }, [plan, brand, wipesPerChange, bulkBuy, perDayOverride]);

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
      <div className="card p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Diaper plan</label>
            <Segmented
              value={plan}
              onChange={setPlan}
              ariaLabel="Diaper plan"
              options={[
                { value: 'disposable', label: 'Disposable' },
                { value: 'cloth',      label: 'Cloth' },
                { value: 'mix',        label: 'Mix' },
              ]}
            />
          </div>
          <div>
            <label className="label">Brand tier</label>
            <Segmented
              value={brand}
              onChange={setBrand}
              ariaLabel="Diaper brand"
              options={[
                { value: 'budget',     label: 'Store / budget' },
                { value: 'mainstream', label: 'Pampers / Huggies' },
                { value: 'premium',    label: 'Honest / Coterie' },
              ]}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Wipes per change</label>
            <Slider min={1} max={5} step={0.5} value={wipesPerChange} onChange={setWipesPerChange} />
          </div>
          <div>
            <label className="label">Buy in bulk?</label>
            <Segmented
              value={bulkBuy ? 'yes' : 'no'}
              onChange={(v) => setBulkBuy(v === 'yes')}
              ariaLabel="Bulk buy"
              options={[
                { value: 'yes', label: 'Yes (Costco / subscribe)' },
                { value: 'no',  label: 'No (drugstore)' },
              ]}
            />
          </div>
        </div>

        <div className="rounded-xl bg-ink-50/40 border border-ink-100 p-4">
          <h4 className="font-semibold text-ink-900 mb-3 text-sm">Monthly diaper usage by age</h4>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-ink-500">
                  <th className="font-medium py-1.5">Month</th>
                  <th className="font-medium py-1.5">Per day</th>
                  <th className="font-medium py-1.5">Per month</th>
                  <th className="font-medium py-1.5 text-right">Cost (mid)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {result.monthly.map((m) => (
                  <tr key={m.month}>
                    <td className="py-1.5 text-ink-700">M{m.month}</td>
                    <td className="py-1.5 text-ink-700 tabular-nums">{m.perDay}</td>
                    <td className="py-1.5 text-ink-700 tabular-nums">{m.numDiapers}</td>
                    <td className="py-1.5 text-ink-900 font-medium text-right tabular-nums">{formatUSD(m.monthCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-coral-50/50 border border-coral-200 p-4 text-sm text-coral-900">
          <strong>Stock-up tip:</strong> Newborns often outgrow size N and 1 quickly — don't bulk-buy too far ahead.
          A baby's growth pattern can shift sizes in weeks. Many parents do well with one big size-N pack and one
          size-1 pack, then size up as needed.
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
        <div className="card p-6 bg-gradient-to-br from-white to-coral-50/40 border-coral-200">
          <p className="pill pill-coral mb-2">Estimated first-year cost</p>
          <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
            {formatUSD(result.annual)}
          </p>
          <p className="mt-1 text-sm text-ink-600 tabular-nums">
            ~{result.totalDiapers.toLocaleString()} diapers · {formatUSD(result.monthlyAvg)}/mo avg
          </p>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink-900 mb-3">Disposable vs. cloth — first year</h3>
          <ul className="text-sm text-ink-700 space-y-2">
            <li className="flex justify-between">
              <span>Disposable, mainstream, bulk</span>
              <span className="font-semibold tabular-nums">~$700–$950</span>
            </li>
            <li className="flex justify-between">
              <span>Disposable, premium</span>
              <span className="font-semibold tabular-nums">~$1,100–$1,500</span>
            </li>
            <li className="flex justify-between">
              <span>Cloth (incl. upfront + wash)</span>
              <span className="font-semibold tabular-nums">~$550–$1,100</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-ink-500 leading-relaxed">
            Cloth saves more in years two and beyond — especially if reused for a sibling.
          </p>
        </div>

        <Disclaimer />
      </aside>
    </div>
  );
}
