import type { Metadata } from 'next';
import Link from 'next/link';
import { stateChildcare, slugifyState } from '@/data/stateChildcare';
import { formatUSD } from '@/lib/format';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { BreadcrumbsJsonLd, DatasetJsonLd } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Infant Childcare Costs by State — All 50 States + DC',
  description:
    'Browse infant childcare cost ranges in all 50 states plus the District of Columbia: center daycare, family home daycare, and nanny rates. Updated for 2026.',
  path: '/state-childcare-costs',
});

export default function Page() {
  const sorted = [...stateChildcare].sort((a, b) => a.name.localeCompare(b.name));
  const cheapest = [...stateChildcare].sort((a, b) => (a.centerLow + a.centerHigh) - (b.centerLow + b.centerHigh)).slice(0, 5);
  const priciest = [...stateChildcare].sort((a, b) => (b.centerLow + b.centerHigh) - (a.centerLow + a.centerHigh)).slice(0, 5);

  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare costs by state', url: 'https://firstyearcost.com/state-childcare-costs' },
        ]}
      />
      <DatasetJsonLd
        name="U.S. State Infant Childcare Costs (2026)"
        description="Annual infant childcare cost ranges for all 50 states + DC: center daycare, family home daycare, and full-time nanny."
        url="https://firstyearcost.com/state-childcare-costs"
        keywords={['infant daycare', 'childcare cost by state', 'nanny cost', 'family daycare']}
        distributions={[
          { name: 'State childcare costs (CSV)', contentUrl: 'https://firstyearcost.com/data/state_childcare.csv' },
        ]}
        dateModified={reviewDateFor('/state-childcare-costs')}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Childcare data</p>
            <h1 className="h1 text-ink-900">Infant childcare costs by state</h1>
            <p className="lede mt-4">
              Annual cost ranges for center daycare, family home daycare, and full-time nannies — across all
              50 states plus DC. Click any state for the detailed page and a state-specific calculator.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-6">
            <h3 className="font-semibold text-ink-900 mb-3">5 most affordable states (center care)</h3>
            <ul className="text-sm text-ink-700 space-y-1.5">
              {cheapest.map((s) => (
                <li key={s.code} className="flex justify-between">
                  <Link className="hover:underline" href={`/state-childcare-costs/${slugifyState(s.name)}`}>{s.name}</Link>
                  <span className="tabular-nums text-ink-900 font-medium">{formatUSD(s.centerLow)}–{formatUSD(s.centerHigh)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-ink-900 mb-3">5 priciest states (center care)</h3>
            <ul className="text-sm text-ink-700 space-y-1.5">
              {priciest.map((s) => (
                <li key={s.code} className="flex justify-between">
                  <Link className="hover:underline" href={`/state-childcare-costs/${slugifyState(s.name)}`}>{s.name}</Link>
                  <span className="tabular-nums text-ink-900 font-medium">{formatUSD(s.centerLow)}–{formatUSD(s.centerHigh)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="All states" />
        <div className="mt-6 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">State</th>
                  <th className="text-right font-semibold px-4 py-3">Center daycare</th>
                  <th className="text-right font-semibold px-4 py-3 hidden sm:table-cell">Home daycare</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Nanny (full-time)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {sorted.map((s) => (
                  <tr key={s.code} className="hover:bg-ink-50/40">
                    <td className="px-4 py-2.5 font-medium">
                      <Link className="text-ink-900 hover:text-teal-700" href={`/state-childcare-costs/${slugifyState(s.name)}`}>
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                      {formatUSD(s.centerLow)}–{formatUSD(s.centerHigh)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700 hidden sm:table-cell">
                      {formatUSD(s.homeLow)}–{formatUSD(s.homeHigh)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700 hidden md:table-cell">
                      ~{formatUSD(s.nannyMid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-500">
          Source: Child Care Aware of America methodology and state market rate surveys.
          Last reviewed 2026-04-30. Local prices vary within each state.
        </p>
      </section>
    </>
  );
}
