import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { Disclaimer } from '@/components/Disclaimer';
import { SubsidyCalculator } from '@/components/SubsidyCalculator';
import { EmailCapture } from '@/components/EmailCapture';
import { BreadcrumbsJsonLd, ArticleJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { reviewDateFor } from '@/lib/reviewDates';
import { buildPageMetadata } from '@/lib/seo';

const URL = 'https://firstyearcost.com/dependent-care-fsa-vs-tax-credit';

export const metadata: Metadata = buildPageMetadata({
  title: 'Dependent Care FSA vs. Tax Credit (2026)',
  description:
    'Should you use a dependent care FSA or the federal Child & Dependent Care Tax Credit in 2026? Compare caps, savings, and when to use both.',
  path: '/dependent-care-fsa-vs-tax-credit',
  type: 'article',
});

const faq: FAQItem[] = [
  {
    q: 'Should I use a dependent care FSA or the child care tax credit?',
    a: "For most working parents paying for infant or toddler care, the answer is both — and in a specific order. Max the dependent care FSA first (it dodges federal income tax plus 7.65% FICA, and usually state tax too), then claim the federal Child & Dependent Care Tax Credit (CDCTC) on whatever qualifying spend the FSA didn't cover. The two only compete when your total annual childcare spend is low enough that the FSA cap and the CDCTC cap overlap. If you spend at least about $10,500 a year on one child (or $13,500 on two or more), you can max both with no tradeoff at all.",
  },
  {
    q: 'Can I use both a dependent care FSA and the CDCTC in the same year?',
    a: "Yes — but the same dollar of childcare can only count toward one. The IRS subtracts every FSA dollar from your CDCTC qualifying-expense base before the credit is calculated (this is the 'no double-dip' rule on Form 2441). Because the FSA cap is $7,500 and the CDCTC cap is only $3,000 (one child) or $6,000 (two or more), families who spend more than the combined cap get the full benefit of both with zero overlap.",
  },
  {
    q: 'Which one saves more money?',
    a: "Per dollar, a dependent care FSA saves you your marginal federal income-tax rate plus 7.65% FICA (plus state tax in most states). The CDCTC saves you its credit rate — between 20% and 50% in 2026 depending on your AGI. So a family in the 22% federal bracket saves about 29.65% per FSA dollar versus a 20% CDCTC rate — the FSA wins. A lower-income family whose CDCTC rate is 35–50% might save more per dollar through the credit — but the CDCTC is non-refundable, so if you owe little or no federal income tax it can pay $0, while the FSA still saves the FICA you definitely pay. That asymmetry is why the FSA is the safer first move for most families.",
  },
  {
    q: 'How much can I put in a dependent care FSA in 2026?',
    a: "The 2026 federal cap is $7,500 per household for single, head-of-household, and married-filing-jointly filers, or $3,750 if married filing separately. That is up from $5,000 / $2,500 — the first increase since 1986, enacted by the One Big Beautiful Bill Act (OBBBA). Note that IRS nondiscrimination rules can require your employer to lower the amount highly compensated employees may exclude.",
  },
  {
    q: 'What is the catch with a dependent care FSA?',
    a: "Use-it-or-lose-it. You elect the amount during open enrollment and it is deducted pre-tax from your paychecks across the year; unspent dollars are forfeited at year-end unless your plan offers a carryover or a 2.5-month grace period (check your Summary Plan Description). You also generally can't change your election mid-year without a qualifying life event. Estimate conservatively: it is better to slightly under-elect and pick up the rest through the CDCTC than to forfeit money.",
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="Dependent Care FSA vs. Child Care Tax Credit (2026)"
        description="A 2026 comparison of the dependent care FSA and the federal Child & Dependent Care Tax Credit — caps, savings, the no-double-dip rule, and when to use both."
        url={URL}
        dateModified={reviewDateFor('/dependent-care-fsa-vs-tax-credit')}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Dependent Care FSA vs. Tax Credit', url: URL },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'FSA vs. Tax Credit', url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Tax & subsidy · 2026</p>
            <h1 className="h1 text-ink-900">
              Dependent Care FSA vs. Child Care Tax Credit
            </h1>
            <p className="lede mt-4">
              Two federal levers cut your childcare bill — a pre-tax dependent-care
              FSA at work, and the Child &amp; Dependent Care Tax Credit (CDCTC) at
              filing. They don&apos;t double-dip. Here&apos;s which to use, in what
              order, and when to use both — with the 2026 numbers run live.
            </p>
          </div>
        </div>
      </section>

      {/* THE SHORT ANSWER */}
      <section className="container-pg pb-2">
        <div className="card p-6 md:p-8 max-w-3xl border-l-4 border-l-teal-500">
          <h2 className="font-semibold text-ink-900 text-lg">The short answer</h2>
          <p className="text-sm text-ink-700 mt-2 leading-relaxed">
            <strong>Use both, FSA first.</strong> If your annual childcare spend is
            at least about <strong>$10,500 for one child</strong> (or{' '}
            <strong>$13,500 for two or more</strong>), you can max the FSA{' '}
            <em>and</em> claim the full CDCTC with no overlap — because the FSA cap
            ($7,500) and the CDCTC qualifying cap ($3,000 / $6,000) fit inside your
            spend. Most families paying for infant center care — which runs roughly
            $10,000–$24,000 a year — are comfortably in that zone. Run your own
            numbers below.
          </p>
        </div>
      </section>

      {/* CALCULATOR (reused, already 2026-correct) */}
      <section className="container-pg pt-8 pb-10">
        <SectionHeader
          eyebrow="Run your numbers"
          title="Your combined 2026 benefit"
          subtitle="Enter your filing status, AGI, kids, childcare spend, and FSA election. The estimator applies the 2026 OBBBA rules — the FSA cap, the CDCTC step-function rate, and the no-double-dip subtraction — and shows the combined benefit."
        />
        <div className="mt-8">
          <SubsidyCalculator />
        </div>
        <div className="mt-6">
          <Disclaimer>
            <strong>Planning estimate, not tax advice.</strong> Marginal tax bracket
            is estimated from AGI; the IRS computes your actual credit from taxable
            income on Form 2441. State credits, ACTC interactions, and the Saver&apos;s
            Credit are not modeled. Talk to a CPA for your filing.
          </Disclaimer>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      {/* HEAD-TO-HEAD TABLE */}
      <section className="container-pg pb-12 max-w-3xl">
        <SectionHeader title="Head-to-head: 2026 rules" align="left" />
        <div className="mt-6 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Feature</th>
                  <th className="text-left font-semibold px-4 py-3">Dependent Care FSA</th>
                  <th className="text-left font-semibold px-4 py-3">CDCTC (tax credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {[
                  ['What it is', 'Pre-tax salary reduction through your employer', 'Non-refundable credit on your federal return'],
                  ['2026 cap', '$7,500 household ($3,750 if MFS)', '$3,000 spend (1 child) / $6,000 (2+)'],
                  ['How you save', 'Income tax + 7.65% FICA + most state tax', '20%–50% of qualifying spend (by AGI)'],
                  ['Best for', 'Middle and higher earners; anyone with FICA', 'Lower-AGI filers who owe federal tax'],
                  ['Refundable?', 'N/A — it is a deduction, not a credit', 'No — caps at your tax liability'],
                  ['When you decide', 'Open enrollment (a year ahead)', 'At tax filing (after the fact)'],
                  ['Main catch', 'Use-it-or-lose-it; hard to change mid-year', 'Pays $0 if you owe no federal income tax'],
                ].map(([feature, fsa, cdctc]) => (
                  <tr key={feature} className="align-top">
                    <td className="px-4 py-3 font-medium text-ink-900">{feature}</td>
                    <td className="px-4 py-3 text-ink-700">{fsa}</td>
                    <td className="px-4 py-3 text-ink-700">{cdctc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          2026 figures reflect the One Big Beautiful Bill Act (OBBBA). Sources: IRS{' '}
          <a href="https://www.irs.gov/publications/p503" target="_blank" rel="noopener" className="underline">Pub 503</a>,{' '}
          <a href="https://www.irs.gov/publications/p15b" target="_blank" rel="noopener" className="underline">Pub 15-B</a>.
          See our <Link href="/methodology" className="underline">methodology</Link> for how we model the rates.
        </p>
      </section>

      {/* DECISION FRAMEWORK */}
      <section className="container-pg pb-12 max-w-3xl">
        <SectionHeader title="Which should you choose?" align="left" />
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <DecisionCard
            tone="teal"
            heading="Spend ≥ caps"
            verdict="Use both"
            body="Spending more than ~$10,500 (one child) or ~$13,500 (two+) a year? Max the FSA and claim the full CDCTC. No overlap, no tradeoff. This is most infant-care families."
          />
          <DecisionCard
            tone="sun"
            heading="Middle / higher earner"
            verdict="FSA first"
            body="In the 22%+ bracket, an FSA dollar saves ~29.65%+ (tax + FICA) versus a 20% CDCTC rate. Fund the FSA first; use the credit only on spend beyond the $7,500 FSA cap."
          />
          <DecisionCard
            tone="coral"
            heading="Low AGI, little tax owed"
            verdict="Mind the credit"
            body="The CDCTC rate is highest (up to 50%) at low AGI — but it is non-refundable, so it pays $0 if you owe no federal tax. The FSA still saves FICA. Also check refundable state credits and CCDBG subsidies."
          />
        </div>
        <div className="prose-custom mt-8">
          <h3>Why FSA-first works for most families</h3>
          <p>
            A dependent-care FSA dollar escapes three taxes at once: federal income
            tax at your marginal rate, the 7.65% FICA payroll tax, and — in most
            states — state income tax. The CDCTC only offsets federal income tax,
            and only at its credit rate. For a household in the 22% federal bracket,
            an FSA dollar is worth about 29.65 cents before state tax; the CDCTC at
            that income is usually 20%. So the FSA wins per dollar, and it has the
            bigger cap ($7,500 vs. $3,000 for one child). Fund it first.
          </p>
          <h3>The one case where the credit can win per dollar</h3>
          <p>
            At very low AGI the CDCTC rate climbs toward 50%, which can beat the
            FSA&apos;s tax-plus-FICA savings on a per-dollar basis. But the credit is{' '}
            <strong>non-refundable</strong> — it can only reduce a tax bill you
            actually owe. A family that owes little or no federal income tax gets
            little or nothing from it, while the FSA still recovers the FICA they pay
            on every paycheck. For lower-income families the bigger wins are usually{' '}
            <em>refundable</em> state credits (Minnesota, Vermont, New York, Oregon)
            and direct <Link href="/childcare-subsidy-calculator">CCDBG state subsidies</Link>,
            not the federal CDCTC.
          </p>
          <h3>Don&apos;t over-elect the FSA</h3>
          <p>
            Because unspent FSA dollars are forfeited, estimate on the low side. If
            you under-elect, the CDCTC picks up qualifying spend the FSA didn&apos;t
            cover — there is no penalty for leaving room. Over-electing and forfeiting
            is the only real way to lose money here.
          </p>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      {/* EMAIL + CROSS-LINKS */}
      <section className="container-pg pb-12 max-w-3xl">
        <EmailCapture
          title="Want the state-by-state credit + subsidy cheat sheet?"
          subtitle="We'll send the refundable state CDCTC equivalents, CCDBG income thresholds, and a printable 'questions for HR' sheet for open-enrollment season."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/childcare-subsidy-calculator" className="btn btn-accent inline-flex">
            Open the full tax &amp; FSA calculator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/childcare-calculator" className="btn btn-ghost inline-flex">
            Estimate your childcare bill
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-pg pb-16 max-w-3xl">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}

function DecisionCard({
  tone, heading, verdict, body,
}: { tone: 'teal' | 'sun' | 'coral'; heading: string; verdict: string; body: string }) {
  const pill =
    tone === 'teal' ? 'bg-teal-100 text-teal-800' :
    tone === 'sun'  ? 'bg-sun-100 text-sun-800' :
    'bg-coral-100 text-coral-700';
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">{heading}</p>
      <p className={`mt-2 inline-flex px-2.5 py-1 rounded-md text-sm font-bold ${pill}`}>{verdict}</p>
      <p className="mt-3 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}
