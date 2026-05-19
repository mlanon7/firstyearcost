import type { Metadata } from 'next';
import { DiaperCalculator } from '@/components/DiaperCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Diaper Cost Calculator — Disposable vs. Cloth First-Year Cost',
  description:
    'Estimate first-year diaper and wipes cost by brand tier and disposable vs. cloth. Includes month-by-month usage and bulk-buy effect.',
  alternates: { canonical: '/diaper-calculator' },
  openGraph: {
    title: 'Diaper Cost Calculator — Disposable vs. Cloth First-Year Cost',
    description:
      'Estimate first-year diaper and wipes cost by brand tier and disposable vs. cloth — month-by-month.',
    url: '/diaper-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diaper Cost Calculator — Disposable vs. Cloth',
    description:
      'First-year diaper and wipes cost by brand tier — disposable vs. cloth, month-by-month.',
  },
};

const faq: FAQItem[] = [
  {
    q: 'How many diapers does a baby use in the first year?',
    a: 'Most babies use about 2,500–3,000 disposable diapers in their first 12 months. Newborns typically need 10–12 changes a day, dropping to 5–7 by month 12. Our table above breaks it down by month.',
  },
  {
    q: 'Are store-brand diapers worse?',
    a: "Store-brand diapers from Costco's Kirkland, Target's Up & Up, and Amazon's Mama Bear consistently rank well in independent reviews and are usually 30–50% cheaper per diaper than name brands. Many parents mix: name brand at night, store brand during the day.",
  },
  {
    q: 'Is cloth diapering actually cheaper?',
    a: 'Cloth is usually cheaper over a single year, especially if you stay with the same baby for 18–24 months and reuse for a sibling. The catch is the upfront cost ($350–$1,000 for a usable stash) plus more laundry. If you have access to a diaper service, factor that subscription in instead.',
  },
  {
    q: 'How much do wipes add to the bill?',
    a: 'Wipes typically add $15–$30/month for mainstream brands. Buying flushable-style or fragrance-free premium wipes can push that to $40+/month. Most families do fine with mainstream wipes from a warehouse club.',
  },
  {
    q: 'Should I stock up on size 1 before birth?',
    a: 'Maybe one pack. Babies vary a lot — some skip newborn size entirely, others stay in it for weeks. A safe stockpile: one box of size N, one of size 1, then size up as needed.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Diaper calculator', url: 'https://firstyearcost.com/diaper-calculator' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-coral mb-3">Specialized calculator</p>
            <h1 className="h1 text-ink-900">Diaper & wipes cost calculator</h1>
            <p className="lede mt-4">
              Disposable vs. cloth, brand tier, bulk-buy effect — and a month-by-month
              usage breakdown so you don't over-stockpile size 1.
            </p>
          </div>
        </div>
      </section>

      <div className="container-pg pb-10">
        <DiaperCalculator />
      </div>

      <div className="container-pg my-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="Practical advice" eyebrow="Diapering" />
        <div className="prose-custom mt-6 max-w-3xl">
          <h3>Buy small first, bulk later</h3>
          <p>
            Newborns can fluctuate 1–2 pounds in the first weeks, which sometimes means jumping size faster than expected.
            One box of newborn diapers and one box of size 1 is enough to start. Buy bulk only after you know what fits.
          </p>
          <h3>Subscription savings vs. warehouse clubs</h3>
          <p>
            Subscribe & save services on disposable diapers typically save 5–15% off list price. Costco and Sam's Club
            box prices on store brands are often even cheaper on a per-diaper basis. The cheapest combo is usually
            store-brand diapers from a warehouse club, with subscription wipes for convenience.
          </p>
          <h3>Cloth diapering: upfront vs. recurring</h3>
          <p>
            A usable cloth diaper stash runs $350–$1,000. After that, you're paying for detergent, water, electricity,
            and a few replacement covers. The savings really show up in year two — and in much larger savings if you
            reuse the same stash for a second baby.
          </p>
          <h3>Don't over-buy wipes either</h3>
          <p>
            Wipes do not "expire" the way some other baby products do, but unopened tubs can dry out over time. A
            month or two of supply at a time is usually plenty.
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
