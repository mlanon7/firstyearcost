import type { Metadata } from 'next';
import { sourceNotes } from '@/data/sourceNotes';
import { SectionHeader } from '@/components/SectionHeader';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd, DatasetJsonLd } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Methodology & Sources',
  description:
    'How FirstYearCost.com builds its baby cost estimates — sources, methodology, last-reviewed dates, and what the calculator does and does not do.',
  alternates: { canonical: '/methodology' },
  openGraph: {
    title: 'Methodology & Sources — FirstYearCost',
    description:
      'How we build our baby cost estimates — sources, methodology, and last-reviewed dates.',
    url: '/methodology',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Methodology & Sources',
    description:
      'How FirstYearCost.com builds its baby cost estimates.',
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Methodology', url: 'https://firstyearcost.com/methodology' },
        ]}
      />
      <DatasetJsonLd
        name="FirstYearCost Baby Cost Assumption Tables"
        description="Source-cited baby cost data tables underlying FirstYearCost calculators: diaper usage by month, formula cost tiers, gear pricing, state childcare ranges, birth out-of-pocket ranges, and state paid family leave."
        url="https://firstyearcost.com/methodology"
        keywords={['baby cost', 'first year baby', 'childcare cost', 'diaper cost', 'formula cost', 'birth cost', 'paid family leave']}
        distributions={[
          { name: 'State childcare costs (CSV)', contentUrl: 'https://firstyearcost.com/data/state_childcare.csv' },
          { name: 'State paid leave (CSV)', contentUrl: 'https://firstyearcost.com/data/state_leave.csv' },
          { name: 'Diaper usage by month (CSV)', contentUrl: 'https://firstyearcost.com/data/diaper_usage_by_month.csv' },
          { name: 'Formula cost per month (CSV)', contentUrl: 'https://firstyearcost.com/data/formula_cost_per_month.csv' },
          { name: 'Gear costs & metadata (CSV)', contentUrl: 'https://firstyearcost.com/data/gear.csv' },
          { name: 'Birth OOP ranges (CSV)', contentUrl: 'https://firstyearcost.com/data/birth_oop_ranges.csv' },
          { name: 'Newborn medical OOP (CSV)', contentUrl: 'https://firstyearcost.com/data/newborn_medical_oop.csv' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">How we build estimates</p>
            <h1 className="h1 text-ink-900">Methodology & sources</h1>
            <p className="lede mt-4">
              Each data table on this site is backed by a named source, last-reviewed
              date, and adjustment notes — and every CSV is downloadable below. Provenance
              is recorded at the category level (one source per table) for tables where
              all rows share a single underlying study, and at the row level for tables
              where rows come from different sources.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-12 max-w-3xl">
        <SectionHeader title="What we estimate, and how" />
        <div className="prose-custom mt-6">
          <h3>Childcare</h3>
          <p>
            State-level annual cost ranges are derived from Child Care Aware of America methodology and state market
            rate surveys. We split each state into typical infant ranges for center-based care, family child care
            homes, and full-time nannies. Nanny share, part-time, and family help are derived from these baselines.
            We then prorate by the number of months you select and adjust for hours per week.
          </p>
          <h3>Birth & newborn medical</h3>
          <p>
            Out-of-pocket planning ranges are based on Peterson-KFF Health System Tracker data on the average
            employer-plan, marketplace, Medicaid, and uninsured experience for pregnancy, childbirth, and postpartum
            care, plus newborn medical spending in the first three months. We do not predict your specific bill —
            we provide a planning range and a list of questions to ask your insurer and hospital.
          </p>
          <h3>Diapers & wipes</h3>
          <p>
            Monthly diaper usage tapers from 10–12 changes per day at birth to about 5 by month 12, consistent with
            AAP guidance and parent surveys. Per-diaper costs are sampled across budget store brands, mainstream
            (Pampers/Huggies), and premium (Honest, Coterie, Hello Bello) at major U.S. retailers — last reviewed
            Q1 2026. Cloth diapering includes upfront stash cost and a monthly washing/electricity range.
          </p>
          <h3>Feeding</h3>
          <p>
            Standard powder formula assumes typical infant intake (around 25–30 oz/day in early months) at
            mainstream-tier retail prices. Sensitive, hypoallergenic, and ready-to-feed formulas use known retail
            premiums over standard. Breastfeeding supplies cover one pump (insurance covers most cases under the
            ACA), bottles, parts replacement, bras, pads, and an optional lactation consultant out-of-pocket.
          </p>
          <h3>Gear & nursery</h3>
          <p>
            Per-item costs are sampled from major U.S. retailers across budget, standard, and premium tiers.
            Registry coverage assumptions (low = 20%, medium = 45%, high = 75%) are based on industry reports
            from baby registry platforms. Used / hand-me-down OK applies a typical 45% reduction to non-safety items.
          </p>
          <h3>Misc recurring</h3>
          <p>
            Toiletries, baby OTC medication, laundry extras, photos, and baby classes — sampled and combined
            into a typical monthly range that we multiply by 12.
          </p>
        </div>
      </section>

      <section className="container-pg pb-12 max-w-3xl">
        <SectionHeader title="Sources" />
        <div className="mt-6 card divide-y divide-ink-100">
          {sourceNotes.map((s) => (
            <div key={s.id} className="p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {s.url !== '#' ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink-900 hover:text-teal-700 underline-offset-2 hover:underline">
                    {s.title}
                  </a>
                ) : (
                  <span className="font-semibold text-ink-900">{s.title}</span>
                )}
                <span className="text-xs text-ink-500">{s.org}</span>
              </div>
              <p className="text-xs text-ink-500 mt-1">
                Data year: {s.dataYear} · Last reviewed: {s.lastReviewed}
              </p>
              {s.notes && <p className="text-sm text-ink-600 mt-2 leading-relaxed">{s.notes}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="container-pg pb-16 max-w-3xl">
        <SectionHeader title="What this calculator is not" />
        <div className="prose-custom mt-6">
          <ul>
            <li>It is <strong>not medical advice</strong>. We don't give feeding, formula, or pediatric guidance.</li>
            <li>It is <strong>not insurance advice</strong>. We can't tell you what your specific plan will pay.</li>
            <li>It is <strong>not a bill</strong>. It's a planning estimate using ranges, not a quote.</li>
            <li>It is <strong>not financial advice</strong>. We don't account for your tax situation, FSAs, 529s, or income changes.</li>
            <li>It is <strong>not a registry</strong>. We don't recommend specific products for affiliate revenue.</li>
          </ul>
          <p>
            Have a question, a correction, or a state-level data source we should incorporate? Send a note to{' '}
            <a href="mailto:hello@firstyearcost.com">hello@firstyearcost.com</a>. We update assumptions as new
            data is published.
          </p>
        </div>
      </section>

      <NextStepCTA />
    </>
  );
}
