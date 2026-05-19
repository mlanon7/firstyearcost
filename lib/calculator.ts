// Core first-year baby cost calculator logic.
//
// All numbers returned are PLANNING ESTIMATES, not bills.
// All cost ranges are surfaced as low / mid / high. The default returned
// "estimate" is the mid value; ranges are exposed to the UI for transparency.

import {
  diaperUsageByMonth,
  diaperCostPerUnit,
  wipesCostPerWipe,
  wipesPerChange,
  clothDiaperUpfront,
  clothDiaperWashing,
  formulaCostPerMonth,
  breastfeedingSupplies,
  comboFeedingMultiplier,
  unsureFormulaShare,
  unsureSuppliesAllowance,
  gearCosts,
  clothingFirstYear,
  registryCoverage,
  birthOOPRanges,
  newbornMedicalOOP,
  miscMonthly,
  type GearTier,
} from '@/data/assumptions';
import {
  stateChildcare,
  type StateCode,
  getStateByCode,
  applyCareTypeFactor,
} from '@/data/stateChildcare';

// ============================================================================
// Types
// ============================================================================

export type ChildcarePlan =
  | 'none'
  | 'family'
  | 'centerCare'
  | 'homeCare'
  | 'nannyShare'
  | 'nanny'
  | 'partTime'
  | 'unsure';

export type FeedingPlan = 'breastfeeding' | 'formula' | 'combo' | 'unsure';
export type FormulaType = 'standardPowder' | 'sensitive' | 'hypoallergenic' | 'readyToFeed';
export type DiaperPlan = 'disposable' | 'cloth' | 'mix' | 'unsure';
export type DiaperBrandTier = 'budget' | 'mainstream' | 'premium';
export type InsuranceType = 'employer' | 'marketplace' | 'medicaid' | 'uninsured';
export type DeliveryType = 'vaginal' | 'csection' | 'unknown';
export type RegistryHelp = 'low' | 'medium' | 'high';

export type CalculatorInputs = {
  state: StateCode;
  isFirstBaby: boolean;
  householdIncome?: number; // optional
  childcarePlan: ChildcarePlan;
  childcareMonths: number; // months in first year
  feedingPlan: FeedingPlan;
  formulaType?: FormulaType;
  diaperPlan: DiaperPlan;
  diaperBrand: DiaperBrandTier;
  gearTier: GearTier;
  gearUsed: boolean;
  registryHelp: RegistryHelp;
  insurance: InsuranceType;
  delivery: DeliveryType;
  parentalLeaveUnpaidMonths: number;
};

export type Range = { low: number; mid: number; high: number };

export type CalcResult = {
  total: Range;
  oneTimeSetup: Range;
  monthlyRecurringMid: number;
  childcare: Range;
  feeding: Range;
  diapers: Range;
  gear: Range;
  clothing: Range;
  medical: Range;
  miscMonthlyYear: Range;
  monthly: { month: number; total: number; cumulative: number; childcare: number; feeding: number; diapers: number; medical: number; gear: number; misc: number }[];
  delayItems: string[];
  buyNewItems: string[];
  notes: string[];
};

// ============================================================================
// Helpers
// ============================================================================

function range(low: number, mid: number, high: number): Range {
  return { low: Math.round(low), mid: Math.round(mid), high: Math.round(high) };
}

function addRanges(...rs: Range[]): Range {
  return rs.reduce(
    (acc, r) => ({ low: acc.low + r.low, mid: acc.mid + r.mid, high: acc.high + r.high }),
    { low: 0, mid: 0, high: 0 }
  );
}

function scale(r: Range, factor: number): Range {
  return range(r.low * factor, r.mid * factor, r.high * factor);
}

// ============================================================================
// Childcare
// ============================================================================

export function calcChildcare(inputs: CalculatorInputs): Range {
  const state = getStateByCode(inputs.state) ?? stateChildcare[0];
  const months = Math.max(0, Math.min(12, inputs.childcareMonths));
  if (months === 0 || inputs.childcarePlan === 'none' || inputs.childcarePlan === 'family') {
    return range(0, 0, 0);
  }

  let annualLow: number, annualHigh: number;

  switch (inputs.childcarePlan) {
    case 'centerCare':
      annualLow = state.centerLow;
      annualHigh = state.centerHigh;
      break;
    case 'homeCare':
      annualLow = state.homeLow;
      annualHigh = state.homeHigh;
      break;
    case 'nanny':
    case 'nannyShare':
    case 'partTime':
    case 'unsure':
    default: {
      // All derived care types use the multiplier table from
      // public/data/childcare_care_type_factors.csv.
      const careType = (
        inputs.childcarePlan === 'nanny' ||
        inputs.childcarePlan === 'nannyShare' ||
        inputs.childcarePlan === 'partTime'
      ) ? inputs.childcarePlan : 'unsure';
      const ranges = applyCareTypeFactor(state, careType);
      annualLow = ranges.annualLow;
      annualHigh = ranges.annualHigh;
      break;
    }
  }

  const monthlyLow = annualLow / 12;
  const monthlyHigh = annualHigh / 12;
  const low = monthlyLow * months;
  const high = monthlyHigh * months;
  const mid = (low + high) / 2;
  return range(low, mid, high);
}

