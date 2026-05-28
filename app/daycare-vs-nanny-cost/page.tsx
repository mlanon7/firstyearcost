import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { BreadcrumbsJsonLd, ArticleJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Daycare vs. Nanny Cost — Which Is Cheaper?',
  description:
    'A practical comparison of infant daycare vs. nanny vs. nanny share costs in the U.S. — what each typically costs, where each option wins, and how to decide.',
  path: '/daycare-vs-nanny-cost',
  type: 'article',
});

const faq: FAQItem[] = [
  {
    q: 'Is a nanny cheaper than daycare?',
    a: "Almost never for a single child. A full-time nanny in most U.S. states runs $35,000–$60,000+ per year, while center daycare for an infant typically runs $9,000–$24,000. Nannies become competitive only with two or more children, or in nanny-share arrangements.",
  },
  {
    q: 'When does a nanny become cost-effective?',
    a: 'Usually with two children. The marginal cost of a second child with a nanny is small (some food and supplies), while a second child in daycare adds another full tuition. With twins or two close-in-age siblings, a nanny can be cheaper than two daycare slots.',
  },
  {
    q: 'How does a nanny share work?',
    a: 'Two families hire one nanny together, usually rotating between homes or using one home as the base. Each family pays roughly half the nanny rate plus a small premium (often 10–25%) over solo full-time daycare. It captures most of the convenience of having a nanny at near-daycare cost.',
  },
  {
    q: 'What about taxes and benefits with a nanny?',
    a: 'Hiring a nanny means you become an employer. You owe employer payroll taxes (Social Security, Medicare, unemployment), and may need to provide benefits depending on state. Most families use a payroll service to handle this — budget $40–$100/month for the service. We do not factor employer taxes into our nanny estimates; add roughly 10–12% for full burden.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="Daycare vs. Nanny Cost — Which Is Cheaper?"
        description="A practical comparison of infant daycare, nanny share, and nanny costs in the U.S."
        url="https://firstyearcost.com/daycare-vs-nanny-cost"
        dateModified={reviewDateFor('/daycare-vs-nanny-cost')}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Daycare vs. nanny cost', url: 'https://firstyearcost.com/daycare-vs-nanny-cost' },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare', url: 'https://firstyearcost.com/childcare-calculator' },
          { name: 'Daycare vs. nanny', url: 'https://firstyearcost.com/daycare-vs-nanny-cost' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Care comparison</p>
            <h1 className="h1 text-ink-900">Daycare vs. nanny vs. nanny share — which is cheaper?</h1>
            <p className="lede mt-4">
              For one infant, daycare is almost always cheaper. With two children or a nanny share, the math shifts.
              Here's a clear breakdown.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>Typical 2026 ranges</h2>
          <ul>
            <li><strong>Center daycare</strong> (infant): $9,000–$24,000/year, depending on state.</li>
            <li><strong>Family home daycare</strong>: 15–25% cheaper than center, with smaller groups.</li>
            <li><strong>Nanny share</strong> (between two families): $20,000–$32,000/year per family.</li>
            <li><strong>Full-time nanny</strong>: $35,000–$60,000+/year, plus employer taxes.</li>
            <li><strong>Part-time daycare</strong> (3 days/week): typically 60–70% of full-time price.</li>
          </ul>

          <h2>Where each option wins</h2>
          <h3>Center daycare wins on</h3>
          <ul>
            <li>Cost — typically the cheapest option for one child.</li>
            <li>Reliability — backup caregivers if one teacher is sick.</li>
            <li>Socialization — group setting from an early age.</li>
            <li>Predictable hours, predictable price.</li>
          </ul>
          <h3>Home daycare wins on</h3>
          <ul>
            <li>Smaller group, often a single primary caregiver.</li>
            <li>Often more flexible hours than a center.</li>
            <li>Mid-range price — cheaper than center, more nurturing-feeling for some families.</li>
          </ul>
          <h3>Nanny wins on</h3>
          <ul>
            <li>One-on-one attention, especially for infants.</li>
            <li>No sick-day catastrophe — kids stay home, nanny still works.</li>
            <li>Help with light household tasks (per agreed scope).</li>
            <li>Cost-effective with multiple children.</li>
          </ul>
          <h3>Nanny share wins on</h3>
          <ul>
            <li>Most of the nanny benefits at near-daycare cost.</li>
            <li>Built-in playmate for the kids.</li>
            <li>Some flexibility on location / hours, by agreement.</li>
          </ul>

          <h2>The hidden costs to factor in</h2>
          <ul>
            <li><strong>Daycare:</strong> Registration ($75–$300), supply fees, holiday closures you still owe tuition for, summer rate jumps.</li>
            <li><strong>Nanny:</strong> Employer payroll taxes (10–12% on top), payroll service ($40–$100/month), guaranteed hours, paid time off, holidays, raises.</li>
            <li><strong>Nanny share:</strong> Same as nanny, split between families, plus the cost of formalizing the arrangement (often a written agreement).</li>
          </ul>

          <h2>Decision framework</h2>
          <p>
            For most families with one infant on a typical budget, center or home daycare is the right starting point.
            Reconsider if any of these apply to you: you have or expect twins, you have a child under 2 already, your
            schedule is non-standard (early shifts, late shifts, frequent travel), or you have a strong friend with a
            similar-age baby who'd share a nanny.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/childcare-calculator" className="btn btn-accent inline-flex">
            Run the childcare calculator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/state-childcare-costs" className="btn btn-ghost inline-flex">
            Compare your state
          </Link>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6 max-w-3xl">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
