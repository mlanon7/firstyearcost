// Hover/tap tooltip content for every segmented option on the main calculator.
// Keep summaries short (≤14 words) and bullets concrete. Avoid medical advice
// and brand recommendations; cite cost ranges, not "best".

import type { TipContent } from '@/components/InfoTip';

// =========================================================================
// First baby vs additional child
// =========================================================================
export const tipsFirstBaby: Record<'yes' | 'no', TipContent> = {
  yes: {
    summary: 'No prior gear or clothes — full retail spend across nursery and wardrobe.',
    covers: [
      'Full first-year gear list at the tier you pick',
      'Full clothing wardrobe (NB through 12-month sizes)',
      'No carryover savings',
    ],
    bestFor: ['First-time parents', 'Adoptive parents starting fresh'],
    tradeoffs: ['Higher one-time setup cost (~$1,500–$3,800)'],
  },
  no: {
    summary: 'Reuse most gear and clothing from a previous child.',
    covers: [
      'Carries forward crib, dresser, monitor, strollers, carriers',
      'Wardrobe largely covered if seasons align',
      'Replaces safety-expired items: car seat, bottle nipples, sometimes mattress',
    ],
    bestFor: ['Second-plus baby within ~6 years', 'Families with hand-me-downs available'],
    tradeoffs: ['Check car seat expiration & crash history before reusing'],
    example: 'Typical savings: 35–55% off year-one gear total vs first baby.',
  },
};

// =========================================================================
// Childcare plan
// =========================================================================
export const tipsChildcare: Record<string, TipContent> = {
  centerCare: {
    summary: 'Licensed daycare center — group infant room with multiple caregivers.',
    covers: [
      'Full-day care (typically 7am–6pm) with backup staff',
      'Required staff-to-infant ratios (1:3 or 1:4 most states)',
      'Curriculum, meals, sometimes diapers/formula',
    ],
    bestFor: [
      'Working parents who want reliable, structured care',
      'Families that benefit from socialization & predictable schedule',
    ],
    tradeoffs: [
      'Most expensive widely-available option in many states',
      '6–12 month waitlists common in cities',
      'Sick-child exclusion policies require backup plan',
    ],
    example: 'Infant center care: ~$9,000 (low-cost states) to $24,000+/yr (high-cost metros).',
  },
  homeCare: {
    summary: 'Family childcare home — licensed in-home setting, smaller group.',
    covers: [
      'Small group (typically 4–8 kids of mixed ages)',
      'Single primary caregiver, often more flexible hours',
      'Home-like environment',
    ],
    bestFor: ['Parents wanting a smaller group than a center', 'Non-9-to-5 schedules'],
    tradeoffs: [
      'No backup staff — if caregiver is sick, you scramble',
      'Less curriculum standardization',
      'Mixed-age groups may be less structured for infants',
    ],
    example: 'Typically 15–25% cheaper than center care in the same area.',
  },
  nanny: {
    summary: 'Full-time in-home nanny — one-on-one care in your home.',
    covers: [
      'One-on-one infant attention',
      'Care continues when baby is mildly sick',
      'Often includes light household tasks per agreement',
    ],
    bestFor: ['Twins / two close-in-age kids (most cost-effective)', 'Non-standard schedules'],
    tradeoffs: [
      'Most expensive option for one child',
      'You become an employer: payroll tax, taxes, benefits add ~10–12%',
      'No automatic backup if nanny is sick',
    ],
    example: 'Typical nanny range: $35,000–$60,000+/yr plus ~10% employer taxes.',
  },
  nannyShare: {
    summary: 'Two families split one nanny — sweet spot between daycare and nanny.',
    covers: [
      'One-on-two attention (your child + one other)',
      'Cost split between families',
      'Built-in playmate, more flexibility than daycare',
    ],
    bestFor: ['Families with a like-minded friend and similar-age baby'],
    tradeoffs: [
      'Coordination overhead (schedules, location, sick days)',
      'Still an employer relationship with employment-tax burden',
    ],
    example: 'Typical share cost per family: $20,000–$32,000/yr.',
  },
  partTime: {
    summary: 'Part-time daycare — typically 2 or 3 days a week.',
    covers: [
      'Same staffing & curriculum as full-time, fewer days',
      'Lower monthly bill (usually 60–70% of full-time)',
    ],
    bestFor: [
      'One parent home some days',
      'Hybrid work arrangements',
      'Bridging from full leave to full-time childcare',
    ],
    tradeoffs: [
      'Per-day rate is higher than full-time (60–70%, not 40–60%)',
      'Spots are scarcer than full-time in many centers',
    ],
  },
  family: {
    summary: 'Unpaid help from grandparents, relatives, or close friends.',
    covers: ['No paid childcare bill', 'Months slider locked at 0'],
    bestFor: [
      'Families with a willing grandparent/relative locally',
      'Bridging months between leave and paid care',
    ],
    tradeoffs: [
      'Reliability depends on the caregiver\'s health & availability',
      'Family dynamics can complicate boundaries',
      'Some informal-cost trade (groceries, gas, gifts) is common',
    ],
  },
  none: {
    summary: 'No childcare needed — one parent home full-time, or other arrangement.',
    covers: ['No childcare line in the budget'],
    bestFor: [
      'Stay-at-home parent for full first year',
      'Self-employed parent with flexible schedule',
      'Modeling the budget before deciding on childcare',
    ],
    tradeoffs: [
      'Lost income from the at-home parent isn\'t modeled here',
      'Will likely need a plan before the second year',
    ],
  },
  unsure: {
    summary: 'Not yet decided — calculator uses a blended mid-range estimate.',
    covers: ['Mid-range cost mix across center, home, and nanny options'],
    bestFor: ['Early planning before touring providers'],
    tradeoffs: ['Re-run the calculator once you\'ve picked a path for better accuracy'],
  },
};

