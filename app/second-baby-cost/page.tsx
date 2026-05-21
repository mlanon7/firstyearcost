import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { Disclaimer } from '@/components/Disclaimer';
import { BreadcrumbsJsonLd, ArticleJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';

const URL = 'https://firstyearcost.com/second-baby-cost';

export const metadata: Metadata = {
  title: 'How Much Does a Second Baby Cost? (2026 First-Year Breakdown)',
  description:
    'A practical breakdown of what a second baby actually adds to your budget. Where the savings come from (gear, clothing), where the costs stay the same (childcare, formula, medical), and how to model it.',
  alternates: { canonical: '/second-baby-cost' },
  openGraph: {
    title: 'How Much Does a Second Baby Cost? (2026 First-Year Breakdown)',
    description:
      'What changes — and what doesn\'t — when you add a second baby. Gear, childcare, feeding, medical, and tax-credit effects.',
    url: '/second-baby-cost',
    type: 'article',
  },
};

const faq: FAQItem[] = [
  {
    q: 'Is the second baby really cheaper?',
    a: 'Yes — but less than most people expect. Gear, clothing, and nursery setup mostly carry over. Childcare, feeding, diapers, and medical bills do not. Most families save 35–55% on year-one setup costs versus baby #1 but spend roughly the same on the recurring categories.',
  },
  {
    q: 'What carries over from the first baby?',
    a: 'Crib, dresser, changing pad, stroller (if compatible with two), baby monitor, carriers, bottles, pump (replace parts/tubing), most clothes (subject to season swap and safety expiration), bath gear, books, toys. Total carryover value is typically $1,500–$3,500 for a budget-to-standard first baby.',
  },
  {
    q: 'What should you buy new for the second baby?',
    a: 'Car seats older than the manufacturer expiration (typically 6–10 years from manufacture) or that have been in a crash. Bottle nipples (rubber breaks down). Pump parts and tubing. Crib mattress if visibly worn or the crib pre-dates 2011 safety standards. A second carrier or stroller seat if the kids will overlap in age. Anything sleep-related you have doubts about.',
  },
  {
    q: 'Does childcare get cheaper with two?',
    a: 'Most centers offer a sibling discount (typically 5–15%) on the older child\'s tuition. The infant slot is full price. Nannies become more cost-effective with two — the marginal cost of a second child is small compared to a second daycare tuition. Nanny shares become harder to coordinate with two kids.',
  },
  {
    q: 'Do I qualify for more tax credits with a second baby?',
    a: 'Yes. The federal Child & Dependent Care Tax Credit qualifying-expense cap jumps from $3,000 to $6,000 when you have two or more children under 13 in care. The Child Tax Credit applies per child. With two kids in paid care, the federal CDCTC alone can be worth ~$1,200/year instead of the $600 cap for one child.',
  },
  {
    q: 'How do I plan the cash flow for two?',
    a: 'Childcare and formula are the two biggest recurring shocks. If both kids are in daycare, the bill can double or more. Most families either (1) move to a nanny (becomes cost-competitive with two daycare tuitions), (2) overlap parental leave to delay daycare start for the new baby, or (3) move one parent to part-time. Plan three scenarios before the birth.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="How Much Does a Second Baby Cost?"
        description="A practical 2026 breakdown of what a second baby adds to your budget in the first year."
        url={URL}
        dateModified={reviewDateFor('/second-baby-cost')}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Second baby cost', url: URL },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Second baby cost', url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Second baby planning</p>
            <h1 className="h1 text-ink-900">
              How much does a second baby actually cost?
            </h1>
            <p className="lede mt-4">
              Less than the first, but not by half. Here's what changes,
              what doesn't, and how to model it before the second one
              arrives.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#calculator" className="btn btn-accent">
                Run the full calculator <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/childcare-subsidy-calculator" className="btn btn-ghost">
                Estimate tax credits for two
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10 max-w-3xl">
        <div className="card p-6">
          <h2 className="h4 text-ink-900 mb-3">Typical year-one delta for a second baby (planning estimate)</h2>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="text-left py-2 pr-3">Category</th>
                  <th className="text-right py-2 px-3">Baby #1</th>
                  <th className="text-right py-2 px-3">Baby #2</th>
                  <th className="text-right py-2 pl-3">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 tabular-nums">
                <Row name="Gear & nursery (one-time)" first="$1,500–$3,800" second="$300–$900" delta="−70%" />
                <Row name="Clothes (first year)" first="$400–$900" second="$120–$300" delta="−65%" />
                <Row name="Diapers & wipes" first="$700–$1,100" second="$700–$1,100" delta="≈ same" />
                <Row name="Feeding (formula or supplies)" first="$600–$2,400" second="$600–$2,400" delta="≈ same" />
                <Row name="Childcare (infant slot)" first="full" second="full (sibling discount on older)" delta="+full slot, −5–15% on sibling" />
                <Row name="Medical / birth OOP" first="planning range" second="similar range" delta="≈ same" />
                <Row name="Misc monthly" first="$100–$250/mo" second="$100–$250/mo" delta="≈ same" />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-500 mt-3">
            Estimates assume gear is in good condition and within safety
            expiration. Sibling discounts vary by provider.
          </p>
        </div>
      </section>

      <div className="container-pg my-4">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>Where the savings actually come from</h2>
          <p>
            The "second baby is cheaper" advice usually comes from one-time
            setup costs: the nursery is set up, the stroller and car seat
            base are already in the closet, the breast pump is paid for, the
            wardrobe has 0–12 month rotation. For a typical "standard tier"
            first baby, you can carry over $1,500–$3,500 of gear value.
          </p>
          <p>
            The savings are real but bounded. The categories that scale
            linearly with the number of children — diapers, formula, food, childcare,
            medical, clothing for size-up — do not get cheaper. They roughly
            double on a per-child basis. The total first-year cost for baby
            #2 typically runs <strong>55–75% of baby #1</strong>, not 50%.
          </p>

          <h2>Where the real budget shock hits</h2>
          <h3>1. Childcare for two</h3>
          <p>
            If both children are in paid care, this is the single biggest
            change. An infant slot plus a toddler slot at center daycare in
            most metros runs $25,000–$45,000+. Many families hit the breaking
            point here and switch to a nanny, which becomes cost-competitive
            with two daycare tuitions and offers more flexibility.
          </p>
          <p>
            <Link href="/daycare-vs-nanny-cost">Daycare vs. nanny cost</Link> dives
            into the math.
          </p>
          <h3>2. Health insurance and birth OOP</h3>
          <p>
            Adding a second child to family coverage typically doesn't
            increase premium (most plans price as "family"), but the deductible
            resets each plan year and you'll re-pay the birth + newborn OOP.
            See the <Link href="/birth-insurance-planner">birth & insurance
            planner</Link> for ranges.
          </p>
          <h3>3. Housing pressure</h3>
          <p>
            Two kids often forces a bedroom decision: shared room, move, or
            re-configure. We don't model the housing change because it
            varies wildly by market, but it's the silent biggest line item for
            many families considering #2.
          </p>

          <h2>Where the tax code helps</h2>
          <ul>
            <li>
              <strong>CDCTC qualifying expenses double:</strong> from $3,000
              to $6,000 with two kids in paid care. Under the 2026 OBBBA-revised
              rate schedule, a middle-income family in the 35% credit band gets
              an extra $1,050/year vs. one child; in the 20% floor band, $600.
            </li>
            <li>
              <strong>Child Tax Credit is per child:</strong> $2,000 federal
              for each qualifying child under 17 (subject to phase-out).
            </li>
            <li>
              <strong>FSA cap is per household, not per child:</strong> The 2026
              dependent-care FSA cap is $7,500 (single/HOH/MFJ) or $3,750 (MFS),
              raised from $5,000/$2,500 under OBBBA. With two kids you still get
              one bite at the FSA — but the bite is now 50% bigger.
            </li>
            <li>
              <strong>Sibling discounts:</strong> 5–15% off the older child's
              daycare tuition at most centers. Ask explicitly — it's not
              always advertised.
            </li>
          </ul>

          <h2>How to model it before the birth</h2>
          <ol>
            <li>Run the main calculator twice — once with "First baby" off, once with it on. Compare gear and clothing totals.</li>
            <li>Run the <Link href="/childcare-calculator">childcare calculator</Link> with two kids in care; check if the total exceeds nanny cost in your state.</li>
            <li>Run the <Link href="/childcare-subsidy-calculator">tax credit estimator</Link> with kids=2 to see the increased qualifying base.</li>
            <li>Use the <Link href="/birth-insurance-planner">birth planner</Link> to budget the medical bill (don't assume it's "the same as last time" — plan years reset).</li>
          </ol>
        </div>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </section>

      <section className="container-pg pb-16 max-w-3xl">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}

function Row({ name, first, second, delta }: { name: string; first: string; second: string; delta: string }) {
  return (
    <tr>
      <td className="py-2 pr-3 font-medium text-ink-900">{name}</td>
      <td className="py-2 px-3 text-right text-ink-700">{first}</td>
      <td className="py-2 px-3 text-right text-ink-700">{second}</td>
      <td className="py-2 pl-3 text-right text-teal-700 font-semibold">{delta}</td>
    </tr>
  );
}
