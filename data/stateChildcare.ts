// State-level childcare cost estimates. Loaded from
// public/data/state_childcare.csv — that CSV is the single source of truth
// and editable in Google Sheets / Excel. See data/csv/README.md.
//
// Source: Child Care Aware of America 2024 report data, with directional
// adjustments for 2025-2026 inflation. These are PLANNING ESTIMATES, not
// bills. Each row is reviewed and source-noted; values are approximate annual
// costs for INFANT care (under 12 months) by setting type.
//
// Last reviewed: 2026-04-30. Data year: 2024-2025 reported, adjusted to 2026
// dollars.

import { parseCsv, num } from '@/lib/csv';
import stateChildcareCsv from '@/public/data/state_childcare.csv';
import careTypeFactorsCsv from '@/public/data/childcare_care_type_factors.csv';

export type StateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY' | 'DC';

export type StateChildcareRow = {
  code: StateCode;
  name: string;
  /** Annual infant center-based care, low end of typical range, USD */
  centerLow: number;
  /** Annual infant center-based care, high end of typical range, USD */
  centerHigh: number;
  /** Annual family childcare home, low end, USD */
  homeLow: number;
  /** Annual family childcare home, high end, USD */
  homeHigh: number;
  /** Annual nanny (40 hr/wk) typical range mid, USD */
  nannyMid: number;
  /** Approx % of median household income for center care */
  pctMedianIncome: number;
};

export const stateChildcare: StateChildcareRow[] = parseCsv(stateChildcareCsv).map((r) => ({
  code: r.code as StateCode,
  name: r.name,
  centerLow: num(r.center_low),
  centerHigh: num(r.center_high),
  homeLow: num(r.home_low),
  homeHigh: num(r.home_high),
  nannyMid: num(r.nanny_mid),
  pctMedianIncome: num(r.pct_median_income),
}));

if (stateChildcare.length !== 51) {
  throw new Error(`state_childcare.csv: expected 51 rows (50 states + DC), got ${stateChildcare.length}`);
}

export const stateBySlug: Record<string, StateChildcareRow> = Object.fromEntries(
  stateChildcare.map((s) => [s.name.toLowerCase().replace(/\s+/g, '-'), s])
);

export function slugifyState(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function getStateByCode(code: StateCode): StateChildcareRow | undefined {
  return stateChildcare.find((s) => s.code === code);
}

// ============================================================================
// Care-type multipliers (nanny, nannyShare, partTime, unsure)
// ============================================================================
//
// These factors translate a state's center/nanny baselines into annual ranges
// for the derived care types. centerCare and homeCare don't appear here —
// they use the state's center / home columns directly with no multiplier.

export type CareTypeKey = 'nanny' | 'nannyShare' | 'partTime' | 'unsure';
export type StateBasis = 'centerLow' | 'centerHigh' | 'homeLow' | 'homeHigh' | 'nannyMid';

export type CareTypeFactor = {
  careType: CareTypeKey;
  lowMultiplier: number;
  highMultiplier: number;
  lowBasis: StateBasis;
  highBasis: StateBasis;
};

const careFactorRows = parseCsv(careTypeFactorsCsv);
export const careTypeFactors: Record<CareTypeKey, CareTypeFactor> = (() => {
  const out: Partial<Record<CareTypeKey, CareTypeFactor>> = {};
  for (const r of careFactorRows) {
    const key = r.care_type as CareTypeKey;
    out[key] = {
      careType: key,
      lowMultiplier: num(r.low_multiplier),
      highMultiplier: num(r.high_multiplier),
      lowBasis: r.low_basis as StateBasis,
      highBasis: r.high_basis as StateBasis,
    };
  }
  for (const k of ['nanny', 'nannyShare', 'partTime', 'unsure'] as const) {
    if (!out[k]) throw new Error(`childcare_care_type_factors.csv missing care_type "${k}"`);
  }
  return out as Record<CareTypeKey, CareTypeFactor>;
})();

/** Compute a state's annual range for a derived care type. */
export function applyCareTypeFactor(
  state: StateChildcareRow,
  careType: CareTypeKey
): { annualLow: number; annualHigh: number } {
  const f = careTypeFactors[careType];
  return {
    annualLow: state[f.lowBasis] * f.lowMultiplier,
    annualHigh: state[f.highBasis] * f.highMultiplier,
  };
}