// ============================================================================
// Feeding
// ============================================================================

export function calcFeeding(inputs: CalculatorInputs): Range {
  if (inputs.feedingPlan === 'breastfeeding') {
    const r = breastfeedingSupplies;
    return range(
      r.pumpOutOfPocket.low + r.bottlesAndStorage.low + r.pumpPartsReplacement.low + r.bras.low + r.pads.low + r.lactationConsultOOP.low,
      r.pumpOutOfPocket.mid + r.bottlesAndStorage.mid + r.pumpPartsReplacement.mid + r.bras.mid + r.pads.mid + r.lactationConsultOOP.mid,
      r.pumpOutOfPocket.high + r.bottlesAndStorage.high + r.pumpPartsReplacement.high + r.bras.high + r.pads.high + r.lactationConsultOOP.high
    );
  }

  const formulaType = inputs.formulaType ?? 'standardPowder';
  const f = formulaCostPerMonth[formulaType];

  if (inputs.feedingPlan === 'formula') {
    // 12 months of formula
    return range(f.low * 12, f.mid * 12, f.high * 12);
  }

  if (inputs.feedingPlan === 'combo') {
    const formulaPart = scale(range(f.low * 12, f.mid * 12, f.high * 12), comboFeedingMultiplier);
    const supplies = breastfeedingSupplies;
    const suppliesRange = range(
      supplies.bottlesAndStorage.low + supplies.bras.low + supplies.pads.low + supplies.pumpPartsReplacement.low,
      supplies.bottlesAndStorage.mid + supplies.bras.mid + supplies.pads.mid + supplies.pumpPartsReplacement.mid,
      supplies.bottlesAndStorage.high + supplies.bras.high + supplies.pads.high + supplies.pumpPartsReplacement.high
    );
    return addRanges(formulaPart, suppliesRange);
  }

  // unsure → midpoint of combo. Both the formula share and the supplies
  // allowance come from public/data/feeding_factors.csv.
  const formulaPart = scale(range(f.low * 12, f.mid * 12, f.high * 12), unsureFormulaShare);
  return addRanges(
    formulaPart,
    range(unsureSuppliesAllowance.low, unsureSuppliesAllowance.mid, unsureSuppliesAllowance.high)
  );
}

// ============================================================================
// Diapers & Wipes
// ============================================================================

export function calcDiapers(inputs: CalculatorInputs): Range {
  const totalDiapers = diaperUsageByMonth.reduce((a, m) => a + m.perDay * 30.4, 0); // ~2,700

  if (inputs.diaperPlan === 'cloth') {
    const upfront = clothDiaperUpfront;
    const washingLow = clothDiaperWashing.perMonthLow * 12;
    const washingHigh = clothDiaperWashing.perMonthHigh * 12;
    const washingMid = (washingLow + washingHigh) / 2;
    const wipesLow = totalDiapers * wipesPerChange * wipesCostPerWipe.budget;
    const wipesHigh = totalDiapers * wipesPerChange * wipesCostPerWipe.premium;
    return range(
      upfront.low + washingLow + wipesLow * 0.6,
      upfront.mid + washingMid + (wipesLow + wipesHigh) / 2,
      upfront.high + washingHigh + wipesHigh
    );
  }

  if (inputs.diaperPlan === 'mix') {
    // 60% disposable / 40% cloth split (approx)
    const dispRange = costForDisposable(totalDiapers * 0.6, inputs.diaperBrand);
    const clothRange: Range = range(
      clothDiaperUpfront.low * 0.7 + clothDiaperWashing.perMonthLow * 12 * 0.6,
      clothDiaperUpfront.mid * 0.7 + ((clothDiaperWashing.perMonthLow + clothDiaperWashing.perMonthHigh) / 2) * 12 * 0.6,
      clothDiaperUpfront.high * 0.7 + clothDiaperWashing.perMonthHigh * 12 * 0.6
    );
    const wipesRange = costForWipes(totalDiapers, inputs.diaperBrand);
    return addRanges(dispRange, clothRange, wipesRange);
  }

  // disposable (default)
  const disp = costForDisposable(totalDiapers, inputs.diaperBrand);
  const wipes = costForWipes(totalDiapers, inputs.diaperBrand);
  return addRanges(disp, wipes);
}

