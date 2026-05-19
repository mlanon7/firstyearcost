// Source notes — every assumption block in the calculator should map to one of these.
// Update lastReviewed when reverifying.

export type SourceNote = {
  id: string;
  title: string;
  org: string;
  url: string;
  dataYear: string;
  lastReviewed: string;
  notes?: string;
};

export const sourceNotes: SourceNote[] = [
  {
    id: 'cdc-births-2024',
    title: 'CDC NCHS Data Brief #535 — Births: Final Data for 2024',
    org: 'CDC / National Center for Health Statistics',
    url: 'https://www.cdc.gov/nchs/data/databriefs/db535.pdf',
    dataYear: '2024',
    lastReviewed: '2026-05-08',
    notes: '3,628,934 U.S. births reported in 2024 final data (released July 2025).',
  },
  {
    id: 'kff-pregnancy-costs-2024',
    title: 'Women Who Give Birth Incur Nearly $19,000 in Additional Health Costs, Including $2,854 More That They Pay Out-of-Pocket',
    org: 'Kaiser Family Foundation',
    url: 'https://www.kff.org/health-costs/women-who-give-birth-incur-nearly-19000-in-additional-health-costs-including-2854-more-that-they-pay-out-of-pocket/',
    dataYear: '2022 claims (released Aug 2024)',
    lastReviewed: '2026-05-08',
    notes:
      'Women with employer-sponsored insurance who gave birth incurred ~$18,865 in additional pregnancy/birth/postpartum costs vs. women who did not give birth, of which ~$2,854 was out-of-pocket.',
  },
  {
    id: 'kff-pregnancy-costs',
    title: 'Health Costs Associated with Pregnancy, Childbirth, and Postpartum Care',
    org: 'Peterson-KFF Health System Tracker',
    url: 'https://www.healthsystemtracker.org/brief/health-costs-associated-with-pregnancy-childbirth-and-postpartum-care/',
    dataYear: '2022 claims analysis',
    lastReviewed: '2026-05-08',
    notes:
      'Vaginal delivery averages $15,712 total / $2,563 OOP; C-section averages $28,998 total / $3,071 OOP for employer-sponsored coverage. Used as the methodology footnote behind our birth OOP ranges.',
  },
  {
    id: 'ccaoa-price-landscape',
    title: 'Child Care Aware of America — 2024 Price of Care Landscape',
    org: 'Child Care Aware of America',
    url: 'https://www.childcareaware.org/price-landscape24/',
    dataYear: '2023 market rate surveys',
    lastReviewed: '2026-05-08',
    notes: 'Most recent national price landscape; underpins state-by-state center / home / nanny ranges.',
  },
  {
    id: 'usda-coc',
    title: 'What Does It Cost to Raise a Child?',
    org: 'USDA',
    url: 'https://www.usda.gov/about-usda/news/blog/what-does-it-cost-raise-child',
    dataYear: '2017 (last published)',
    lastReviewed: '2026-04-30',
    notes:
      'USDA discontinued the Expenditures on Children by Families report after 2017. Used as historical context only — not adjusted as a current first-year benchmark.',
  },
  {
    id: 'aap-newborn-care',
    title: 'AAP Bright Futures — Pediatric Periodicity Schedule (Well-Baby Visits)',
    org: 'American Academy of Pediatrics',
    url: 'https://www.aap.org/en/practice-management/bright-futures/',
    dataYear: 'Continuously updated',
    lastReviewed: '2026-05-08',
    notes: 'Schedule for well-baby visits used to model first-year pediatric out-of-pocket costs. Diaper-change and feeding cadence cross-referenced from HealthyChildren.org.',
  },
  {
    id: 'aap-safe-sleep-2022',
    title: 'AAP Policy Statement — Sleep-Related Infant Deaths: Updated 2022 Recommendations',
    org: 'American Academy of Pediatrics',
    url: 'https://publications.aap.org/pediatrics/article/150/1/e2022057990/188304/',
    dataYear: '2022',
    lastReviewed: '2026-05-08',
    notes: 'Source for "room-share for at least the first 6 months" guidance and safe-sleep gear recommendations.',
  },
  {
    id: 'cms-no-surprises',
    title: 'No Surprises Act — Overview',
    org: 'Centers for Medicare & Medicaid Services',
    url: 'https://www.cms.gov/nosurprises',
    dataYear: 'Effective January 2022',
    lastReviewed: '2026-05-08',
    notes: 'Federal protections against surprise out-of-network billing for emergency and certain non-emergency services.',
  },
  {
    id: 'healthcare-gov-breast-pump',
    title: 'Breastfeeding benefits — HealthCare.gov',
    org: 'U.S. Centers for Medicare & Medicaid Services',
    url: 'https://www.healthcare.gov/coverage/breast-feeding-benefits/',
    dataYear: 'Continuously updated',
    lastReviewed: '2026-05-08',
    notes: 'ACA-mandated coverage for a breast pump and lactation support for the duration of breastfeeding.',
  },
  {
    id: 'healthcare-gov-newborn-sep',
    title: 'Special enrollment for a newborn — HealthCare.gov',
    org: 'U.S. Centers for Medicare & Medicaid Services',
    url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/',
    dataYear: 'Continuously updated',
    lastReviewed: '2026-05-08',
    notes: 'Birth of a child triggers a 60-day special enrollment window (group plans typically allow 30+ days).',
  },
  {
    id: 'hhs-ccdf-7-percent',
    title: 'Improving Child Care Access, Affordability, and Stability in the Child Care and Development Fund (CCDF)',
    org: 'U.S. Department of Health & Human Services / Administration for Children and Families',
    url: 'https://www.federalregister.gov/documents/2024/03/01/2024-04139/improving-child-care-access-affordability-and-stability-in-the-child-care-and-development-fund-ccdf',
    dataYear: '2024 final rule',
    lastReviewed: '2026-05-08',
    notes: 'Source for the 7%-of-income childcare-affordability benchmark, which applies specifically to copayments for low-income families receiving CCDF subsidies.',
  },
  {
    id: 'cpsc-cribs',
    title: 'CPSC Crib Safety Standards',
    org: 'U.S. Consumer Product Safety Commission',
    url: 'https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/cribs',
    dataYear: 'Current',
    lastReviewed: '2026-04-30',
  },
  {
    id: 'retail-q1-2026',
    title: 'Retail Pricing Snapshot, Q1 2026',
    org: 'Internal — sampled major US retailers (Target, Walmart, Costco, Amazon)',
    url: '#',
    dataYear: '2026-Q1',
    lastReviewed: '2026-04-30',
    notes: 'Diaper, wipe, formula, gear ranges sampled across budget/mainstream/premium tiers.',
  },
];

export function getSource(id: string) {
  return sourceNotes.find((s) => s.id === id);
}
