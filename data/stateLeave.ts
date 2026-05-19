// State paid family/medical leave reference data. Loaded from
// public/data/state_leave.csv — single source of truth, editable in Sheets.
//
// Last reviewed: 2026-05-19. Sources are linked per-row.
// Numbers are PLANNING ESTIMATES; programs change annually.
//
// 2026 schema additions:
//   - source_id: references source_registry.csv (per-row provenance)
//   - low_tier_pct / upper_tier_pct / low_tier_cap_pct: most state programs
//     pay a tiered wage replacement (e.g., 90% up to 50% of SAWW, 50% above).
//     `wage_replacement_pct` is kept as a single "headline" percentage but
//     the tier columns let the calculator model real benefits more accurately.
//     A program with no tiering uses the same value in both tier columns and
//     `low_tier_cap_pct = 1.0`.

import { parseCsv, num } from '@/lib/csv';
import stateLeaveCsv from '@/public/data/state_leave.csv';
import { slugifyState, type StateCode } from '@/data/stateChildcare';

export type StateLeaveRow = {
  code: StateCode;
  name: string;
  program: string;
  paidLeaveWeeks: number;
  /** Headline wage-replacement percentage (often the upper-tier rate). 0..1 */
  wageReplacementPct: number;
  maxWeeklyBenefitUsd: number;
  jobProtection: string;
  notes: string;
  sourceUrl: string;
  /** References public/data/source_registry.csv */
  sourceId: string;
  /** Tier modeling — see file header. Use lowTierPct up to `lowTierCapPct`
   *  of state AWW, then upperTierPct above. For flat-percentage programs,
   *  lowTierPct === upperTierPct and lowTierCapPct === 1.0. */
  lowTierPct: number;
  upperTierPct: number;
  lowTierCapPct: number;
};

export const stateLeave: StateLeaveRow[] = parseCsv(stateLeaveCsv).map((r) => ({
  code: r.state_code as StateCode,
  name: r.state_name,
  program: r.program,
  paidLeaveWeeks: num(r.paid_leave_weeks),
  wageReplacementPct: num(r.wage_replacement_pct),
  maxWeeklyBenefitUsd: num(r.max_weekly_benefit_usd),
  jobProtection: r.job_protection,
  notes: r.notes,
  sourceUrl: r.source_url,
  sourceId: r.source_id,
  lowTierPct: num(r.low_tier_pct),
  upperTierPct: num(r.upper_tier_pct),
  lowTierCapPct: num(r.low_tier_cap_pct),
}));

if (stateLeave.length !== 51) {
  throw new Error(`state_leave.csv: expected 51 rows (50 states + DC), got ${stateLeave.length}`);
}

export const stateLeaveBySlug: Record<string, StateLeaveRow> = Object.fromEntries(
  stateLeave.map((s) => [slugifyState(s.name), s]),
);

export function getStateLeaveByCode(code: StateCode): StateLeaveRow | undefined {
  return stateLeave.find((s) => s.code === code);
}
