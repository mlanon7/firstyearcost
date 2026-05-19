import type { FAQItem } from '@/components/FAQ';

export const faqHome: FAQItem[] = [
  {
    q: 'How much does a baby actually cost in the first year?',
    a: 'Most U.S. families plan for somewhere between roughly $15,000 and $30,000 in the first year, depending heavily on whether they pay for childcare. Without paid childcare, the range often drops to about $7,000 to $14,000 in direct baby costs. Daycare alone can be $9,000 to $24,000 a year for an infant in many states. Use the calculator above for a number tied to your state, insurance, and choices.',
  },
  {
    q: 'Why are your numbers different from what I see on other sites?',
    a: 'Most "average" baby cost figures bundle very different families together — some with daycare, some without; some with high-deductible plans, some with Medicaid; some buying premium gear new, some receiving hand-me-downs. We model those choices separately so you see your range, not the national average.',
  },
  {
    q: 'Where do your assumptions come from?',
    a: 'Childcare ranges follow Child Care Aware of America\'s 2024 Price of Care Landscape and state market-rate surveys. Birth out-of-pocket ranges use the Kaiser Family Foundation\'s August 2024 analysis (~$2,854 average OOP for women with employer coverage who give birth) plus the Peterson-KFF Health System Tracker for vaginal vs. C-section detail. Well-baby and pediatric assumptions follow the AAP Bright Futures schedule and the AAP\'s 2022 safe-sleep policy. Diaper, formula, and gear costs come from current retail snapshots. Each block is dated and sourced — see the methodology page.',
  },
  {
    q: 'Do you give medical or financial advice?',
    a: 'No. This is a planning tool. We do not give feeding advice, medical advice, or specific insurance guidance. For feeding decisions, talk with your pediatrician. For benefit specifics, call your insurer or HR.',
  },
  {
    q: 'Is FirstYearCost free? Do I need to sign up?',
    a: 'Yes, completely free. No account, no email required, no gated calculator. We may show ads or affiliate links to keep the site free, and we will always disclose them clearly.',
  },
  {
    q: 'How is childcare cost calculated by state?',
    a: 'We start with state market rate surveys and Child Care Aware of America methodology to estimate annual infant care costs for center-based care, family childcare homes, and nanny arrangements. We then prorate by the number of months you actually plan to use paid care and adjust for the care type you select.',
  },
  {
    q: 'Why is the medical out-of-pocket range so wide?',
    a: 'Because it really is that variable. Two parents at the same hospital with the same delivery can pay very different amounts based on deductible, coinsurance, in/out of network status, and whether the newborn is added to their own deductible. Our range reflects that real-world spread — call your insurer for a closer number.',
  },
  {
    q: 'Does the calculator handle Medicaid?',
    a: 'Yes. If you select Medicaid for insurance, birth and newborn out-of-pocket ranges drop to near zero, which matches typical Medicaid coverage. If you are unsure whether you qualify, check healthcare.gov or your state Medicaid office before assuming uninsured costs.',
  },
  {
    q: 'How accurate is the gear estimate if I expect a lot of gifts?',
    a: 'Set "registry / shower help" to high — that reduces the gear out-of-pocket by a typical coverage percentage based on registry data. The calculator also lets you mark used / hand-me-down OK, which lowers gear by an additional factor.',
  },
  {
    q: 'Why do you include cloth diaper costs but not detergent for everything?',
    a: 'Cloth diapering has a meaningful upfront cost and a real recurring water/electricity/detergent cost that disposables do not. We capture those. Generic household items used by everyone are not double-counted as baby costs.',
  },
];
