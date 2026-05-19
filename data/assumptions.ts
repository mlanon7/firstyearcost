// Cost assumptions for the calculators. All values are PLANNING ESTIMATES,
// presented as ranges. The numbers below are loaded from CSVs in
// public/data/ — those CSVs are the single source of truth and are
// editable in Google Sheets / Excel. See data/csv/README.md for the
// schema of each file. Update sourceNotes.ts when revising. Last reviewed:
// 2026-05-08.

import { parseCsv, num, bool, indexBy } from '@/lib/csv';

import diaperUsageCsv from '@/public/data/diaper_usage_by_month.csv';
import diaperCostCsv from '@/public/data/diaper_cost_per_unit.csv';
import wipesCostCsv from '@/public/data/wipes_cost.csv';
import clothDiaperCsv from '@/public/data/cloth_diapers.csv';
import formulaCostCsv from '@/public/data/formula_cost_per_month.csv';
import breastfeedingSuppliesCsv from '@/public/data/breastfeeding_supplies.csv';
import feedingFactorsCsv from '@/public/data/feeding_factors.csv';
import gearCsv from '@/public/data/gear.csv';
import clothingCsv from '@/public/data/clothing_first_year.csv';
import registryCoverageCsv from '@/public/data/registry_coverage.csv';
import birthOopRangesCsv from '@/public/data/birth_oop_ranges.csv';
import newbornMedicalOopCsv from '@/public/data/newborn_medical_oop.csv';
import miscMonthlyCsv from '@/public/data/misc_monthly.csv';
import birthBilledAnchorsCsv from '@/public/data/birth_billed_anchors.csv';
import birthNewbornAddonsCsv from '@/public/data/birth_newborn_deductible_addons.csv';

// ============================================================================
// DIAPERS & WIPES
// ============================================================================
//
// Source: AAP guidance on newborn diaper changes (8-12/day) tapering with age.
// Retail snapshots from major US retailers (Target, Walmart, Costco, Amazon),
// reviewed 2026-Q1.
// Per-diaper cost varies widely by tier and bulk-buy status.

export const diaperUsageByMonth: { month: number; perDay: number }[] = parseCsv(diaperUsageCsv).map((r) => ({
  month: num(r.month),
  perDay: num(r.per_day),
}));

const diaperCostRows = indexBy(parseCsv(diaperCostCsv), 'brand_tier');
export const diaperCostPerUnit = {
  budget: { low: num(diaperCostRows.budget?.low_usd), mid: num(diaperCostRows.budget?.mid_usd), high: num(diaperCostRows.budget?.high_usd) },
  mainstream: { low: num(diaperCostRows.mainstream?.low_usd), mid: num(diaperCostRows.mainstream?.mid_usd), high: num(diaperCostRows.mainstream?.high_usd) },
  premium: { low: num(diaperCostRows.premium?.low_usd), mid: num(diaperCostRows.premium?.mid_usd), high: num(diaperCostRows.premium?.high_usd) },
};

const wipesCostRows = indexBy(parseCsv(wipesCostCsv), 'brand_tier');
export const wipesCostPerWipe = {
  budget: num(wipesCostRows.budget?.cost_per_wipe_usd),
  mainstream: num(wipesCostRows.mainstream?.cost_per_wipe_usd),
  premium: num(wipesCostRows.premium?.cost_per_wipe_usd),
};

const feedingFactorRows = indexBy(parseCsv(feedingFactorsCsv), 'parameter');
function feedingFactor(name: string): number {
  const row = feedingFactorRows[name];
  if (!row) throw new Error(`feeding_factors.csv missing parameter "${name}"`);
  return num(row.value);
}
export const wipesPerChange = feedingFactor('wipes_per_change');

const clothDiaperRows = indexBy(parseCsv(clothDiaperCsv), 'item');
export const clothDiaperUpfront = {
  low: num(clothDiaperRows.upfront_kit?.low_usd),
  mid: num(clothDiaperRows.upfront_kit?.mid_usd),
  high: num(clothDiaperRows.upfront_kit?.high_usd),
};
export const clothDiaperWashing = {
  perMonthLow: num(clothDiaperRows.washing_per_month?.low_usd),
  perMonthHigh: num(clothDiaperRows.washing_per_month?.high_usd),
};

