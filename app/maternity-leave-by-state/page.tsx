import type { Metadata } from 'next';
import Link from 'next/link';
import { stateLeave } from '@/data/stateLeave';
import { slugifyState } from '@/data/stateChildcare';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { Disclaimer } from '@/components/Disclaimer';
import { BreadcrumbsJsonLd, DatasetJsonLd } from '@/components/Breadcrumbs';

const URL = 'https://firstyearcost.com/maternity-leave-by-state';

export const metadata: Metadata = {
  title: 'Paid Maternity & Paternity Leave by State (2026)',
  description:
    'Which states pay parental leave benefits in 2026 — weeks, wage replacement, and weekly benefit caps for California PFL, Colorado FAMLI, Washington Paid Leave, Massachusetts PFML, and every other state program.',
  alternates: { canonical: '/maternity-leave-by-state' },
  openGraph: {
    title: 'Paid Maternity & Paternity Leave by State (2026)',
    description:
      'State-by-state guide to paid parental leave: weeks, wage replacement, benefit caps, and links to official program pages.',
    url: '/maternity-leave-by-state',
    type: 'website',
  },
};

export default function Page() {
  const sorted = [...stateLeave].sort((a, b) => a.name.localeCompare(b.name));
  const paid = sorted.filter((s) => s.paidLeaveWeeks > 0);
  const unpaid = sorted.filter((s) => s.paidLeaveWeeks === 0);
  const bestPaid = [...paid]
    .sort((a, b) => b.paidLeaveWeeks * b.wageReplacementPct - a.paidLeaveWeeks * a.wageReplacementPct)
    .slice(0, 5);

  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Maternity leave by state', url: URL },
        ]}
      />
      <DatasetJsonLd
        name="U.S. State Paid Parental Leave (2026)"
        description="State-level summary of paid family and medical leave programs across all 50 states plus DC: program name, weeks, wage replacement, maximum weekly benefit, and job protection status."
        url={URL}
        keywords={['paid family leave', 'maternity leave', 'paternity leave', 'PFML', 'state PFL', 'CFRA', 'Paid Leave Oregon']}
        distributions={[
          {
            name: 'State leave summary (CSV)',
            contentUrl: 'https://firstyearcost.com/data/state_leave.csv',
          },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Parental leave</p>
            <h1 className="h1 text-ink-900">
              Paid maternity & paternity leave — every state, 2026
            </h1>
            <p className="lede mt-4">
              Thirteen jurisdictions, including DC, now run a paid family-leave
              program. Most of the country still has only the unpaid federal
              FMLA. Here's the practical state-by-state breakdown — weeks, wage
              replacement, weekly benefit caps, and the official program page.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">States with paid leave</p>
            <p className="text-4xl font-extrabold mt-1 text-ink-900">{paid.length}</p>
            <p className="text-sm text-ink-600 mt-2">
              {paid.length} jurisdictions ({paid.length - 1} states plus DC) currently run
              mandatory paid family-leave programs (some launched 2024–2026).
            </p>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">States with no state program</p>
            <p className="text-4xl font-extrabold mt-1 text-coral-600">{unpaid.length}</p>
            <p className="text-sm text-ink-600 mt-2">
              These workers fall back on unpaid federal FMLA (12 weeks, job
              protected) plus any employer-provided benefit.
            </p>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Most generous (best paid weeks × wage replacement)</p>
            <ul className="mt-2 text-sm text-ink-700 space-y-1">
              {bestPaid.map((s) => (
                <li key={s.code} className="flex justify-between">
                  <Link className="hover:underline" href={`/maternity-leave-by-state/${slugifyState(s.name)}`}>{s.name}</Link>
                  <span className="text-ink-900 font-medium">{s.paidLeaveWeeks}w · {Math.round(s.wageReplacementPct * 100)}%</span>
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
                  <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Program</th>
                  <th className="text-right font-semibold px-4 py-3">Paid weeks</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Wage replacement (up to)</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Max / wk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {sorted.map((s) => (
                  <tr key={s.code} className="hover:bg-ink-50/40">
                    <td className="px-4 py-2.5 font-medium">
                      <Link className="text-ink-900 hover:text-teal-700" href={`/maternity-leave-by-state/${slugifyState(s.name)}`}>
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell text-ink-700">
                      {s.program === 'None' ? <span className="text-ink-400">—</span> : s.program}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {s.paidLeaveWeeks > 0
                        ? <span className="text-ink-900 font-medium">{s.paidLeaveWeeks}</span>
                        : <span className="text-ink-400">0</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums hidden md:table-cell text-ink-700">
                      {s.wageReplacementPct > 0 ? `${Math.round(s.wageReplacementPct * 100)}%` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums hidden md:table-cell text-ink-700">
                      {s.maxWeeklyBenefitUsd > 0 ? `$${s.maxWeeklyBenefitUsd}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-ink-500">
          Last reviewed 2026-05-19. Programs change annually — check the linked
          official source on each state page before relying on a number.
          Delaware, Maine, and Minnesota launched benefits in 2026; Maryland
          was scheduled for 2026 but the launch was delayed (contributions
          begin January 2027, benefits January 2028). Most state programs pay
          a <em>tiered</em> wage replacement (e.g., 90% up to a fraction of
          the state average weekly wage, then a lower percentage above) —
          the headline "up to" rate is the top tier; check the per-state
          page for the full formula.
        </p>

        <div className="mt-8">
          <Disclaimer>
            <strong>Not legal advice.</strong> Eligibility depends on employer
            size, length of employment, and earnings history. The federal FMLA
            covers most workers at employers with 50+ employees for 12 weeks of
            unpaid, job-protected leave — confirm with your HR before
            committing to a leave plan.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