// =========================================================================
// Feeding plan
// =========================================================================
export const tipsFeeding: Record<string, TipContent> = {
  breastfeeding: {
    summary: 'Exclusive breastfeeding for the first 6+ months, with supplies budget.',
    covers: [
      'Breast pump (insurance-covered new through ACA, replace parts/tubes)',
      'Storage bags, bottles, nipples',
      'Nursing bras, pads, lactation support',
    ],
    bestFor: ['Parents planning to nurse exclusively', 'Lowest year-one feeding cost'],
    tradeoffs: [
      'Supplies front-loaded in first 3 months',
      'Pumping at work requires time + space',
      'Not all parents are able to or choose to — that\'s OK',
    ],
    example: 'Year-one feeding cost: typically $300–$1,400 (mostly supplies).',
  },
  formula: {
    summary: 'Formula feeding for the first 12 months.',
    covers: [
      'Standard, sensitive, hypoallergenic, or ready-to-feed formula',
      'Bottles, nipples, sterilizer',
      'Optional formula warmer or pre-mix dispenser',
    ],
    bestFor: [
      'Parents not breastfeeding or supplementing heavily',
      'Predictable, shareable feeding routine',
    ],
    tradeoffs: [
      'Largest recurring feeding cost ($1,200–$3,600/yr typical)',
      'Hypoallergenic formula can double or triple the bill',
      'Recurring purchases — subscription often saves 5–15%',
    ],
  },
  combo: {
    summary: 'Mix of breastfeeding and formula — common real-world pattern.',
    covers: [
      'Breastfeeding supplies + partial formula',
      'Models ~50% of full-formula cost plus most breastfeeding supplies',
    ],
    bestFor: [
      'Parents returning to work but continuing to nurse',
      'Supplementing for supply, time, or preference',
    ],
    tradeoffs: ['Real cost varies widely — adjust the ratio in your head if you skew one way'],
  },
  unsure: {
    summary: 'Haven\'t decided — assumes a moderate combo scenario.',
    covers: ['Conservative midpoint between breastfeeding and full formula'],
    tradeoffs: ['Plans often change in the first 4–6 weeks; re-run later'],
  },
};