// ============================================================================
// FEEDING
// ============================================================================
//
// Formula: USDA WIC market rates and major retailer SKU sampling.
// Standard powder formula at typical 25-30 oz/day for newborn,
// tapering at 6-9 months as solids start.
// Hypoallergenic/specialty formulas can run 2-3x standard.

const formulaRows = indexBy(parseCsv(formulaCostCsv), 'formula_type');
function formulaRange(key: string) {
  const r = formulaRows[key];
  if (!r) throw new Error(`formula_cost_per_month.csv missing formula_type "${key}"`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
export const formulaCostPerMonth = {
  standardPowder: formulaRange('standardPowder'),
  sensitive: formulaRange('sensitive'),
  hypoallergenic: formulaRange('hypoallergenic'),
  readyToFeed: formulaRange('readyToFeed'),
};

const breastfeedingRows = indexBy(parseCsv(breastfeedingSuppliesCsv), 'item');
function bfRange(key: string) {
  const r = breastfeedingRows[key];
  if (!r) throw new Error(`breastfeeding_supplies.csv missing item "${key}"`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
export const breastfeedingSupplies = {
  pumpOutOfPocket: bfRange('pumpOutOfPocket'),
  bottlesAndStorage: bfRange('bottlesAndStorage'),
  pumpPartsReplacement: bfRange('pumpPartsReplacement'),
  bras: bfRange('bras'),
  pads: bfRange('pads'),
  lactationConsultOOP: bfRange('lactationConsultOOP'),
};

export const comboFeedingMultiplier = feedingFactor('combo_feeding_multiplier');
export const unsureFormulaShare = feedingFactor('unsure_formula_share');
export const unsureSuppliesAllowance = {
  low: feedingFactor('unsure_supplies_low'),
  mid: feedingFactor('unsure_supplies_mid'),
  high: feedingFactor('unsure_supplies_high'),
};

// ============================================================================
// GEAR & NURSERY (one-time)
// ============================================================================
//
// Retail snapshots Q1 2026. Ranges reflect budget store brands through premium.
// "Used/gifted" assumes registry coverage or hand-me-downs.

export type GearTier = 'budget' | 'standard' | 'premium';

export type GearItemMeta = {
  label: string;
  mustHave: boolean;
  safetyNew: boolean;
  canDelay: boolean;
  tag: string;
};

const gearRows = parseCsv(gearCsv);
export const gearCosts: Record<string, { budget: number; standard: number; premium: number }> = {};
export const gearItemMeta: Record<string, GearItemMeta> = {};
for (const r of gearRows) {
  const k = r.item_key;
  if (!k) throw new Error('gear.csv row missing item_key');
  gearCosts[k] = {
    budget: num(r.budget_usd),
    standard: num(r.standard_usd),
    premium: num(r.premium_usd),
  };
  gearItemMeta[k] = {
    label: r.label,
    mustHave: bool(r.must_have),
    safetyNew: bool(r.safety_new),
    canDelay: bool(r.can_delay),
    tag: r.tag,
  };
}

// Clothing (first year) — varies hugely by hand-me-downs
const clothingRows = indexBy(parseCsv(clothingCsv), 'scenario');
function clothingRange(key: string) {
  const r = clothingRows[key];
  if (!r) throw new Error(`clothing_first_year.csv missing scenario "${key}"`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
export const clothingFirstYear = {
  mostlyGifts: clothingRange('mostlyGifts'),
  budget: clothingRange('budget'),
  standard: clothingRange('standard'),
  premium: clothingRange('premium'),
};

// Registry coverage assumption — what % of one-time gear gifts cover
const registryRows = indexBy(parseCsv(registryCoverageCsv), 'help_level');
export const registryCoverage = {
  low: num(registryRows.low?.coverage_fraction),
  medium: num(registryRows.medium?.coverage_fraction),
  high: num(registryRows.high?.coverage_fraction),
};

// ============================================================================
// MEDICAL / OUT-OF-POCKET (planning ranges, NOT bills)
// ============================================================================
//
// Sources:
//   - KFF (Aug 2024): women with employer coverage who give birth incur ~$2,854
//     more in OOP costs than women who do not (~$18,865 total additional spend).
//   - Peterson-KFF Health System Tracker: vaginal delivery averages
//     $15,712 / $2,563 OOP; C-section averages $28,998 / $3,071 OOP.
//   - Newborn first-year OOP varies widely by deductible structure and whether
//     the baby is on a separate deductible.
//
// `mid` is anchored close to the published averages. `low` and `high` reflect
// the rough 25th–90th percentile band typical of employer-plan claims data.

type OopRange = { low: number; mid: number; high: number };
type OopByDelivery = { vaginal: OopRange; csection: OopRange };

const birthOopRows = parseCsv(birthOopRangesCsv);
function pickBirthOop(insurance: string, delivery: string): OopRange {
  const r = birthOopRows.find((x) => x.insurance === insurance && x.delivery === delivery);
  if (!r) throw new Error(`birth_oop_ranges.csv missing ${insurance}/${delivery}`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
function birthOopFor(insurance: string): OopByDelivery {
  return {
    vaginal: pickBirthOop(insurance, 'vaginal'),
    csection: pickBirthOop(insurance, 'csection'),
  };
}
export const birthOOPRanges: Record<'employer'|'marketplace'|'medicaid'|'uninsured', OopByDelivery> = {
  employer: birthOopFor('employer'),
  marketplace: birthOopFor('marketplace'),
  medicaid: birthOopFor('medicaid'),
  uninsured: birthOopFor('uninsured'),
};

// Newborn first-year medical (well visits, vaccines, sick visits)
const newbornRows = indexBy(parseCsv(newbornMedicalOopCsv), 'insurance');
function newbornRange(key: string): OopRange {
  const r = newbornRows[key];
  if (!r) throw new Error(`newborn_medical_oop.csv missing insurance "${key}"`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
export const newbornMedicalOOP = {
  employer: newbornRange('employer'),
  marketplace: newbornRange('marketplace'),
  medicaid: newbornRange('medicaid'),
  uninsured: newbornRange('uninsured'),
};

// Anchored billed totals used by the birth-insurance planner to model OOP
// from user-entered deductibles + coinsurance.
const birthAnchorRows = indexBy(parseCsv(birthBilledAnchorsCsv), 'delivery');
export const birthBilledAnchors = {
  vaginal: num(birthAnchorRows.vaginal?.billed_total_usd),
  csection: num(birthAnchorRows.csection?.billed_total_usd),
};

// Add-on for plans where the newborn runs under a separate deductible.
const newbornAddonRows = parseCsv(birthNewbornAddonsCsv);
export type NewbornAddonInsurance = 'employer' | 'marketplace' | 'medicaid' | 'uninsured';
export type NewbornAddonAnswer = 'yes' | 'unsure' | 'no';
export function getNewbornDeductibleAddon(
  insurance: NewbornAddonInsurance,
  answer: NewbornAddonAnswer
): number {
  const r = newbornAddonRows.find((x) => x.insurance === insurance && x.on_separate === answer);
  if (!r) return 0;
  return num(r.addon_usd);
}

// ============================================================================
// MISC RECURRING
// ============================================================================
const miscRows = indexBy(parseCsv(miscMonthlyCsv), 'item');
function miscRange(key: string) {
  const r = miscRows[key];
  if (!r) throw new Error(`misc_monthly.csv missing item "${key}"`);
  return { low: num(r.low_usd), mid: num(r.mid_usd), high: num(r.high_usd) };
}
export const miscMonthly = {
  babyToiletries: miscRange('babyToiletries'),
  babyMedicine: miscRange('babyMedicine'),
  laundryExtras: miscRange('laundryExtras'),
  photos: miscRange('photos'),
  childlife: miscRange('childlife'),
};