function costForDisposable(numDiapers: number, brand: DiaperBrandTier): Range {
  const c = diaperCostPerUnit[brand];
  return range(numDiapers * c.low, numDiapers * c.mid, numDiapers * c.high);
}

function costForWipes(numDiapers: number, brand: DiaperBrandTier): Range {
  const wipeRate = brand === 'budget' ? wipesCostPerWipe.budget : brand === 'premium' ? wipesCostPerWipe.premium : wipesCostPerWipe.mainstream;
  const wipeCost = numDiapers * wipesPerChange * wipeRate;
  return range(wipeCost * 0.85, wipeCost, wipeCost * 1.2);
}

// ============================================================================
// Gear & Nursery
// ============================================================================

export function calcGear(inputs: CalculatorInputs): Range {
  const tier = inputs.gearTier;
  const items = Object.values(gearCosts).map((g) => g[tier]);
  const baseTotal = items.reduce((a, b) => a + b, 0);

  // Used / hand-me-down discount — buying secondhand vs new.
  const usedFactor = inputs.gearUsed ? 0.55 : 1.0;

  // Second-baby carryover. Most durable gear (crib, dresser, monitor, carrier,
  // bath gear, swaddles, toys, books) survives from the first child within
  // safety expiration. Items that must be replaced (car seat if expired,
  // bottle nipples, mattress in some cases) keep some baseline spend, hence
  // 0.55 not zero. Stacks with usedFactor and registry coverage.
  const secondBabyFactor = inputs.isFirstBaby ? 1.0 : 0.55;

  // Registry coverage offsets out-of-pocket. Three reductions multiply but we
  // cap combined retention at 0.2 — even the most-equipped second-baby family
  // with high registry help has some unavoidable spend.
  const reg = registryCoverage[inputs.registryHelp];
  const combinedRetention = Math.max(0.2, usedFactor * secondBabyFactor * (1 - reg));
  const adjusted = baseTotal * combinedRetention;

  return range(adjusted * 0.8, adjusted, adjusted * 1.3);
}

export function calcClothing(inputs: CalculatorInputs): Range {
  const helpKey =
    inputs.registryHelp === 'high' ? 'mostlyGifts' :
    inputs.gearTier === 'budget' ? 'budget' :
    inputs.gearTier === 'premium' ? 'premium' :
    'standard';
  const r = clothingFirstYear[helpKey];

  // Second-baby carryover for clothing is large. Newborn-through-12-month
  // wardrobe from baby #1 covers most needs; new spend is mostly seasonal
  // gaps and replacements.
  const secondBabyFactor = inputs.isFirstBaby ? 1.0 : 0.45;
  return range(r.low * secondBabyFactor, r.mid * secondBabyFactor, r.high * secondBabyFactor);
}

// ============================================================================
// Medical
// ============================================================================

export function calcMedical(inputs: CalculatorInputs): Range {
  const insBirth = birthOOPRanges[inputs.insurance];
  const delivery = inputs.delivery === 'unknown'
    ? range(
        (insBirth.vaginal.low + insBirth.csection.low) / 2,
        (insBirth.vaginal.mid + insBirth.csection.mid) / 2,
        (insBirth.vaginal.high + insBirth.csection.high) / 2
      )
    : range(insBirth[inputs.delivery].low, insBirth[inputs.delivery].mid, insBirth[inputs.delivery].high);

  const newborn = newbornMedicalOOP[inputs.insurance];
  return addRanges(delivery, range(newborn.low, newborn.mid, newborn.high));
}

// ============================================================================
// Misc recurring
// ============================================================================

export function calcMisc(): Range {
  const m = miscMonthly;
  const monthly = range(
    m.babyToiletries.low + m.babyMedicine.low + m.laundryExtras.low + m.photos.low + m.childlife.low,
    m.babyToiletries.mid + m.babyMedicine.mid + m.laundryExtras.mid + m.photos.mid + m.childlife.mid,
    m.babyToiletries.high + m.babyMedicine.high + m.laundryExtras.high + m.photos.high + m.childlife.high
  );
  return scale(monthly, 12);
}

// ============================================================================
// Master calculator
// ============================================================================

