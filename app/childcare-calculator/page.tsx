import type { Metadata } from 'next';
import { ChildcareCalculator } from '@/components/ChildcareCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Childcare Cost Calculator — Daycare & Nanny',
  description:
    'Estimate infant childcare costs by state and care type — daycare, home daycare, nanny, nanny share, or part-time. Source-backed.',
  path: '/childcare-calculator',
});

const faq: FAQItem[] = [
  {
    q: 'Which is cheaper — daycare or a nanny?',
    a: 'For most U.S. families, a center or home daycare is significantly cheaper than a full-time nanny. A nanny share with one other family typically lands between the two — often comparable to a high-end daycare in your state. Use the comparison table for your state above.',
  },
  {
    q: 'How much of my income should childcare be?',
    a: 'There is no official rule for all families. The U.S. Department of Health and Human Services has used 7% of household income as an "affordable" benchmark, but that benchmark is set in the Child Care and Development Fund rule and applies specifically to copayments for low-income families receiving subsidies — it is not a recommended cap for unsubsidized care. In practice, many U.S. families pay 10%–20% of pre-tax income for infant care, especially in higher-cost states. Use the 7% figure as directional, not a target.',
  },
  {
    q: 'Why is infant care more expensive than toddler care?',
    a: 'Most states require a lower staff-to-child ratio for infants (often 1:3 or 1:4) than for toddlers and preschoolers, plus more diapering, feeding, and one-on-one time. That higher staffing requirement is the single biggest reason infant care is the priciest year of childcare.',
  },
  {
    q: 'When should I get on the waitlist?',
    a: 'In high-demand metros, parents often join infant waitlists at the start of pregnancy or even before conception. In lower-demand areas, 2–4 months ahead is usually fine. Ask each provider directly — they can usually tell you their average wait.',
  },
  {
    q: 'Are there tax credits or FSAs that reduce childcare cost?',
    a: 'Yes. The federal Child and Dependent Care Tax Credit and an employer Dependent Care FSA can both reduce the effective cost of paid childcare. Eligibility and amounts vary — talk to a tax professional or your HR benefits team.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare calculator', url: 'https://firstyearcost.com/childcare-calculator' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Specialized calculator</p>
            <h1 className="h1 text-ink-900">Infant childcare cost calculator</h1>
            <p className="lede mt-4">
              Compare center daycare, home daycare, nanny, nanny share, and part-time care
              in your state — by hours per week and months needed.
            </p>
          </div>
        </div>
      </section>

      <div className="container-pg pb-10">
        <ChildcareCalculator />
      </div>

      <div className="container-pg my-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="What drives childcare cost?" eyebrow="Cost drivers" />
        <div className="prose-custom mt-6 max-w-3xl">
          <p>
            Three factors decide most of your infant childcare bill: <strong>state</strong>, <strong>care type</strong>,
            and <strong>hours per week</strong>. After that, smaller factors — registration fees, supply fees, sibling
            discounts, and whether the provider operates 5 days or 4 — adjust the number a few percent in either direction.
          </p>
          <h3>State and metro</h3>
          <p>
            Massachusetts, California, New York, Washington, and the District of Columbia consistently rank among the
            most expensive states for infant care, with center costs commonly above $20,000/year. Mississippi, Alabama,
            Arkansas, and Louisiana are typically the lowest. Your specific metro can move the number
            significantly inside a state.
          </p>
          <h3>Center vs. home daycare vs. nanny</h3>
          <p>
            Family childcare homes — small operations run out of a licensed home — are usually 15–25% cheaper than
            center-based care, with smaller groups but less backup coverage. Nannies cost more upfront but include
            one-on-one care and household flexibility. A nanny share splits the cost roughly in half between two families
            and is often the sweet spot for parents who want nanny-style care at near-daycare cost.
          </p>
          <h3>Hours per week</h3>
          <p>
            Most centers price as full-time (40+ hours), part-time 3-day, or part-time 2-day. Going from 5 days to 3 days
            does not always cut your bill by 40% — many centers price 3-day care at 65–75% of full-time. Ask before assuming.
          </p>
          <h3>Registration, supply, and holiday fees</h3>
          <p>
            Registration fees ($75–$300) and annual supply fees ($25–$150) are common. Some centers also charge for holidays
            they're closed but you still owe tuition. Always read the contract.
          </p>
        </div>
      </section>

      <section className="container-pg pb-16">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6 max-w-3xl">
          <FAQ items={faq} />
        </div>
      </section>

      <NextStepCTA />
    </>
  );
}
