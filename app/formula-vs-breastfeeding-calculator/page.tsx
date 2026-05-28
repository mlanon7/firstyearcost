import type { Metadata } from 'next';
import { FeedingCalculator } from '@/components/FeedingCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Formula vs. Breastfeeding Cost Calculator',
  description:
    "Estimate first-year feeding cost — formula, breastfeeding, or combo — including pump, bottles, and lactation support. Free, source-backed, no medical advice.",
  path: '/formula-vs-breastfeeding-calculator',
});

const faq: FAQItem[] = [
  {
    q: 'How much does formula cost per month?',
    a: 'Standard powder formula typically runs $150–$320 per month at 25–30 oz/day in the early months, tapering as solids start. Sensitive formulas are 30–50% more, hypoallergenic formulas can be 2–3× standard, and ready-to-feed is the most expensive on a per-ounce basis.',
  },
  {
    q: 'Is breastfeeding really free?',
    a: 'Not entirely. There are real upfront and recurring costs — bottles, storage bags, pump parts replacement, nursing bras and pads, and sometimes a lactation consultant. Most insurers cover one breast pump per pregnancy, which is the largest single line item. Plan for $150–$1,300 over the first year, depending on choices and insurance.',
  },
  {
    q: 'Does my insurance cover a breast pump?',
    a: 'Under the Affordable Care Act, most U.S. private insurance plans must cover the cost of a breast pump and breastfeeding support for the duration of breastfeeding (see HealthCare.gov\'s "Breastfeeding benefits" page). Coverage details vary — call your insurer to confirm what type (manual, electric, hospital-grade) is covered and from which suppliers.',
  },
  {
    q: 'How much does combo feeding cost?',
    a: "Combo feeding (breastmilk plus formula) typically lands between the two — the formula portion is roughly 40–60% of full-formula cost, plus most of the breastfeeding supplies you'd need anyway. Many families end up here, especially after returning to work.",
  },
  {
    q: 'When does formula cost go down?',
    a: 'Most babies start solid foods around 4–6 months and gradually rely less on milk. Formula consumption usually peaks around month 2–4 and gradually decreases through the second half of the year. Total formula cost is usually higher in the first six months than the second six months.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Feeding cost calculator', url: 'https://firstyearcost.com/formula-vs-breastfeeding-calculator' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-sun mb-3">Specialized calculator</p>
            <h1 className="h1 text-ink-900">Formula vs. breastfeeding cost calculator</h1>
            <p className="lede mt-4">
              Estimate first-year feeding cost — formula, breastfeeding, or combo — with realistic
              pump, bottle, and lactation support ranges.
            </p>
          </div>
        </div>
      </section>

      <div className="container-pg pb-10">
        <FeedingCalculator />
      </div>

      <div className="container-pg my-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="Cost comparison context" eyebrow="Feeding" />
        <div className="prose-custom mt-6 max-w-3xl">
          <h3>Why specialty formula is more expensive</h3>
          <p>
            Hypoallergenic and amino acid–based formulas are designed for babies with milk protein
            allergies or severe sensitivities. They're significantly more expensive because the proteins
            are pre-digested or synthetically produced. Many insurance plans, Medicaid, and WIC programs
            cover specialty formula when prescribed by a pediatrician — ask about coverage before paying retail.
          </p>
          <h3>The pump-coverage rule of thumb</h3>
          <p>
            Most U.S. private insurance plans cover one breast pump per pregnancy. Hospital-grade pumps
            (heaviest-duty, often used by parents with NICU babies) are usually rentals; standard double
            electric pumps are usually take-home. Verify the model and supplier list with your insurer
            before delivery so the pump is ready when you need it.
          </p>
          <h3>What this calculator does not include</h3>
          <p>
            Lost-income costs from breastfeeding-related work breaks, paid lactation leave, or specific
            return-to-work pumping setups are not modeled here. Those vary too much by employer and state.
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