// =========================================================================
// Formula type
// =========================================================================
export const tipsFormulaType: Record<string, TipContent> = {
  standardPowder: {
    summary: 'Standard cow-milk powder — the default for most healthy infants.',
    covers: ['Major brands: Similac Advance, Enfamil NeuroPro, Kirkland, Up & Up, Mama Bear, Bobbie'],
    bestFor: ['Most healthy term babies with no diagnosed sensitivity'],
    tradeoffs: ['Cheapest formula tier; varies by brand and bulk-buy'],
    example: 'Typical monthly cost: $130–$220 with subscription/bulk; $180–$280 retail.',
  },
  sensitive: {
    summary: 'Reduced-lactose or gentle formula — for fussiness, gas, mild reflux.',
    covers: ['Major brands: Similac Sensitive, Enfamil Gentlease, Gerber Soothe'],
    bestFor: [
      'Babies with parent-noticed gas or fussiness',
      'After pediatrician-suggested switch',
    ],
    tradeoffs: [
      'Typically 15–30% more than standard powder',
      'Not the same as hypoallergenic — talk to pediatrician for true allergies',
    ],
  },
  hypoallergenic: {
    summary: 'Extensively hydrolyzed or amino-acid formula for diagnosed allergies.',
    covers: ['Major brands: Nutramigen, Alimentum, EleCare, Neocate'],
    bestFor: [
      'Babies with diagnosed milk-protein allergy',
      'Pediatrician- or GI-prescribed only',
    ],
    tradeoffs: [
      'Most expensive tier — 2–3× standard formula',
      'Often covered by insurance/Medicaid/WIC when prescribed; check before paying',
      'Strong taste; some babies need a transition period',
    ],
    example: 'Typical monthly cost: $400–$700+ before insurance.',
  },
  readyToFeed: {
    summary: 'Pre-mixed liquid formula in bottles or cans — no mixing.',
    covers: ['Available in all formula types (standard, sensitive, hypoallergenic)'],
    bestFor: [
      'First weeks home from hospital',
      'Travel or caregiver handoffs',
      'NICU recommendations',
    ],
    tradeoffs: [
      '40–80% more expensive per oz than powder',
      'Short shelf life after opening (~48h refrigerated)',
    ],
  },
};

// =========================================================================
// Diaper plan
// =========================================================================
export const tipsDiapers: Record<string, TipContent> = {
  disposable: {
    summary: 'Single-use disposable diapers — the most common choice.',
    covers: [
      '~2,500–3,000 diapers in year one',
      'Wipes by the case',
      'No laundry overhead',
    ],
    bestFor: ['Most parents; especially renters, frequent travelers, dual-income households'],
    tradeoffs: [
      '$700–$1,100 typical year-one bill',
      'Brand fit varies — buy small packs before committing to a case',
    ],
  },
  cloth: {
    summary: 'Reusable cloth diapers + home laundry or diaper service.',
    covers: [
      'Pocket diapers, prefolds, or all-in-ones',
      'Inserts, liners, wet bag',
      'Laundry water/energy cost OR a diaper service subscription',
    ],
    bestFor: [
      'Budget-focused families staying with the same baby',
      'Parents reusing for a second child (savings compound)',
    ],
    tradeoffs: [
      'High upfront stash cost ($350–$1,000)',
      'More laundry (~3 loads/week)',
      'Not always accepted at daycare — confirm before buying',
    ],
    example: 'Year-one cost (DIY laundry): typically $500–$900. With a service: $1,200–$1,800.',
  },
  mix: {
    summary: 'Cloth at home, disposable for daycare and travel.',
    covers: ['Smaller cloth stash + part-time disposables'],
    bestFor: ['Pragmatic budget families', 'Daycares that don\'t accept cloth'],
    tradeoffs: ['Two systems to manage; less savings than full cloth'],
  },
  unsure: {
    summary: 'Defaults to disposable for planning purposes.',
    covers: ['Disposable cost range — easy to swap later'],
    tradeoffs: ['Try a cloth-trial program before committing to a full stash'],
  },
};

