import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stateChildcare, stateBySlug, slugifyState, applyCareTypeFactor } from '@/data/stateChildcare';
import { formatUSD } from '@/lib/format';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { Disclaimer } from '@/components/Disclaimer';
import { ChildcareCalculator } from '@/components/ChildcareCalculator';
import { BreadcrumbsJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';

export async function generateStaticParams() {
  return stateChildcare.map((s) => ({ state: slugifyState(s.name) }));
}

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
  const s = stateBySlug[params.state];
  if (!s) return {};
  const title = `Infant Childcare Cost in ${s.name} (2026)`;
  const description = `Center daycare in ${s.name} runs about ${formatUSD(s.centerLow)}–${formatUSD(s.centerHigh)} per year for an infant. See home daycare, nanny ranges, and use our calculator.`;
  const url = `/state-childcare-costs/${params.state}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `Infant childcare in ${s.name}: center, home daycare, and nanny ranges.`,
    },
  };
}

export default function Page({ params }: { params: { state: string } }) {
  const s = stateBySlug[params.state];
  if (!s) notFound();

  // Deterministic neighbor selection: pick the 8 states with the closest
  // mid-range center cost to the current state. Stable across builds (no
  // Math.random) and useful as internal links — users comparing California
  // pricing see other high-cost states, not random ones.
  const currentMid = (s.centerLow + s.centerHigh) / 2;
  const otherStates = stateChildcare
    .filter((x) => x.code !== s.code)
    .map((x) => ({
      state: x,
      distance: Math.abs(((x.centerLow + x.centerHigh) / 2) - currentMid),
    }))
    .sort((a, b) => a.distance - b.distance || a.state.name.localeCompare(b.state.name))
    .slice(0, 8)
    .map((x) => x.state);

  // Alphabetical prev/next forms a complete cycle through all 51 states
  // (Wyoming wraps to Alabama). Every state page therefore has two guaranteed
  // neighbor inlinks, which — together with the leave cross-link below — fixes
  // the "only one internal link" discovery problem that keeps deep
  // programmatic pages out of Google's crawl queue.
  const alpha = [...stateChildcare].sort((a, b) => a.name.localeCompare(b.name));
  const ai = alpha.findIndex((x) => x.code === s.code);
  const prevState = alpha[(ai - 1 + alpha.length) % alpha.length];
  const nextState = alpha[(ai + 1) % alpha.length];
  const leaveSlug = slugifyState(s.name);

  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare costs by state', url: 'https://firstyearcost.com/state-childcare-costs' },
          { name: s.name, url: `https://firstyearcost.com/state-childcare-costs/${slugifyState(s.name)}` },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare by state', url: 'https://firstyearcost.com/state-childcare-costs' },
          { name: s.name, url: `https://firstyearcost.com/state-childcare-costs/${slugifyState(s.name)}` },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">{s.name}</p>
            <h1 className="h1 text-ink-900">Infant childcare cost in {s.name}</h1>
            <p className="lede mt-4">
              Center-based infant care in {s.name} typically runs <strong>{formatUSD(s.centerLow)}–{formatUSD(s.centerHigh)}</strong> per year,
              or about <strong>{formatUSD(s.centerLow / 12)}–{formatUSD(s.centerHigh / 12)}</strong> per month.
              That's about {s.pctMedianIncome}% of the state's median household income.
            </p>
            <p className="mt-3 text-xs text-ink-500">Last reviewed {reviewDateFor('/state-childcare-costs')}</p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="grid md:grid-cols-3 gap-5">
          <Card label="Center daycare" range={[s.centerLow, s.centerHigh]} accent="teal" />
          <Card label="Home daycare" range={[s.homeLow, s.homeHigh]} accent="ink" />
          <Card label="Nanny (full-time)" range={(() => { const r = applyCareTypeFactor(s, 'nanny'); return [r.annualLow, r.annualHigh]; })()} accent="coral" />
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-10">
        <SectionHeader title={`Calculator: childcare cost in ${s.name}`} eyebrow="Run your numbers" />
        <div className="mt-6">
          <ChildcareCalculator initialStateCode={s.code} />
        </div>
      </section>

      <section className="container-pg pb-12">
        <SectionHeader title={`What's typical in ${s.name}`} eyebrow="Local context" />
        <div className="prose-custom mt-6 max-w-3xl">
          <p>
            {s.name} infant childcare costs sit in the {midRangeBucket(s)}: center care runs about
            {' '}{formatUSD(s.centerLow)}–{formatUSD(s.centerHigh)} per year, with home daycare typically 15–25%
            cheaper at {formatUSD(s.homeLow)}–{formatUSD(s.homeHigh)}. Nanny costs are higher because they include
            a single caregiver's full-time wage; a nanny share with one other family typically runs about half that.
          </p>
          <p>
            For a family at the {s.name} median household income, full-time center care for an infant typically takes
            roughly {s.pctMedianIncome}% of pre-tax income — well above the 7% benchmark HHS uses for subsidy
            copayments under the Child Care and Development Fund. That's why most families compare multiple care
            types before committing.
          </p>
          <h3>How to bring the cost down in {s.name}</h3>
          <ul>
            <li>Family or home-based daycare is usually 15–25% cheaper than a center.</li>
            <li>Nanny share splits a nanny's cost between two families.</li>
            <li>Part-time care (3 days/week) typically prices at 65–75% of full-time — not the 60% you might expect from the day count alone.</li>
            <li>Federal Child & Dependent Care Tax Credit and a Dependent Care FSA can reduce effective cost.</li>
            <li>Some employers offer subsidized care, on-site care, or backup care benefits — ask HR.</li>
          </ul>
        </div>
      </section>

      <section className="container-pg pb-16">
        <Disclaimer>
          <strong>Local prices vary.</strong> {s.name} ranges shown above are statewide planning estimates based on
          Child Care Aware of America methodology and state market rate surveys. Specific cities and metros within
          {' '}{s.name} can be 20–40% above or below these ranges. Always verify with the specific provider.
        </Disclaimer>
      </section>

      <section className="container-pg pb-16">
        <SectionHeader title="Compare other states" />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {otherStates.map((x) => (
            <Link
              key={x.code}
              href={`/state-childcare-costs/${slugifyState(x.name)}`}
              className="card-tight p-4 hover:border-teal-400 hover:bg-teal-50/30 transition"
            >
              <p className="font-semibold text-ink-900">{x.name}</p>
              <p className="text-xs text-ink-500 tabular-nums mt-0.5">
                {formatUSD(x.centerLow)}–{formatUSD(x.centerHigh)}/yr center
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link href="/state-childcare-costs" className="text-teal-700 underline">
            See all 50 states →
          </Link>
        </p>
      </section>

      {/* Cross-link to the matching parental-leave page + alphabetical
          prev/next. These guarantee multiple inlinks per state page so the
          deep programmatic pages get discovered and crawled. */}
      <section className="container-pg pb-16">
        <div className="card p-6 bg-ink-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-300">Planning your leave?</p>
            <h2 className="h4 mt-1">Paid parental leave in {s.name}</h2>
            <p className="text-sm text-ink-300 mt-1">Weeks, wage replacement, and 2026 benefit caps for {s.name}.</p>
          </div>
          <Link href={`/maternity-leave-by-state/${leaveSlug}`} className="btn btn-accent shrink-0 inline-flex">
            See {s.name} leave →
          </Link>
        </div>

        <nav aria-label="Browse states alphabetically" className="mt-6 flex items-center justify-between gap-3 text-sm">
          <Link href={`/state-childcare-costs/${slugifyState(prevState.name)}`} className="inline-flex items-center gap-1 text-teal-700 hover:underline">
            ← {prevState.name}
          </Link>
          <Link href="/state-childcare-costs" className="text-ink-500 hover:text-ink-900">All states</Link>
          <Link href={`/state-childcare-costs/${slugifyState(nextState.name)}`} className="inline-flex items-center gap-1 text-teal-700 hover:underline">
            {nextState.name} →
          </Link>
        </nav>
      </section>
    </>
  );
}

function midRangeBucket(s: typeof stateChildcare[number]): string {
  const mid = (s.centerLow + s.centerHigh) / 2;
  if (mid < 11000) return 'low end nationally';
  if (mid < 15000) return 'middle of the national range';
  if (mid < 20000) return 'higher half of states';
  return 'top tier — among the priciest in the country';
}

function Card({ label, range, accent }: { label: string; range: [number, number]; accent: 'teal'|'coral'|'ink' }) {
  const cls =
    accent === 'teal' ? 'border-teal-200 bg-teal-50/40' :
    accent === 'coral' ? 'border-coral-200 bg-coral-50/40' :
    'border-ink-200 bg-ink-50';
  return (
    <div className={`card p-5 ${cls}`}>
      <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink-900 tabular-nums">
        {formatUSD(range[0])}–{formatUSD(range[1])}
      </p>
      <p className="text-xs text-ink-500 mt-1">per year</p>
    </div>
  );
}
