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
 * 2026 schedule (OBBBA):
 *   Single/HOH/MFS:  ≤$15k → 50% | $15k–$75k → 35% flat | $75k–$103k → linear 35→20 | >$103k → 20%
 *   MFJ:             ≤$30k → 50% | $30k–$150k → 35% flat | $150k–$206k → linear 35→20 | >$206k → 20%
 */
export function cdctcRate(agi: number, filing: Filing): number {
  const scale = filing === 'mfj' ? 2 : 1;
  const t50 = 15000 * scale;
  const tFlat = 75000 * scale;
  const tFloor = 103000 * scale;

  if (agi <= t50) return 0.50;
  if (agi <= tFlat) return 0.35;
  if (agi >= tFloor) return 0.20;
  const pos = (agi - tFlat) / (tFloor - tFlat);
  return 0.35 - 0.15 * pos;
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