// =========================================================================
// Diaper brand tier
// =========================================================================
export const tipsDiaperBrand: Record<string, TipContent> = {
  budget: {
    summary: 'Store brands and value packs — Kirkland, Up & Up, Mama Bear, Parent\'s Choice.',
    covers: ['Generally 30–50% cheaper per diaper than name brands'],
    bestFor: ['Daytime use', 'Cost-conscious families', 'Newborn-stage volume'],
    tradeoffs: [
      'Fit varies — try small packs before a case',
      'Some parents prefer a different brand for overnight',
    ],
  },
  mainstream: {
    summary: 'Pampers Baby Dry / Cruisers, Huggies Snug & Dry / Little Movers.',
    covers: ['Wider absorbency lineup; consistent fit'],
    bestFor: ['Parents who want a single brand across day + night'],
    tradeoffs: ['Mid-tier price; subscribe & save brings cost closer to budget tier'],
  },
  premium: {
    summary: 'Pampers Pure, Honest, Coterie, Millie Moon, Hello Bello.',
    covers: ['Plant-derived materials; tighter absorbency; minimal additives'],
    bestFor: ['Sensitive skin', 'Parents prioritizing materials over price'],
    tradeoffs: [
      'Highest cost (50–100% more than budget tier)',
      'Subscription models help but still pricier',
    ],
  },
};

// =========================================================================
// Gear tier
// =========================================================================
export const tipsGearTier: Record<string, TipContent> = {
  budget: {
    summary: 'Functional, safety-compliant gear at the lowest defensible price.',
    covers: [
      'Graco / Evenflo / Safety 1st for car seats and strollers',
      'IKEA crib + budget mattress',
      'Basic monitors and bottles',
    ],
    bestFor: ['Tight budget', 'Open to refurbishing or hand-me-downs'],
    tradeoffs: ['Some items look basic; longevity varies; resale value lower'],
    example: 'Full gear list at budget tier: ~$1,100–$1,500 before registry offsets.',
  },
  standard: {
    summary: 'Mainstream brands at typical retail tier.',
    covers: [
      'Chicco / Britax / UPPAbaby Mesa for car seats',
      'Babyletto / DaVinci cribs',
      'Nanit / Eufy monitors',
    ],
    bestFor: ['Most families; balanced cost and quality'],
    tradeoffs: ['Mid-tier; expect to spend ~$2,200–$3,000 across all items'],
  },
  premium: {
    summary: 'Top-end brands and tech-forward gear.',
    covers: [
      'UPPAbaby Vista, Nuna Demi Grow, Doona',
      'Snoo bassinet, Owlet monitor',
      'Solid-wood designer cribs',
    ],
    bestFor: ['Parents prioritizing aesthetics, longevity, or specific features'],
    tradeoffs: [
      'Year-one gear can exceed $4,500–$6,000',
      'Marginal safety/utility benefit over standard tier in most cases',
    ],
  },
};

// =========================================================================
// Used gear
// =========================================================================
export const tipsGearUsed: Record<'yes' | 'no', TipContent> = {
  yes: {
    summary: 'Mostly secondhand / hand-me-downs — applies a ~45% discount.',
    covers: [
      'Furniture, strollers, carriers, high chairs, books, toys',
      'Clothes (usually free or near-free in batches)',
    ],
    bestFor: ['Sustainability-focused families', 'Budget-conscious planners'],
    tradeoffs: [
      'Always verify car seat: not expired, never in a crash, original parts',
      'Check CPSC recall list before using crib or playpen',
      'Replace mattress + bottle nipples regardless of source',
    ],
  },
  no: {
    summary: 'Mostly new — items bought retail or off the registry.',
    covers: ['Full retail spend at the chosen tier'],
    bestFor: ['First-time parents', 'Generous registry coverage from family'],
    tradeoffs: ['Higher one-time cost; consider mixing in used for non-safety items'],
  },
};

// =========================================================================
// Registry help
// =========================================================================
export const tipsRegistry: Record<string, TipContent> = {
  low: {
    summary: 'Small or no baby shower — you cover most gear yourself.',
    covers: ['~10–15% of gear typically gifted'],
    bestFor: ['Private families', 'Second-plus baby', 'Adoption planning'],
    tradeoffs: ['Out-of-pocket setup cost is highest'],
  },
  medium: {
    summary: 'Typical baby shower — friends/family cover a meaningful share.',
    covers: ['~30–45% of gear typically gifted'],
    bestFor: ['Most first-baby families with a shower'],
  },
  high: {
    summary: 'Generous registry coverage — multiple showers or gift-givers.',
    covers: ['~55–70% of gear typically gifted'],
    bestFor: [
      'Strong family/community network',
      'Multiple showers (work, family, friends)',
    ],
    tradeoffs: [
      'You\'ll likely receive duplicates or items you don\'t use',
      'Babylist/Amazon return policies matter here',
    ],
  },
};

