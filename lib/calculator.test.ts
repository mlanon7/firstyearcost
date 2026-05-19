import { describe, it, expect } from 'vitest';
import { calculate, defaultInputs, type CalculatorInputs } from './calculator';
import { cdctcRate, fsaCap, calcSubsidy } from './subsidy';

// ============================================================================
// First-year cost calculator
// ============================================================================

function inputs(overrides: Partial<CalculatorInputs> = {}): CalculatorInputs {
  return { ...defaultInputs, ...overrides };
}

describe('calculate() — first-year baby cost', () => {
  it('returns a non-zero total with default inputs', () => {
    const r = calculate(defaultInputs);
    expect(r.total.mid).toBeGreaterThan(10_000);
    expect(r.total.low).toBeLessThanOrEqual(r.total.mid);
    expect(r.total.mid).toBeLessThanOrEqual(r.total.high);
  });

  it('zeroes childcare when childcarePlan=none', () => {
    const r = calculate(inputs({ childcarePlan: 'none', childcareMonths: 0 }));
    expect(r.childcare.mid).toBe(0);
  });

  it('zeroes childcare when childcarePlan=family', () => {
    const r = calculate(inputs({ childcarePlan: 'family', childcareMonths: 0 }));
    expect(r.childcare.mid).toBe(0);
  });

  it('charges more for centerCare than family help', () => {
    const family = calculate(inputs({ childcarePlan: 'family',     childcareMonths: 0 }));
    const center = calculate(inputs({ childcarePlan: 'centerCare', childcareMonths: 9 }));
    expect(center.childcare.mid).toBeGreaterThan(family.childcare.mid);
  });

  it('second baby pays significantly less for gear', () => {
    const first  = calculate(inputs({ isFirstBaby: true,  gearUsed: false }));
    const second = calculate(inputs({ isFirstBaby: false, gearUsed: false }));
    expect(second.gear.mid).toBeLessThan(first.gear.mid);
    // Second-baby factor (0.55) should produce a meaningful reduction.
    expect(second.gear.mid).toBeLessThan(first.gear.mid * 0.7);
  });

  it('second baby pays significantly less for clothing', () => {
    const first  = calculate(inputs({ isFirstBaby: true }));
    const second = calculate(inputs({ isFirstBaby: false }));
    expect(second.clothing.mid).toBeLessThan(first.clothing.mid * 0.6);
  });

  it('used gear costs less than new gear (first baby)', () => {
    const newGear  = calculate(inputs({ isFirstBaby: true, gearUsed: false }));
    const usedGear = calculate(inputs({ isFirstBaby: true, gearUsed: true }));
    expect(usedGear.gear.mid).toBeLessThan(newGear.gear.mid);
  });

  it('formula feeding costs more than breastfeeding', () => {
    const bf = calculate(inputs({ feedingPlan: 'breastfeeding' }));
    const fm = calculate(inputs({ feedingPlan: 'formula' }));
    expect(fm.feeding.mid).toBeGreaterThan(bf.feeding.mid);
  });

  it('hypoallergenic formula costs more than standard powder', () => {
    const std = calculate(inputs({ feedingPlan: 'formula', formulaType: 'standardPowder' }));
    const hyp = calculate(inputs({ feedingPlan: 'formula', formulaType: 'hypoallergenic' }));
    expect(hyp.feeding.mid).toBeGreaterThan(std.feeding.mid);
  });

  it('employer plan medical OOP < uninsured medical OOP', () => {
    const emp = calculate(inputs({ insurance: 'employer'   }));
    const uni = calculate(inputs({ insurance: 'uninsured'  }));
    expect(emp.medical.mid).toBeLessThan(uni.medical.mid);
  });

  it('Medicaid has near-zero medical OOP for delivery', () => {
    const med = calculate(inputs({ insurance: 'medicaid', delivery: 'vaginal' }));
    // Newborn first-year well-baby is the only line; should be small.
    expect(med.medical.mid).toBeLessThan(500);
  });

  it('C-section costs more than vaginal delivery on employer plan', () => {
    const v = calculate(inputs({ insurance: 'employer', delivery: 'vaginal' }));
    const c = calculate(inputs({ insurance: 'employer', delivery: 'csection' }));
    expect(c.medical.mid).toBeGreaterThan(v.medical.mid);
  });

  it('higher registry help reduces gear out-of-pocket', () => {
    const low  = calculate(inputs({ registryHelp: 'low'  }));
    const high = calculate(inputs({ registryHelp: 'high' }));
    expect(high.gear.mid).toBeLessThan(low.gear.mid);
  });

  it('produces exactly 12 monthly rows', () => {
    const r = calculate(defaultInputs);
    expect(r.monthly).toHaveLength(12);
  });

  it('cumulative monthly equals the sum of monthly totals (within rounding)', () => {
    const r = calculate(defaultInputs);
    const last = r.monthly[r.monthly.length - 1];
    const sum = r.monthly.reduce((a, m) => a + m.total, 0);
    // Each monthly row is independently rounded; 12 × ±1 = ±12 max drift.
    expect(Math.abs(last.cumulative - sum)).toBeLessThanOrEqual(12);
  });
});

// ============================================================================
// Subsidy / tax-credit math (2026 OBBBA rules)
// ============================================================================

