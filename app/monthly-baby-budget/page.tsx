import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { BreadcrumbsJsonLd, ArticleJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Month-by-Month Baby Budget — What to Expect Each Month',
  description:
    "A realistic month-by-month baby budget for the first year — birth, hospital bill, gear, daycare ramp-up, feeding, and how cumulative cost stacks up.",
  path: '/monthly-baby-budget',
  type: 'article',
});

const months = [
  { m: 'Month 1',  hd: 'Birth, hospital bill, the gear surge', body: "The biggest single month. Most families pay 70%+ of one-time gear, the bulk of the birth bill, plus 11+ diapers/day and any newborn formula. Plan for $3,000–$8,000 if you're on an employer plan — much higher uninsured." },
  { m: 'Month 2',  hd: 'Settling in', body: "Recurring costs dominate now: diapers, feeding, misc. Some last gear arrives (bottles, swaddles). Pediatrician copays for well-baby visits start hitting deductibles." },
  { m: 'Month 3',  hd: 'Childcare prep month', body: "Many parents start touring daycares or interviewing nannies. Registration fees, deposits, and supply fees show up. Budget $200–$1,000 in one-time childcare onboarding costs." },
  { m: 'Month 4',  hd: 'Daycare often starts', body: "A massive jump in monthly spending if paid childcare begins now. Plan for monthly tuition to be the single largest line item from this point on." },
  { m: 'Month 5',  hd: 'Steady state begins', body: "Diaper, feeding, and childcare costs become predictable. Misc costs around classes, swim, or photos may pick up." },
  { m: 'Month 6',  hd: 'Solids start', body: "Babies typically begin solids at 4–6 months. High chair, bibs, and a small grocery line item appear. Formula consumption may start to drop slightly." },
  { m: 'Month 7',  hd: 'Sized-up clothes', body: "Babies grow out of newborn and 0–3 sizes by now. Plan a small clothing refresh or rely on hand-me-downs." },
  { m: 'Month 8',  hd: 'Mobile baby gear', body: "Crawling brings new costs: outlet covers, baby gates, cabinet locks. Budget $50–$200 for childproofing." },
  { m: 'Month 9',  hd: 'Mid-year doctor visits', body: "Standard well-baby and vaccine visits continue. Sick visits become more common as immune system develops." },
  { m: 'Month 10', hd: 'Decreased formula', body: "Babies eating more solids reduces formula or breastfeeding intensity. If on formula, expect a small monthly cost decline." },
  { m: 'Month 11', hd: 'Quiet month', body: "Few new costs. A good time to review your registry coverage and finalize gear before the first birthday rush." },
  { m: 'Month 12', hd: 'First birthday + transition', body: "Many families celebrate the first birthday, transition out of formula or breastfeeding, and look at toddler-tier childcare. Toddler care is usually 10–20% cheaper than infant care." },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        title="Month-by-Month Baby Budget"
        description="A realistic month-by-month baby budget for the first year — birth, gear, daycare ramp-up, feeding, and cumulative cost."
        url="https://firstyearcost.com/monthly-baby-budget"
        dateModified={reviewDateFor('/monthly-baby-budget')}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Monthly baby budget', url: 'https://firstyearcost.com/monthly-baby-budget' },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Monthly baby budget', url: 'https://firstyearcost.com/monthly-baby-budget' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Planning guide</p>
            <h1 className="h1 text-ink-900">Month-by-month baby budget</h1>
            <p className="lede mt-4">
              Where the first-year money actually goes — by month. Use this to plan cash flow,
              not just totals.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map((m) => (
            <div key={m.m} className="card p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-teal-700 font-semibold">
                <Calendar className="w-3.5 h-3.5" /> {m.m}
              </div>
              <h3 className="mt-2 h4 text-ink-900">{m.hd}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16 max-w-3xl">
        <SectionHeader title="Three planning principles" eyebrow="Cash flow" />
        <div className="prose-custom mt-6">
          <h3>Front-load month 1, then breathe</h3>
          <p>
            The first month carries the biggest hit by a wide margin: birth bills, gear, registry gaps, hospital
            parking, and possibly an extra week of unpaid leave. Save aggressively in late pregnancy specifically
            for that month. After month 1, most families settle into a predictable monthly rhythm.
          </p>
          <h3>Treat childcare as a separate budget line</h3>
          <p>
            Whether daycare starts in month 3 or month 6, it will dominate every monthly budget after that.
            Build it into your post-leave income plan separately — don't average it across the year.
          </p>
          <h3>Don't overbuy in month 0</h3>
          <p>
            A surprising amount of "must-have" gear can wait. Babies vary a lot, and what works for one family
            may not work for yours. Wait, then buy what you actually need.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/" className="btn btn-accent inline-flex">
            Run your full first-year estimate <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