// =========================================================================
// Insurance type
// =========================================================================
export const tipsInsurance: Record<string, TipContent> = {
  employer: {
    summary: 'Group health plan from your or your spouse\'s employer.',
    covers: [
      'Maternity and newborn care as ACA essential benefits',
      'Lactation support and one breast pump per pregnancy',
      'Annual deductible + out-of-pocket max',
    ],
    bestFor: ['Most working parents'],
    tradeoffs: [
      'Plan-year reset can hit during pregnancy — verify with HR',
      'Newborn may have a separate deductible on some plans',
    ],
    example: 'Typical employer-plan birth OOP: ~$1,200–$6,500 depending on delivery type.',
  },
  marketplace: {
    summary: 'ACA marketplace (healthcare.gov or state exchange) plan.',
    covers: [
      'Same essential benefits as employer plans',
      '2026 OOP max capped at $10,600 individual / $21,200 family',
      'Premium subsidies based on household income',
    ],
    bestFor: ['Self-employed', 'Between jobs', 'Without employer coverage'],
    tradeoffs: [
      'Higher OOP than typical employer plans on lower metal tiers',
      'Pregnancy doesn\'t trigger SEP, but birth does — for adding the baby',
    ],
  },
  medicaid: {
    summary: 'State Medicaid or pregnancy-specific Medicaid program.',
    covers: [
      'Labor & delivery covered in full in nearly all states',
      'Postpartum coverage extended to 12 months in most states',
      'Well-baby and vaccine coverage',
    ],
    bestFor: [
      'Lower- and moderate-income families (eligibility varies by state)',
      'Anyone uninsured during pregnancy — apply right away; often retroactive',
    ],
    tradeoffs: [
      'Provider network can be narrower',
      'Need to re-confirm coverage after baby is born',
    ],
  },
  uninsured: {
    summary: 'No active health coverage during pregnancy or birth.',
    covers: ['Cash-pay billing; hospital financial-assistance programs may apply'],
    bestFor: ['No one as a long-term plan — explore options below'],
    tradeoffs: [
      'You almost certainly qualify for pregnancy Medicaid (higher income limits)',
      'Marketplace subsidies may make a plan cheaper than self-pay birth',
      'Ask hospital billing about charity care / financial assistance before paying',
    ],
  },
};

// =========================================================================
// Bulk buying (diaper calculator)
// =========================================================================
export const tipsBulkBuy: Record<'yes' | 'no', TipContent> = {
  yes: {
    summary: 'Buy at Costco/Sam\'s, or use subscribe-and-save on Amazon.',
    covers: [
      'Cases of 200+ diapers at warehouse-club rates',
      'Subscribe & Save 5–15% on Amazon recurring orders',
      'Often matches store-brand pricing on name brands',
    ],
    bestFor: ['Predictable use', 'Settled on a brand that fits your baby'],
    tradeoffs: [
      'Storage space needed',
      'Risk if you buy a case before knowing whether the brand fits',
    ],
    example: 'Bulk pricing typically cuts the year-one bill by 15–25%.',
  },
  no: {
    summary: 'Buy as needed at the drugstore or grocery store.',
    covers: ['Smaller packs, immediate access', 'Easy to try a different brand'],
    bestFor: ['First few weeks before you settle on a brand', 'Small spaces'],
    tradeoffs: ['Highest per-unit price'],
  },
};

