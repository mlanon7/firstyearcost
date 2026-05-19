import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, Baby, Calculator, BarChart3, CheckCircle2,
  CircleDollarSign, FileText, Heart, ShieldCheck, Sparkles,
} from 'lucide-react';
import { MainCalculator } from '@/components/MainCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema } from '@/components/FAQ';
import { faqHome } from '@/content/faqHome';
import { EmailCapture } from '@/components/EmailCapture';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <FAQSchema items={faqHome} />
      <CalculatorJsonLd />

      {/* HERO */}
      <section className="hero-bg">
        <div className="container-pg pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-4 inline-flex">
              <Sparkles className="w-3.5 h-3.5" /> Updated for 2026
            </p>
            <h1 className="h1 text-ink-900">
              Estimate your baby's <span className="text-teal-600">first-year cost</span>.
            </h1>
            <p className="lede mt-5 max-w-2xl">
              Plan diapers, feeding, childcare, baby gear, medical bills, and monthly expenses
              with realistic ranges based on your state, insurance, and choices — not generic
              averages.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="#calculator" className="btn btn-primary">
                Start estimate <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/monthly-baby-budget" className="btn btn-ghost">
                See monthly budget
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> No signup required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Source-backed assumptions</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 50-state childcare data</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <div className="-mt-2">
        <MainCalculator />
      </div>

      {/* AD slot — high-position, post-result */}
      <div className="container-pg mt-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      {/* WHY THIS CALCULATOR */}
      <section className="section">
        <div className="container-pg">
          <SectionHeader
            eyebrow="Why ranges, not averages"
            title="Generic baby-cost averages hide the real story."
            subtitle="The biggest first-year costs — childcare, delivery, feeding, and gear — depend on your state, insurance, and choices. We model the variables instead of guessing one number."
          />

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<CircleDollarSign className="w-5 h-5" />}
              title="State-aware childcare"
              body="Infant center care can run from about $7,000/year in low-cost states to $24,000+ in high-cost metros. We use Child Care Aware methodology and 50-state ranges."
              accent="teal"
            />
            <FeatureCard
              icon={<Heart className="w-5 h-5" />}
              title="Honest birth bills"
              body="KFF data shows the average employer-plan delivery cost about $20k total, with around $2,700 out-of-pocket for the parent. We translate that to a planning range, not a fake quote."
              accent="coral"
            />
            <FeatureCard
              icon={<Baby className="w-5 h-5" />}
              title="No-judgment feeding"
              body="Whether it's breastfeeding, formula, or combo — we give realistic costs without pushing one path. Hypoallergenic and ready-to-feed have their own numbers."
              accent="sun"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Safety-aware gear"
              body='Car seats, cribs, and sleep products: we flag what to buy new vs. what is safe to take secondhand. We never recommend unsafe sleep products.'
              accent="teal"
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Month-by-month timing"
              body="See when one-time gear hits, when daycare starts, and how the cumulative cost stacks up across the first 12 months — so you can plan cash flow, not just totals."
              accent="ink"
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Sources you can audit"
              body="Key assumption categories trace to public sources — CDC, KFF/Peterson-KFF, Child Care Aware, IRS, CMS, AAP — plus documented retail snapshots. Every data table is downloadable as CSV with a last-reviewed date."
              accent="ink"
            />
          </div>
        </div>
      </section>

      {/* CALCULATOR DIRECTORY */}
      <section className="section bg-white border-y border-ink-100">
        <div className="container-pg">
          <SectionHeader
            eyebrow="Specialized calculators"
            title="Go deeper on a single category."
            subtitle="Each calculator handles one decision in detail — daycare type, formula vs. breastfeeding, gear budget, or birth out-of-pocket — with its own assumptions and FAQ."
          />
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CalcLink
              href="/childcare-calculator"
              icon={<Calculator className="w-5 h-5" />}
              title="Childcare cost calculator"
              body="Compare center, home daycare, nanny, nanny share, part-time, or family help — by state, by hours per week."
              cta="Estimate childcare"
            />
            <CalcLink
              href="/diaper-calculator"
              icon={<Calculator className="w-5 h-5" />}
              title="Diaper & wipes calculator"
              body="Disposable vs. cloth, brand tier, bulk-buy effect. ~2,500–3,000 diapers in year one, modeled month-by-month."
              cta="Compare diaper costs"
            />
            <CalcLink
              href="/formula-vs-breastfeeding-calculator"
              icon={<Calculator className="w-5 h-5" />}
              title="Feeding cost calculator"
              body="Formula vs. breastfeeding vs. combo. Includes pump, bottles, lactation support, and specialty formula tiers."
              cta="Plan feeding costs"
            />
            <CalcLink
              href="/baby-gear-budget"
              icon={<Calculator className="w-5 h-5" />}
              title="Baby gear budget planner"
              body="Crib to car seat to monitor — by tier, with registry coverage and a 'must-have before birth' checklist."
              cta="Build gear budget"
            />
            <CalcLink
              href="/birth-insurance-planner"
              icon={<Calculator className="w-5 h-5" />}
              title="Birth & insurance planner"
              body="Out-of-pocket planning ranges by insurance type and delivery type, plus questions to ask your insurer."
              cta="Estimate birth costs"
            />
            <CalcLink
              href="/state-childcare-costs"
              icon={<Calculator className="w-5 h-5" />}
              title="Childcare costs by state"
              body="Browse infant center, home daycare, and nanny ranges in all 50 states + DC."
              cta="Browse states"
            />
            <CalcLink
              href="/daycare-vs-nanny-cost"
              icon={<Calculator className="w-5 h-5" />}
              title="Daycare vs. nanny: cost compared"
              body="Side-by-side cost, hours, sick-day flexibility, and the break-even for nanny share."
              cta="See the comparison"
            />
            <CalcLink
              href="/childcare-subsidy-calculator"
              icon={<Calculator className="w-5 h-5" />}
              title="Childcare tax credit & FSA estimator"
              body="Estimate the federal CDCTC + dependent-care FSA savings on your annual childcare bill — 2026 rules."
              cta="Estimate tax savings"
            />
            <CalcLink
              href="/c-section-vs-vaginal-cost"
              icon={<Calculator className="w-5 h-5" />}
              title="C-section vs. vaginal birth cost"
              body="Billed totals and out-of-pocket ranges by delivery type and insurance — plus the questions to ask your insurer."
              cta="Compare delivery costs"
            />
            <CalcLink
              href="/maternity-leave-by-state"
              icon={<Calculator className="w-5 h-5" />}
              title="Paid leave by state"
              body="Which states pay parental leave in 2026 — weeks, wage replacement, and benefit caps for every state."
              cta="Find your state"
            />
            <CalcLink
              href="/registry-essentials"
              icon={<Calculator className="w-5 h-5" />}
              title="Registry essentials checklist"
              body="Must-have-before-birth, safety-buy-new, and can-wait — sorted with real cost ranges."
              cta="See the checklist"
            />
            <CalcLink
              href="/second-baby-cost"
              icon={<Calculator className="w-5 h-5" />}
              title="Second baby cost"
              body="What changes — and what doesn't — when you add a second baby. Gear, childcare, tax credits."
              cta="Plan baby #2"
            />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="section">
        <div className="container-pg">
          <SectionHeader
            eyebrow="What we use, what we don't"
            title="Source-backed, regularly reviewed."
            subtitle="We use public data from CDC, KFF/Peterson-KFF, Child Care Aware of America, and retail snapshots — and we tell you when each source was last reviewed."
          />
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-ink-900 mb-3">What this calculator does</h3>
              <ul className="space-y-2 text-sm text-ink-700">
                {[
                  'Models 12 months of recurring costs (childcare, diapers, feeding, misc).',
                  'Captures one-time setup costs (gear, clothes, nursery) with registry offset.',
                  'Provides planning ranges for birth out-of-pocket by insurance type.',
                  'Adjusts childcare assumptions by state and care type.',
                  'Shows month-by-month timing so you can plan cash flow.',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" /><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-ink-900 mb-3">What it does not do</h3>
              <ul className="space-y-2 text-sm text-ink-700">
                {[
                  'Tell you what your specific insurance plan will pay — call your insurer.',
                  'Give medical advice on feeding, formula choice, or pediatric care.',
                  'Recommend specific products or brands based on commission.',
                  'Estimate lost income from unpaid parental leave (handled separately).',
                  'Replace a financial planner for tax credits, FSAs, or 529 plans.',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="w-4 h-4 rounded-full bg-coral-100 text-coral-600 inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">×</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      {/* LEAD MAGNET */}
      <section className="section">
        <div className="container-pg max-w-3xl">
          <EmailCapture />
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-pg max-w-3xl">
          <SectionHeader
            eyebrow="Common questions"
            title="Frequently asked questions"
            align="left"
          />
          <div className="mt-8">
            <FAQ items={faqHome} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-pg">
          <div className="card p-8 md:p-12 bg-ink-900 text-white text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                // Warm terracotta + honey accents matching the v3 palette.
                background:
                  'radial-gradient(600px 250px at 80% 20%, rgba(199,95,62,0.55), transparent 60%), radial-gradient(500px 200px at 10% 90%, rgba(224,133,21,0.35), transparent 60%)',
              }}
            />
            <div className="relative">
              <h2 className="h2">Ready to see your number?</h2>
              <p className="lede mt-3 max-w-xl mx-auto text-ink-300">
                Pick a preset, tweak the inputs, and get a planning estimate in under a minute.
              </p>
              <Link href="#calculator" className="btn btn-accent mt-6 inline-flex">
                Start my baby budget <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon, title, body, accent,
}: { icon: React.ReactNode; title: string; body: string; accent: 'teal'|'coral'|'sun'|'ink' }) {
  const dot =
    accent === 'teal' ? 'bg-teal-100 text-teal-700' :
    accent === 'coral' ? 'bg-coral-100 text-coral-700' :
    accent === 'sun'   ? 'bg-sun-100 text-sun-800' :
    'bg-ink-100 text-ink-800';
  return (
    <div className="card p-6">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${dot}`}>{icon}</div>
      <h3 className="mt-4 h4 text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function CalcLink({
  href, icon, title, body, cta = 'Open',
}: { href: string; icon: React.ReactNode; title: string; body: string; cta?: string }) {
  return (
    <Link href={href} className="card p-6 block hover:shadow-pop hover:-translate-y-0.5 transition group">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-500 group-hover:text-white transition">{icon}</div>
      <h3 className="mt-4 h4 text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:gap-2 transition-all">
        {cta} <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

function CalculatorJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'First-Year Baby Cost Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (web)',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    description:
      "Free, source-backed calculator for the first-year cost of a baby in the United States, including childcare, feeding, diapers, gear, and birth out-of-pocket.",
    url: 'https://firstyearcost.com',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
