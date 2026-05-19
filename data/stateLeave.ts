// State paid family/medical leave reference data. Loaded from
// public/data/state_leave.csv — single source of truth, editable in Sheets.
//
// Last reviewed: 2026-05-01. Sources are linked per-row.
// Numbers are PLANNING ESTIMATES; programs change annually.

import { parseCsv, num } from '@/lib/csv';
import stateLeaveCsv from '@/public/data/state_leave.csv';
import { slugifyState, type StateCode } from '@/data/stateChildcare';

export type StateLeaveRow = {
  code: StateCode;
  name: string;
  program: string;
  paidLeaveWeeks: number;
  wageReplacementPct: number; // 0..1
  maxWeeklyBenefitUsd: number;
  jobProtection: string;
  notes: string;
  sourceUrl: string;
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
