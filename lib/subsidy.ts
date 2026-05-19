// Pure functions for the subsidy / tax-credit calculator. Extracted from the
// React component so they can be unit-tested in isolation.
//
// All rules implement the 2026 OBBBA-adjusted federal CDCTC + dependent-care
// FSA framework. See `components/SubsidyCalculator.tsx` for the UI and the
// references it cites (IRS Pub 503, Pub 15-B).

export type Filing = 'single' | 'hoh' | 'mfj' | 'mfs';

/**
 * Child & Dependent Care Tax Credit rate for the given AGI and filing status.
 * Returns a fraction in [0.20, 0.50].
 *
 * 2026 statutory schedule (One Big Beautiful Bill Act, modifying IRC §21(a)(2)):
 *
 *   Two-phase step function, anchored at thresholds T1 and T2:
 *     - Phase 0: AGI ≤ T1 → 50%
 *     - Phase 1 (AGI in (T1, T2]): start at 50%, reduce by 1 percentage point
 *       for each full or partial increment of $STEP above T1, floored at 35%.
 *     - Phase 2 (AGI > T2): start at 35%, reduce by 1 percentage point
 *       for each full or partial increment of $STEP above T2, floored at 20%.
 *
 *   The "fraction thereof" language is implemented via Math.ceil.
 *
 *   Thresholds and step sizes:
 *     Single / HOH / MFS:  T1=$15,000  T2=$75,000   STEP=$2,000
 *     Married filing jointly: T1=$30,000 T2=$150,000 STEP=$4,000
 *
 *   Bracket points produced:
 *     Single: 50% at $15,000 → reaches 35% floor at $43,001 → flat 35% to
 *       $75,000 → reaches 20% floor at $105,001+.
 *     MFJ:    50% at $30,000 → reaches 35% floor at $86,001 → flat 35% to
 *       $150,000 → reaches 20% floor at $210,001+.
 *
 * References:
 *   - Congress.gov H.R.1 (P.L. 119-21) §70404 and §70405 (CDCTC amendments)
 *   - IRS Publication 503 (2026)
 *   - IRS Publication 505 (2026), worksheet for child & dependent care credit
 */
export function cdctcRate(agi: number, filing: Filing): number {
  const isMfj = filing === 'mfj';
  const t1   = isMfj ?  30_000 : 15_000;
  const t2   = isMfj ? 150_000 : 75_000;
  const step = isMfj ?   4_000 :  2_000;

  if (agi <= t1) return 0.50;

  if (agi <= t2) {
    // Phase 1: 50% reducing 1pp per (full or partial) STEP above T1, floor 35%.
    const reductions = Math.ceil((agi - t1) / step);
    return Math.max(0.35, 0.50 - reductions * 0.01);
  }

  // Phase 2: 35% reducing 1pp per (full or partial) STEP above T2, floor 20%.
  const reductions = Math.ceil((agi - t2) / step);
  return Math.max(0.20, 0.35 - reductions * 0.01);
}

/** 2026 dependent-care FSA exclusion cap per OBBBA. */
export function fsaCap(filing: Filing): number {
  return filing === 'mfs' ? 3750 : 7500;
}

/** Quick marginal federal income tax bracket estimate. */
export function marginalBracketProxy(agi: number, filing: Filing): number {
  const t = filing === 'mfj' ? 2 : 1;
  if (agi <= 11_925 * t) return 0.10;
  if (agi <= 48_475 * t) return 0.12;
  if (agi <= 103_350 * t) return 0.22;
  if (agi <= 197_300 * t) return 0.24;
  if (agi <= 250_525 * t) return 0.32;
  if (agi <= 626_350 * t) return 0.35;
  return 0.37;
}

export type SubsidyInputs = {
  filing: Filing;
  agi: number;
  kids: number;
  spend: number;
  fsa: number;
};

export type SubsidyResult = {
  fsaUsed: number;
  cap: number;
  cdctcQual: number;
  rate: number;
  cdctc: number;
  bracket: number;
  fsaSavings: number;
  combined: number;
};

/** Compute the full subsidy result. Pure function — no React, no DOM. */
export function calcSubsidy({ filing, agi, kids, spend, fsa }: SubsidyInputs): SubsidyResult {
  const cap = fsaCap(filing);
  const fsaUsed = Math.max(0, Math.min(fsa, cap, spend));

  const qualBase = kids >= 2 ? 6000 : 3000;
  const cdctcQual = Math.max(0, Math.min(spend - fsaUsed, qualBase));
  const rate = cdctcRate(agi, filing);
  const cdctc = Math.round(cdctcQual * rate);

  const bracket = marginalBracketProxy(agi, filing);
  const fica = 0.0765;
  const fsaSavings = Math.round(fsaUsed * (bracket + fica));

  const combined = cdctc + fsaSavings;
  return { fsaUsed, cap, cdctcQual, rate, cdctc, bracket, fsaSavings, combined };
}