describe('cdctcRate() — 2026 OBBBA schedule', () => {
  it('returns 50% at low AGI (single)', () => {
    expect(cdctcRate(10_000, 'single')).toBe(0.50);
    expect(cdctcRate(15_000, 'single')).toBe(0.50);
  });

  it('returns 50% at low AGI (MFJ, doubled threshold)', () => {
    expect(cdctcRate(20_000, 'mfj')).toBe(0.50);
    expect(cdctcRate(30_000, 'mfj')).toBe(0.50);
  });

  it('drops to 35% above the maximum-rate threshold (single)', () => {
    expect(cdctcRate(15_001, 'single')).toBe(0.35);
    expect(cdctcRate(50_000, 'single')).toBe(0.35);
    expect(cdctcRate(75_000, 'single')).toBe(0.35);
  });

  it('drops to 35% above the maximum-rate threshold (MFJ)', () => {
    expect(cdctcRate(30_001, 'mfj')).toBe(0.35);
    expect(cdctcRate(100_000, 'mfj')).toBe(0.35);
    expect(cdctcRate(150_000, 'mfj')).toBe(0.35);
  });

  it('phases down between flat and floor thresholds (single)', () => {
    // At $89,000 (midpoint of $75k–$103k), rate should be ~27.5% (mid of 35% → 20%).
    const r = cdctcRate(89_000, 'single');
    expect(r).toBeGreaterThan(0.20);
    expect(r).toBeLessThan(0.35);
    expect(r).toBeCloseTo(0.275, 2);
  });

  it('phases down between flat and floor thresholds (MFJ)', () => {
    const r = cdctcRate(178_000, 'mfj');
    expect(r).toBeCloseTo(0.275, 2);
  });

  it('hits 20% floor above the floor threshold (single)', () => {
    expect(cdctcRate(103_000, 'single')).toBe(0.20);
    expect(cdctcRate(250_000, 'single')).toBe(0.20);
    expect(cdctcRate(1_000_000, 'single')).toBe(0.20);
  });

  it('hits 20% floor above the floor threshold (MFJ)', () => {
    expect(cdctcRate(206_000, 'mfj')).toBe(0.20);
    expect(cdctcRate(500_000, 'mfj')).toBe(0.20);
  });

  it('MFS uses single thresholds', () => {
    expect(cdctcRate(10_000, 'mfs')).toBe(0.50);
    expect(cdctcRate(50_000, 'mfs')).toBe(0.35);
    expect(cdctcRate(200_000, 'mfs')).toBe(0.20);
  });
});

describe('fsaCap() — 2026 OBBBA exclusion', () => {
  it('returns $7,500 for single, HOH, MFJ', () => {
    expect(fsaCap('single')).toBe(7500);
    expect(fsaCap('hoh')).toBe(7500);
    expect(fsaCap('mfj')).toBe(7500);
  });

  it('returns $3,750 for MFS', () => {
    expect(fsaCap('mfs')).toBe(3750);
  });
});

describe('calcSubsidy() — combined CDCTC + FSA math', () => {
  it('no-double-dip: FSA dollars are excluded from CDCTC base', () => {
    // $15k spend, $7.5k FSA, 1 kid (cap $3k), 35% rate
    // CDCTC base = min(15000 - 7500, 3000) = 3000 → 3000 × 0.35 = 1050
    const r = calcSubsidy({ filing: 'mfj', agi: 95_000, kids: 1, spend: 15_000, fsa: 7500 });
    expect(r.fsaUsed).toBe(7500);
    expect(r.cdctcQual).toBe(3000);
    expect(r.rate).toBe(0.35);
    expect(r.cdctc).toBe(1050);
  });

  it('uses $6,000 CDCTC base for two or more kids', () => {
    // $12k spend, $0 FSA, 2 kids → base $6k × 35% = $2,100
    const r = calcSubsidy({ filing: 'mfj', agi: 95_000, kids: 2, spend: 12_000, fsa: 0 });
    expect(r.cdctcQual).toBe(6000);
    expect(r.cdctc).toBe(2100);
  });

  it('caps FSA at the statutory limit even if user enters more', () => {
    const r = calcSubsidy({ filing: 'mfj', agi: 95_000, kids: 1, spend: 30_000, fsa: 20_000 });
    expect(r.fsaUsed).toBe(7500);
    expect(r.cap).toBe(7500);
  });

  it('caps FSA at MFS limit', () => {
    const r = calcSubsidy({ filing: 'mfs', agi: 60_000, kids: 1, spend: 30_000, fsa: 20_000 });
    expect(r.fsaUsed).toBe(3750);
    expect(r.cap).toBe(3750);
  });

  it('FSA used cannot exceed total spend', () => {
    const r = calcSubsidy({ filing: 'mfj', agi: 95_000, kids: 1, spend: 4_000, fsa: 7500 });
    expect(r.fsaUsed).toBe(4000);
    expect(r.cdctcQual).toBe(0); // No remaining qualifying spend after FSA
    expect(r.cdctc).toBe(0);
  });

  it('low-AGI family gets 50% rate', () => {
    const r = calcSubsidy({ filing: 'mfj', agi: 25_000, kids: 1, spend: 4_000, fsa: 0 });
    expect(r.rate).toBe(0.50);
    expect(r.cdctc).toBe(1500); // 3000 × 0.50
  });

  it('high-AGI family hits 20% floor', () => {
    const r = calcSubsidy({ filing: 'mfj', agi: 300_000, kids: 2, spend: 20_000, fsa: 7500 });
    expect(r.rate).toBe(0.20);
    expect(r.cdctcQual).toBe(6000);
    expect(r.cdctc).toBe(1200);
  });

  it('combined benefit = CDCTC + FSA savings', () => {
    const r = calcSubsidy({ filing: 'mfj', agi: 95_000, kids: 1, spend: 15_000, fsa: 7500 });
    expect(r.combined).toBe(r.cdctc + r.fsaSavings);
  });

  it('no FSA + no spend returns zero benefit', () => {
    const r = calcSubsidy({ filing: 'single', agi: 50_000, kids: 1, spend: 0, fsa: 0 });
    expect(r.combined).toBe(0);
  });
});