// =========================================================================
// Pump covered by insurance (feeding calculator)
// =========================================================================
export const tipsPumpCovered: Record<'yes' | 'unsure' | 'no', TipContent> = {
  yes: {
    summary: 'ACA-mandated benefit — most plans cover one pump per pregnancy.',
    covers: [
      'Manual or electric pump (model varies by plan)',
      'Replacement parts schedule (every 3 months for many plans)',
      'Lactation support visits, typically 3–6 covered',
    ],
    bestFor: ['All employer plans and marketplace plans (required by ACA)'],
    tradeoffs: [
      'Plans differ on which pump models are covered — some require add-on payment for premium models',
      'Some require ordering through a specific durable medical equipment supplier',
    ],
  },
  unsure: {
    summary: 'Defaults to a moderate estimate that includes some out-of-pocket.',
    covers: ['Mid-range pump cost ($100–$250 OOP if not covered)', 'Replacement parts and storage bags'],
    bestFor: ['Pre-confirmation calculations'],
    tradeoffs: ['Call your insurer — required ACA benefit means most parents pay $0 for the basic pump'],
  },
  no: {
    summary: 'No insurance coverage — pump bought outright.',
    covers: ['Full retail pump cost ($100–$400+)'],
    bestFor: ['Uninsured parents', 'Plans grandfathered out of ACA mandates (rare)'],
    tradeoffs: ['Rental pumps may be cheaper short-term', 'Used pumps are not generally safe — motor wear and contamination concerns'],
  },
};

// =========================================================================
// Bottles & storage gear tier (feeding calculator)
// =========================================================================
export const tipsBottlesGear: Record<'minimal' | 'standard' | 'full', TipContent> = {
  minimal: {
    summary: 'A handful of bottles, basic dish soap, no extras.',
    covers: ['4–6 bottles in 1–2 sizes', 'Bottle brush', 'Drying rack'],
    bestFor: ['Mostly breastfeeding with occasional bottle', 'Tight budget'],
    tradeoffs: ['More frequent washing', 'May need to add more if returning to work'],
  },
  standard: {
    summary: 'Enough for a day\'s feedings plus a sterilizer.',
    covers: ['8–12 bottles in 2 sizes', 'Steam sterilizer', 'Bottle warmer', 'Drying rack'],
    bestFor: ['Most families, especially combo-feeding or daycare-bound'],
  },
  full: {
    summary: 'Complete setup with redundancy and convenience features.',
    covers: ['12+ bottles + multiple nipple sizes', 'Sterilizer + dryer combo unit', 'Formula prep machine', 'Pre-wash bin'],
    bestFor: ['Formula-feeding families', 'Twins / multiples'],
    tradeoffs: ['Some items (formula machine) get mixed reviews — buy after baby arrives'],
  },
};

// =========================================================================
// Lactation consultant (feeding calculator)
// =========================================================================
export const tipsLactationConsult: Record<'no' | 'yes', TipContent> = {
  no: {
    summary: 'Rely on hospital lactation help + ACA-covered visits.',
    covers: ['Hospital lactation consultant (often included in delivery stay)', '3–6 covered IBCLC visits on most insurance'],
    bestFor: ['Most families', 'Parents without specific concerns'],
  },
  yes: {
    summary: 'Plan for out-of-pocket in-home or specialty lactation visits.',
    covers: ['In-home IBCLC visit ($150–$300)', 'Specialty support (tongue-tie, low supply, premature)', 'Multiple follow-up sessions'],
    bestFor: ['Families with feeding difficulties', 'Twins or NICU graduates'],
    tradeoffs: ['Check insurance first — many plans cover IBCLC visits as ACA preventive care'],
  },
};

// =========================================================================
// Nursery setup tier (gear calculator)
// =========================================================================
export const tipsNurserySetup: Record<'minimal' | 'standard' | 'premium', TipContent> = {
  minimal: {
    summary: 'Bassinet only for the first 6 months; share parent\'s room.',
    covers: ['Bassinet or co-sleeper', 'Basic changing pad on dresser', 'Small storage'],
    bestFor: [
      'Apartment living',
      'Following AAP room-share guidance for first 6 months',
      'Budget-focused families',
    ],
    tradeoffs: ['Will need a crib eventually — plan for month-6 purchase'],
  },
  standard: {
    summary: 'Crib + dresser/changer + glider + monitor — typical nursery.',
    covers: ['Convertible crib + mattress', 'Combo dresser/changer', 'Glider or rocker', 'Video monitor'],
    bestFor: ['Most families with a dedicated nursery room'],
  },
  premium: {
    summary: 'Full nursery with designer furniture, premium monitor, and decor.',
    covers: ['Solid wood / designer crib', 'Separate dresser + changing table', 'Premium video monitor (Nanit/Owlet)', 'Curated decor'],
    bestFor: ['First-baby families with strong nursery-aesthetic priorities'],
    tradeoffs: ['Marginal safety/utility benefit over standard tier — mostly aesthetic'],
  },
};

