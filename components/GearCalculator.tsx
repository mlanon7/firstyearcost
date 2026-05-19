'use client';

import { useMemo, useState } from 'react';
import { Segmented } from './Segmented';
import { Disclaimer } from './Disclaimer';
import { gearCosts, gearItemMeta, registryCoverage } from '@/data/assumptions';
import { formatUSD } from '@/lib/format';

type Tier = 'budget' | 'standard' | 'premium';
type Setup = 'minimal' | 'standard' | 'premium';
type RegistryHelp = 'low' | 'medium' | 'high';

// Both gear prices and item metadata (must-have, safety-new, can-delay, tag)
// come from public/data/gear.csv via @/data/assumptions.
const itemMeta = gearItemMeta;

export function GearCalculator() {
  const [tier, setTier] = useState<Tier>('standard');
  const [setup, setSetup] = useState<Setup>('standard');
  const [registry, setRegistry] = useState<RegistryHelp>('medium');
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const result = useMemo(() => {
    const items = (Object.keys(gearCosts) as Array<keyof typeof gearCosts>).map((k) => {
      const cost = gearCosts[k][tier];
      const isExcluded = excluded.has(k);
      const meta = itemMeta[k];
      // Setup level filter: minimal hides delayable items by default
      const setupExcluded = setup === 'minimal' && meta.canDelay;
      return {
        key: k as string,
        meta,
        cost,
        included: !isExcluded && !setupExcluded,
      };
    });

    const includedTotal = items.filter((i) => i.included).reduce((a, i) => a + i.cost, 0);
    const reg = registryCoverage[registry];
    const offset = includedTotal * reg;
    const oop = includedTotal - offset;

    return { items, total: includedTotal, offset, oop };
  }, [tier, setup, registry, excluded]);

  function toggle(k: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
      <div className="card p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="label">Gear tier</label>
            <Segmented
              value={tier}
              onChange={setTier}
              ariaLabel="Tier"
              options={[
                { value: 'budget',   label: 'Budget' },
                { value: 'standard', label: 'Standard' },
                { value: 'premium',  label: 'Premium' },
              ]}
            />
          </div>
          <div>
            <label className="label">Nursery setup</label>
            <Segmented
              value={setup}
              onChange={setSetup}
              ariaLabel="Setup"
              options={[
                { value: 'minimal',  label: 'Minimal' },
                { value: 'standard', label: 'Standard' },
                { value: 'premium',  label: 'Full setup' },
              ]}
            />
          </div>
          <div>
            <label className="label">Registry help</label>
            <Segmented
              value={registry}
              onChange={setRegistry}
              ariaLabel="Registry"
              options={[
                { value: 'low',    label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high',   label: 'High' },
              ]}
            />
          </div>
        </div>

        <hr className="border-ink-100" />

        <div>
          <h3 className="font-semibold text-ink-900 mb-3">Items in your setup</h3>
          <p className="text-xs text-ink-500 mb-3">Click any item to exclude it. <span className="text-coral-700">Coral</span> = buy new for safety.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {result.items.map((it) => {
              const meta = it.meta;
              const isExcluded = excluded.has(it.key) || !it.included;
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => toggle(it.key)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-left transition ${
                    isExcluded
                      ? 'bg-ink-50 border-ink-200 text-ink-400 line-through'
                      : 'bg-white border-ink-200 hover:border-teal-400 hover:bg-teal-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      meta.safetyNew ? 'bg-coral-500' : meta.mustHave ? 'bg-teal-500' : 'bg-ink-300'
                    }`} />
                    <span className="text-sm font-medium">{meta.label}</span>
                  </div>
                  <span className="text-sm tabular-nums">{formatUSD(it.cost)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-coral-50/50 border border-coral-200 p-4 text-sm text-coral-900">
            <h4 className="font-semibold mb-2">Buy new (safety-sensitive)</h4>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Car seat — verify expiration date and crash history</li>
              <li>Crib & mattress — must meet current CPSC standards</li>
              <li>Breast pump — usually covered new through insurance</li>
            </ul>
          </div>
          <div className="rounded-xl bg-teal-50/50 border border-teal-200 p-4 text-sm text-teal-900">
            <h4 className="font-semibold mb-2">Often safe used / hand-me-down</h4>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Stroller (with current safety standards)</li>
              <li>Bouncers, swings, play mats, dressers</li>
              <li>Clothes (most bought outgrown in weeks)</li>
              <li>Books, toys, baby carriers in good condition</li>
            </ul>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
        <div className="card p-6 bg-gradient-to-br from-white to-ink-50">
          <p className="pill mb-2">Estimated gear total</p>
          <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
            {formatUSD(result.total)}
          </p>
          <hr className="my-4 border-ink-100" />
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink-600">Registry / gift offset</span>
            <span className="font-semibold text-teal-700 tabular-nums">−{formatUSD(result.offset)}</span>
          </div>
          <div className="flex justify-between text-sm py-1.5 border-t border-ink-100 mt-1.5 pt-2.5">
            <span className="text-ink-900 font-semibold">Likely out-of-pocket</span>
            <span className="font-bold text-ink-900 tabular-nums">{formatUSD(result.oop)}</span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink-900 mb-3 text-sm">Must-have before birth</h3>
          <ul className="text-sm text-ink-700 space-y-1.5 list-disc pl-4">
            <li>Infant car seat (installed)</li>
            <li>A safe sleep space (crib or bassinet) with new mattress</li>
            <li>3–5 sleep outfits + 8–10 onesies</li>
            <li>Diapers, wipes, changing pad</li>
            <li>Thermometer + a few baby toiletries</li>
            <li>Bottles or breastfeeding supplies for your plan</li>
          </ul>
        </div>

        <Disclaimer />
      </aside>
    </div>
  );
}