export function calculate(inputs: CalculatorInputs): CalcResult {
  const childcare = calcChildcare(inputs);
  const feeding = calcFeeding(inputs);
  const diapers = calcDiapers(inputs);
  const gear = calcGear(inputs);
  const clothing = calcClothing(inputs);
  const medical = calcMedical(inputs);
  const misc = calcMisc();

  const total = addRanges(childcare, feeding, diapers, gear, clothing, medical, misc);

  // One-time setup = mostly gear + clothing + birth medical (rough split)
  const oneTime = addRanges(gear, clothing);

  // Monthly recurring (mid) excluding one-time and medical birth bill
  const monthlyMid =
    (childcare.mid + feeding.mid + diapers.mid + misc.mid) / 12;

  // Month-by-month breakdown
  const monthly: CalcResult['monthly'] = [];
  let cumulative = 0;
  const childcareMonthlyMid = inputs.childcareMonths > 0 ? childcare.mid / inputs.childcareMonths : 0;
  const childcareStartMonth = inputs.childcarePlan === 'family' || inputs.childcarePlan === 'none' ? 13 :
    inputs.childcareMonths >= 12 ? 1 : 13 - inputs.childcareMonths;

  for (let m = 1; m <= 12; m++) {
    const ccThis = m >= childcareStartMonth && inputs.childcareMonths > 0 ? childcareMonthlyMid : 0;
    const feedThis = feeding.mid / 12;
    const diaperShareDay = diaperUsageByMonth[m - 1].perDay;
    const totalDiaperDays = diaperUsageByMonth.reduce((a, x) => a + x.perDay, 0);
    const diapThis = (diapers.mid * diaperShareDay) / totalDiaperDays;
    const medThis = m === 1 ? medical.mid * 0.8 : (medical.mid * 0.2) / 11;
    const gearThis = m === 1 ? oneTime.mid * 0.7 : m === 2 ? oneTime.mid * 0.15 : (oneTime.mid * 0.15) / 10;
    const miscThis = misc.mid / 12;

    const totalThis = ccThis + feedThis + diapThis + medThis + gearThis + miscThis;
    cumulative += totalThis;

    monthly.push({
      month: m,
      total: Math.round(totalThis),
      cumulative: Math.round(cumulative),
      childcare: Math.round(ccThis),
      feeding: Math.round(feedThis),
      diapers: Math.round(diapThis),
      medical: Math.round(medThis),
      gear: Math.round(gearThis),
      misc: Math.round(miscThis),
    });
  }

  // Delay items (categorical guidance)
  const delayItems: string[] = [
    'High chair — most babies start solids around 4-6 months',
    'Walker / activity center — use when baby sits unassisted',
    'Wipes warmer — many babies do fine without one',
    'Specialized infant shoes before walking',
    'Large size diaper bulk-buys before knowing fit',
    'Baby food maker — start with what you already have',
  ];
  const buyNewItems: string[] = [
    'Car seat — always new or only with verified history (no drops, no expiration, original parts)',
    'Crib & crib mattress — must meet current CPSC standards',
    'Breast pump — usually covered new through insurance',
    'Pacifiers, bottle nipples — replace per manufacturer schedule',
  ];

  const notes: string[] = [
    'Planning estimate, not medical, insurance, or financial advice.',
    'Actual costs vary by location, provider, insurance plan, and family choices.',
  ];
  if (inputs.insurance === 'uninsured') {
    notes.push(
      'You may qualify for Medicaid, CHIP, or marketplace subsidies. Check healthcare.gov or your state Medicaid office before estimating uninsured costs.'
    );
  }
  if (inputs.parentalLeaveUnpaidMonths > 0) {
    notes.push(
      `Plan for ${inputs.parentalLeaveUnpaidMonths} month(s) of unpaid leave separately — this calculator estimates baby costs, not lost income.`
    );
  }

  return {
    total,
    oneTimeSetup: oneTime,
    monthlyRecurringMid: Math.round(monthlyMid),
    childcare,
    feeding,
    diapers,
    gear,
    clothing,
    medical,
    miscMonthlyYear: misc,
    monthly,
    delayItems,
    buyNewItems,
    notes,
  };
}

// ============================================================================
// Default inputs
// ============================================================================

export const defaultInputs: CalculatorInputs = {
  state: 'CA',
  isFirstBaby: true,
  childcarePlan: 'centerCare',
  childcareMonths: 9,
  feedingPlan: 'combo',
  formulaType: 'standardPowder',
  diaperPlan: 'disposable',
  diaperBrand: 'mainstream',
  gearTier: 'standard',
  gearUsed: false,
  registryHelp: 'medium',
  insurance: 'employer',
  delivery: 'unknown',
  // `parentalLeaveUnpaidMonths` removed from the UI in 2026-05-19 audit pass.
  // Field retained on the type for back-compat with presets; default 0.
  parentalLeaveUnpaidMonths: 0,
};
