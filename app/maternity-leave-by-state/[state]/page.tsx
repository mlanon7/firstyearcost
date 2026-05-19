import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { stateLeave, stateLeaveBySlug } from '@/data/stateLeave';
import { stateBySlug, slugifyState } from '@/data/stateChildcare';
import { formatUSD } from '@/lib/format';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { Disclaimer } from '@/components/Disclaimer';
import { BreadcrumbsJsonLd, ArticleJsonLd } from '@/components/Breadcrumbs';

type Params = { state: string };

export function generateStaticParams(): Params[] {
  return stateLeave.map((s) => ({ state: slugifyState(s.name) }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const s = stateLeaveBySlug[params.state];
  if (!s) return { title: 'Not found' };
  const title = `${s.name} Paid Maternity & Paternity Leave (2026)`;
  const description = s.paidLeaveWeeks > 0
    ? `${s.name} runs ${s.program} — ${s.paidLeaveWeeks} weeks of paid family leave at ${Math.round(s.wageReplacementPct * 100)}% wage replacement, capped at $${s.maxWeeklyBenefitUsd}/week.`
    : `${s.name} has no state-mandated paid family leave program. Workers fall back on the federal FMLA (12 unpaid weeks).`;
  return {
    title,
    description,
    alternates: { canonical: `/maternity-leave-by-state/${params.state}` },
    openGraph: { title, description, url: `/maternity-leave-by-state/${params.state}`, type: 'article' },
  };
}

export default function Page({ params }: { params: Params }) {
  const s = stateLeaveBySlug[params.state];
  if (!s) notFound();
  const cc = stateBySlug[params.state];
  const URL = `https://firstyearcost.com/maternity-leave-by-state/${params.state}`;

  return (
    <>
      <ArticleJsonLd
        title={`${s.name} Paid Maternity & Paternity Leave (2026)`}
        description={`Paid family leave benefits available to ${s.name} workers in 2026.`}
        url={URL}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Maternity leave by state', url: 'https://firstyearcost.com/maternity-leave-by-state' },
          { name: s.name, url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Parental leave · {s.name}</p>
            <h1 className="h1 text-ink-900">
              Paid maternity & paternity leave in {s.name}
            </h1>
            <p className="lede mt-4">
              {s.paidLeaveWeeks > 0
                ? `${s.name} runs the ${s.program} program. Here's what you'll actually receive — and how to combine it with FMLA, short-term disability, and employer top-ups.`
                : `${s.name} has no state-mandated paid family-leave program. Most parents stitch together the federal FMLA, employer-provided leave, accrued PTO, and short-term disability.`}
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Paid weeks" value={s.paidLeaveWeeks > 0 ? `${s.paidLeaveWeeks}` : '0'} accent={s.paidLeaveWeeks > 0 ? 'teal' : 'coral'} />
          <Stat label="Wage replacement" value={s.wageReplacementPct > 0 ? `${Math.round(s.wageReplacementPct * 100)}%` : '—'} />
          <Stat label="Max weekly benefit" value={s.maxWeeklyBenefitUsd > 0 ? formatUSD(s.maxWeeklyBenefitUsd) : '—'} />
          <Stat label="Job protection" value={s.jobProtection} />
        </div>

        <div className="mt-6 card p-6">
          <h2 className="h4 text-ink-900">Program details</h2>
          <p className="mt-2 text-sm text-ink-700 leading-relaxed">{s.notes}</p>
          <p className="mt-4 text-sm">
            <a
              href={s.sourceUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-2"
            >
              Official program page <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>How to stack the benefits in {s.name}</h2>
          <ol>
            <li>
              <strong>Federal FMLA</strong> — 12 weeks of unpaid, job-protected
              leave at employers with 50+ employees. You must have worked there
              for 12 months and 1,250 hours. FMLA runs concurrently with state
              programs, so don't double-count weeks.
            </li>
            {s.paidLeaveWeeks > 0 && (
              <li>
                <strong>{s.program}</strong> — apply through the state portal.
                Most programs require notice 30 days before your leave starts
                (sooner for unexpected medical events). Approval and first
                check typically take 2–4 weeks.
              </li>
            )}
            <li>
              <strong>Short-term disability (STD)</strong> — covers the birth
              parent's medical recovery (typically 6 weeks for vaginal delivery,
              8 weeks for C-section). Check whether STD pays on top of state
              PFL or instead of it.
            </li>
            <li>
              <strong>Employer top-up</strong> — many employers add their own
              paid parental leave benefit. Some "top up" state benefits to 100%
              of salary. Check your benefits handbook for parental leave,
              paid time off, and salary continuation.
            </li>
            <li>
              <strong>Accrued PTO/vacation</strong> — use to extend total time
              off or to top up partially-paid state benefit weeks.
            </li>
          </ol>

          <h2>Common pitfalls</h2>
          <ul>
            <li><strong>Don't quit during leave</strong> — most state benefits stop the day employment ends, and you may owe back any unused FSA contributions.</li>
            <li><strong>File for state benefits early</strong> — claims processed retroactively can take weeks; living off savings while waiting is the most common surprise.</li>
            <li><strong>Plan the FMLA "12 weeks" carefully</strong> — it's measured by your employer's chosen method (calendar year, rolling, fiscal). Two consecutive babies in one rolling year can leave you short.</li>
            <li><strong>Check insurance continuation</strong> — FMLA preserves group health coverage; state-only leave may not. Confirm with HR before you stop receiving paychecks.</li>
          </ul>
        </div>
      </section>

      <div className="container-pg pb-12 max-w-3xl">
        {cc && (
          <div className="card p-6 bg-ink-900 text-white">
            <p className="text-xs uppercase tracking-wider text-ink-300">Next decision</p>
            <h2 className="h3 mt-1">After leave: childcare in {s.name}</h2>
            <p className="text-sm text-ink-300 mt-2 leading-relaxed">
              Infant center daycare in {s.name} typically runs{' '}
              <span className="font-semibold text-white">
                {formatUSD(cc.centerLow)}–{formatUSD(cc.centerHigh)}/year
              </span>
              . Plan childcare alongside your return-to-work date — many programs have 3–6 month waitlists.
            </p>
            <Link href={`/state-childcare-costs/${params.state}`} className="btn btn-accent mt-4 inline-flex">
              See {s.name} childcare costs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        <div className="mt-6">
          <Disclaimer>
            <strong>Not legal advice.</strong> Eligibility rules change. Confirm
            wage replacement, waiting periods, and stacking rules with your HR
            and the official program portal before relying on a benefit number.
          </Disclaimer>
        </div>
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="Other state leave programs" eyebrow="Compare" />
        <p className="mt-2 text-sm text-ink-600">A few notable neighbors and comparable programs.</p>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[...stateLeave]
            .filter((x) => x.code !== s.code && x.paidLeaveWeeks > 0)
            .slice(0, 6)
            .map((x) => (
              <Link
                key={x.code}
                href={`/maternity-leave-by-state/${slugifyState(x.name)}`}
                className="card p-4 hover:shadow-pop hover:-translate-y-0.5 transition"
              >
                <p className="font-semibold text-ink-900">{x.name}</p>
                <p className="text-sm text-ink-600 mt-1">{x.paidLeaveWeeks}w · {Math.round(x.wageReplacementPct * 100)}% wages</p>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, accent = 'ink' }: { label: string; value: string; accent?: 'ink' | 'teal' | 'coral' }) {
  const cls = accent === 'teal' ? 'text-teal-700' : accent === 'coral' ? 'text-coral-600' : 'text-ink-900';
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold tracking-tight ${cls} tabular-nums`}>{value}</p>
    </div>
  );
}
