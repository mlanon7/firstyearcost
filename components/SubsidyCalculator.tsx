'use client';

import { useMemo, useState } from 'react';
import { formatUSD } from '@/lib/format';
import { StatCard } from '@/components/StatCard';
import { calcSubsidy, type Filing } from '@/lib/subsidy';

// Childcare Subsidy & Tax-Credit Estimator — 2026 tax year (OBBBA)
// ---------------------------------------------------------------
// Inputs:
//   - filing status (single / hoh / mfj / mfs)
//   - AGI (household)
//   - qualifying children under 13 (default 1)
//   - annual qualifying childcare spend
//   - employer dependent-care FSA election ($0–$7,500 single/HOH/MFJ, $0–$3,750 MFS)
//
// Outputs:
//   - Federal Child & Dependent Care Tax Credit (CDCTC) estimate
//   - Dependent Care FSA pre-tax savings estimate
//   - Combined estimated benefit
//
// 2026 rules implemented (OBBBA-adjusted):
//   - Qualifying CDCTC expense cap: $3,000 (1 child) / $6,000 (2+).
//   - CDCTC max rate raised from 35% to 50% (OBBBA).
//   - CDCTC slides toward a 20% floor as AGI rises. Schedule:
//       Single/HOH:  ≤$15k → 50% | $15k–$75k → 35% | $75k–$103k → 35%→20% | >$103k → 20%
//       MFJ:         ≤$30k → 50% | $30k–$150k → 35% | $150k–$206k → 35%→20% | >$206k → 20%
//       MFS:         half of MFJ thresholds.
//   - FSA cap raised from $5,000 to $7,500 (MFS: $2,500 → $3,750), effective 2026.
//   - FSA dollars are EXCLUDED from CDCTC qualifying base (no double dip).
//
// References:
//   - IRS Pub 503 (Child and Dependent Care Expenses)
//   - IRS Pub 15-B (Employer's Tax Guide to Fringe Benefits) — 2026 ed.
//   - One Big Beautiful Bill Act, §70505 (FSA increase) and §70504 (CDCTC reform)
//
// Caveats:
//   - The phase-out between $75k–$103k (single) and $150k–$206k (MFJ) is
//     modeled as a smooth linear glide. Statutory text uses discrete 1pp
//     steps per $2,000 (single) / $4,000 (MFJ) bands. Difference is at most
//     a few dollars; not material at planning precision.
//   - State CDCTC equivalents stack on top; not modeled here.
//   - Non-refundable: doesn't generate a refund beyond your tax liability.

export function SubsidyCalculator() {
  const [filing, setFiling] = useState<Filing>('mfj');
  const [agi, setAgi] = useState(95000);
  const [kids, setKids] = useState(1);
  const [spend, setSpend] = useState(15000);
  const [fsa, setFsa] = useState(7500);

  const result = useMemo(
    () => calcSubsidy({ filing, agi, kids, spend, fsa }),
    [filing, agi, kids, spend, fsa],
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Filing status</label>
          <div className="segmented">
            {(['single', 'hoh', 'mfj', 'mfs'] as Filing[]).map((f) => (
              <button key={f} className={filing === f ? 'active' : ''} onClick={() => setFiling(f)}>
                {f === 'mfj' ? 'Married filing jointly'
                  : f === 'mfs' ? 'Married filing separately'
                  : f === 'hoh' ? 'Head of household'
                  : 'Single'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Adjusted gross income (AGI)</label>
          <input
            type="number"
            inputMode="numeric"
            className="input"
            min={0}
            step={1000}
            value={agi}
            onChange={(e) => setAgi(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="help">Roughly: total wages minus pre-tax 401(k), HSA, and similar deductions.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Qualifying kids under 13</label>
            <input
              type="number"
              inputMode="numeric"
              className="input"
              min={0}
              max={6}
              value={kids}
              onChange={(e) => setKids(Math.max(0, Math.min(6, Number(e.target.value) || 0)))}
            />
          </div>
          <div>
            <label className="label">Annual childcare spend</label>
            <input
              type="number"
              inputMode="numeric"
              className="input"
              min={0}
              step={500}
              value={spend}
              onChange={(e) => setSpend(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        </div>

        <div>
          <label className="label">Dependent-care FSA election</label>
          <input
            type="number"
            inputMode="numeric"
            className="input"
            min={0}
            max={result.cap}
            step={250}
            value={fsa}
            onChange={(e) => setFsa(Math.max(0, Math.min(result.cap, Number(e.target.value) || 0)))}
          />
          <p className="help">
            2026 federal cap is <strong>{formatUSD(result.cap)}</strong>
            {filing === 'mfs' ? ' (married filing separately)' : ' (single, HOH, and MFJ)'} — raised from $5,000 under the One Big Beautiful Bill Act.
          </p>
        </div>

        <p className="text-xs text-ink-500 italic">
          Estimate updates as you type — no button to press. State CDCTC equivalents (CA, NY, MN, OR, VT, and others) stack on top and are not modeled here.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="CDCTC credit" value={result.cdctc} />
          <StatCard label="FSA tax savings" value={result.fsaSavings} accent="teal" />
        </div>
        <div className="card p-6 bg-ink-900 text-white">
          <p className="text-sm uppercase tracking-wider text-ink-300">Combined estimated benefit</p>
          <p className="text-4xl font-extrabold mt-1">{formatUSD(result.combined)}</p>
          <p className="text-sm text-ink-300 mt-3 leading-relaxed">
            Effective offset against your annual childcare bill of {formatUSD(spend)} —
            roughly {Math.round((result.combined / Math.max(spend, 1)) * 100)}% back.
          </p>
        </div>
        <div className="card p-5 text-sm text-ink-700 space-y-2">
          <p><strong>How the math works (2026 OBBBA rules):</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>CDCTC rate at your AGI: <strong>{Math.round(result.rate * 100)}%</strong> on up to {formatUSD(kids >= 2 ? 6000 : 3000)} of qualifying spend.</li>
            <li>FSA used: <strong>{formatUSD(result.fsaUsed)}</strong> (capped at {formatUSD(result.cap)}).</li>
            <li>FSA pre-tax savings = FSA amount × estimated marginal bracket ({Math.round(result.bracket * 100)}%) + 7.65% FICA.</li>
            <li>FSA dollars don't double-count toward the CDCTC base.</li>
          </ul>
          <p className="text-xs text-ink-500 mt-3 leading-relaxed">
            <strong>Tax estimate, not tax advice.</strong> Marginal bracket is approximated from AGI; the IRS computes your actual credit from taxable income on Form 2441. State CDCTC equivalents stack on top in many states (CA, NY, MN, OR, VT and others). Check IRS{' '}
            <a href="https://www.irs.gov/publications/p503" target="_blank" rel="noopener" className="underline">Pub 503</a> and{' '}
            <a href="https://www.irs.gov/publications/p15b" target="_blank" rel="noopener" className="underline">Pub 15-B</a> for current-year details.
          </p>
        </div>
      </div>
    </div>
  );
}
