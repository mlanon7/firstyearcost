// Scenario presets shown above the homepage calculator. Loaded from
// public/data/presets.csv. See data/csv/README.md.

import { parseCsv } from '@/lib/csv';
import presetsCsv from '@/public/data/presets.csv';
import type { CalculatorInputs } from '@/lib/calculator';

export type Preset = {
  id: string;
  name: string;
  blurb: string;
  inputs: Partial<CalculatorInputs>;
};

const rows = parseCsv(presetsCsv);

function maybeBool(v: string): boolean | undefined {
  if (v === '' || v === undefined) return undefined;
  const s = v.trim().toLowerCase();
  if (s === 'true' || s === '1' || s === 'yes') return true;
  if (s === 'false' || s === '0' || s === 'no') return false;
  return undefined;
}

function maybeNum(v: string): number | undefined {
  if (v === '' || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function maybeStr<T extends string>(v: string): T | undefined {
  if (v === '' || v === undefined) return undefined;
  return v as T;
}

export const presets: Preset[] = rows.map((r) => {
  const inputs: Partial<CalculatorInputs> = {};
  const childcarePlan = maybeStr<CalculatorInputs['childcarePlan']>(r.childcarePlan);
  if (childcarePlan) inputs.childcarePlan = childcarePlan;
  const feedingPlan = maybeStr<CalculatorInputs['feedingPlan']>(r.feedingPlan);
  if (feedingPlan) inputs.feedingPlan = feedingPlan;
  const formulaType = maybeStr<NonNullable<CalculatorInputs['formulaType']>>(r.formulaType);
  if (formulaType) inputs.formulaType = formulaType;
  const diaperPlan = maybeStr<CalculatorInputs['diaperPlan']>(r.diaperPlan);
  if (diaperPlan) inputs.diaperPlan = diaperPlan;
  const gearTier = maybeStr<CalculatorInputs['gearTier']>(r.gearTier);
  if (gearTier) inputs.gearTier = gearTier;
  const gearUsed = maybeBool(r.gearUsed);
  if (gearUsed !== undefined) inputs.gearUsed = gearUsed;
  const registryHelp = maybeStr<CalculatorInputs['registryHelp']>(r.registryHelp);
  if (registryHelp) inputs.registryHelp = registryHelp;
  const childcareMonths = maybeNum(r.childcareMonths);
  if (childcareMonths !== undefined) inputs.childcareMonths = childcareMonths;
  const isFirstBaby = maybeBool(r.isFirstBaby);
  if (isFirstBaby !== undefined) inputs.isFirstBaby = isFirstBaby;
  return {
    id: r.id,
    name: r.name,
    blurb: r.blurb,
    inputs,
  };
});