// =========================================================================
// Newborn on separate deductible (birth insurance planner)
// =========================================================================
export const tipsNewbornOnSeparate: Record<'unsure' | 'yes' | 'no', TipContent> = {
  unsure: {
    summary: 'Defaults to a small add-on to account for partial coverage rules.',
    covers: ['Adds a modest newborn-side OOP estimate'],
    bestFor: ['Pre-call planning'],
    tradeoffs: ['Call your insurer or HR — this single answer can move your OOP by $1,000+'],
  },
  yes: {
    summary: 'Newborn has their own deductible separate from the parent\'s.',
    covers: ['Adds full newborn deductible to your planning OOP', 'Common on individual marketplace plans'],
    bestFor: ['Confirmed via insurer call or Summary of Benefits'],
    tradeoffs: ['Newborn admission to NICU under separate deductible is the biggest surprise-bill risk'],
    example: 'Typical add-on: +$800–$1,500 in expected OOP.',
  },
  no: {
    summary: 'Newborn shares the parent\'s deductible (or family deductible).',
    covers: ['No additional newborn-side OOP modeled', 'Common on employer plans'],
    bestFor: ['Most employer-sponsored family plans'],
  },
};

// =========================================================================
// Filing status (subsidy calculator)
// =========================================================================
export const tipsFiling: Record<'single' | 'hoh' | 'mfj' | 'mfs', TipContent> = {
  single: {
    summary: 'Unmarried, no qualifying dependent in your household.',
    covers: ['Single filer thresholds for CDCTC + FSA cap'],
    bestFor: ['Most single working parents without HOH-qualifying dependents'],
  },
  hoh: {
    summary: 'Head of household — unmarried but supporting a qualifying dependent.',
    covers: ['Same FSA cap and CDCTC rate thresholds as Single under §21'],
    bestFor: ['Single parents (most common HOH scenario)'],
    tradeoffs: ['Higher standard deduction than Single elsewhere on your taxes — but doesn\'t affect this calculator\'s thresholds'],
  },
  mfj: {
    summary: 'Married, filing one combined federal return with your spouse.',
    covers: ['Doubled AGI thresholds for the CDCTC rate schedule', 'Full $7,500 FSA cap'],
    bestFor: ['Most married couples — usually the lowest total tax'],
  },
  mfs: {
    summary: 'Married but filing separate returns.',
    covers: ['Single-filer AGI thresholds', 'Half FSA cap ($3,750)'],
    bestFor: [
      'Specific situations (income-driven student loans, spouse with tax issues, divorce in progress)',
    ],
    tradeoffs: [
      'Almost always results in higher total tax than MFJ',
      'Disqualifies you from several other credits — confirm with a tax pro before filing this way',
    ],
  },
};

// =========================================================================
// Delivery type
// =========================================================================
export const tipsDelivery: Record<string, TipContent> = {
  vaginal: {
    summary: 'Planned vaginal delivery — the typical scenario.',
    covers: ['Typical hospital stay: 1–2 nights', 'Most common delivery type'],
    bestFor: ['Standard low-risk pregnancies'],
    example: 'Average billed total ~$15,712; OOP ~$2,563 on employer plans (Peterson-KFF).',
  },
  csection: {
    summary: 'Cesarean delivery — surgical birth, planned or unplanned.',
    covers: [
      'Operating room, surgical team, anesthesiology',
      'Typical hospital stay: 3 nights',
      'Recovery extends to 6–8 weeks',
    ],
    bestFor: [
      'Medical indication (breech, prior C-section, complications)',
      'Maternal-request C-sections vary by insurer',
    ],
    tradeoffs: [
      'Billed total ~$10,000–$15,000 higher than vaginal',
      'After insurance, OOP gap is usually only a few hundred to ~$1,200',
    ],
    example: 'Average billed total ~$28,998; OOP ~$3,071 on employer plans (Peterson-KFF).',
  },
  unknown: {
    summary: 'Unknown delivery type — uses a blended midpoint.',
    covers: ['Average of vaginal and C-section ranges for the chosen insurance'],
    bestFor: ['Early pregnancy planning'],
  },
};
