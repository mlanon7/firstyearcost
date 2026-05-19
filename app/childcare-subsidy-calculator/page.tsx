import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { Disclaimer } from '@/components/Disclaimer';
import { SubsidyCalculator } from '@/components/SubsidyCalculator';
import { BreadcrumbsJsonLd, ArticleJsonLd, VisibleBreadcrumbs } from '@/components/Breadcrumbs';
import { EmailCapture } from '@/components/EmailCapture';

const URL = 'https://firstyearcost.com/childcare-subsidy-calculator';

export const metadata: Metadata = {
  title: 'Childcare Subsidy & Tax Credit Calculator (CDCTC + Dependent-Care FSA)',
  description:
    "Estimate your 2026 federal Child & Dependent Care Tax Credit and dependent-care FSA savings. Free calculator that respects the no-double-dip rule between FSA and CDCTC.",
  alternates: { canonical: '/childcare-subsidy-calculator' },
  openGraph: {
    title: 'Childcare Subsidy & Tax Credit Calculator',
    description:
      "Estimate the federal CDCTC + dependent-care FSA savings on your childcare bill. 2026 rules, no signup.",
    url: '/childcare-subsidy-calculator',
    type: 'website',
  },
};

const faq: FAQItem[] = [
  {
    q: 'What is the Child & Dependent Care Tax Credit (CDCTC)?',
    a: "It's a non-refundable federal tax credit that offsets a percentage of qualifying childcare expenses for kids under 13. Under the One Big Beautiful Bill Act (OBBBA) effective tax year 2026, the maximum rate rose from 35% to 50%. The actual schedule is a two-phase step function: start at 50% if AGI is at or below $15,000 single/HOH or $30,000 MFJ, then reduce by 1 percentage point per $2,000 of AGI (single/HOH) or $4,000 (MFJ) above that threshold until it hits a 35% floor; hold flat at 35% up to $75,000 / $150,000; then reduce again 1 percentage point per the same step until it hits a 20% floor at $105,001+ single/HOH or $210,001+ MFJ. Qualifying-expense cap is $3,000 for one child and $6,000 for two or more.",
  },
  {
    q: 'Can I use both a Dependent Care FSA and the CDCTC?',
    a: "Yes — but the same dollar of childcare spending cannot count toward both. FSA dollars are removed from your CDCTC qualifying expense base. The calculator does this correctly. For most middle and high-income families, the FSA produces larger savings than the CDCTC because FSA dollars dodge federal tax, FICA, and often state tax — so prioritize maxing the FSA first.",
  },
  {
    q: 'How much can I put in a Dependent Care FSA in 2026?',
    a: 'The federal cap was raised to $7,500 per household for single filers, head-of-household, and married filing jointly (up from $5,000), or $3,750 if married filing separately (up from $2,500). This is the first increase since 1986 and took effect with the 2026 plan year under OBBBA. Note: IRS nondiscrimination rules can require your employer to reduce the amount that highly compensated employees (HCEs) may exclude — these rules lower the cap for HCEs, they do not raise it. Unused funds at year-end are forfeited unless your plan allows a carryover or grace period.',
  },
  {
    q: 'Do states have their own childcare tax credits?',
    a: 'Yes — California, Colorado, Iowa, Louisiana, Maine, Maryland, Massachusetts, Minnesota, Nebraska, New Mexico, New York, Oregon, Vermont, and others offer separate state CDCTC equivalents that stack on top of the federal credit. They are not included in this calculator. Check your state Department of Revenue or a state-specific tax tool.',
  },
  {
    q: 'What counts as "qualifying childcare expenses"?',
    a: 'Paid care for a child under 13 so that you (and your spouse, if filing jointly) can work or look for work. That includes daycare centers, family daycare homes, nannies, summer day camps (not sleepaway), and before/after-school programs. Care provided by your spouse, the child\'s other parent, or a dependent does not count. Care provided by your own child only counts if they are 19 or older.',
  },
  {
    q: 'Do I qualify for state-funded childcare subsidies (CCDBG)?',
    a: 'Most states offer Child Care Development Block Grant (CCDBG)-funded subsidies for low- and moderate-income families, typically capped around 85% of state median income. Eligibility and copay schedules vary by state. Find your state\'s application portal via the federal Child Care Technical Assistance Network at childcareta.acf.hhs.gov.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="Childcare Subsidy & Tax Credit Calculator"
        description="Estimate the federal CDCTC and dependent-care FSA savings on your annual childcare bill."
        url={URL}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Childcare subsidy & tax credit', url: URL },
        ]}
      />
      <VisibleBreadcrumbs
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Tax & FSA', url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Tax & subsidy</p>
            <h1 className="h1 text-ink-900">
              How much of your childcare bill can you get back?
            </h1>
            <p className="lede mt-4">
              Estimate the federal Child & Dependent Care Tax Credit (CDCTC) plus
              dependent-care FSA savings — the two biggest levers most families
              miss. Updated for the 2026 tax year.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <SubsidyCalculator />
        <div className="mt-6">
          <Disclaimer>
            <strong>Planning estimate, not tax advice.</strong> Marginal tax
            bracket is estimated from AGI; the IRS computes your actual credit
            from taxable income. State credits, ACTC interactions, and the
            Saver's Credit are not modeled. Talk to a CPA for your filing.
          </Disclaimer>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>How the federal pieces fit together</h2>
          <p>
            For 2026, the most common stack for working parents paying for
            childcare is the dependent-care FSA at work, followed by the federal
            Child & Dependent Care Tax Credit on what the FSA didn't cover.
            They don't double-dip — every dollar runs through one or the other,
            not both.
          </p>
          <h3>1. Dependent Care FSA — pre-tax salary reduction</h3>
          <ul>
            <li>Elected during open enrollment, deducted pre-tax from paychecks.</li>
            <li><strong>2026 cap: $7,500 per household</strong> (single, head-of-household, and married filing jointly), $3,750 if married filing separately. Raised from $5,000 / $2,500 under the One Big Beautiful Bill Act — the first increase since 1986.</li>
            <li>Saves: marginal federal income tax + 7.65% FICA + most state taxes.</li>
            <li>For a family in the 22% bracket, $7,500 in the FSA ≈ $2,225 in tax savings.</li>
            <li>Use-it-or-lose-it: unspent dollars are forfeited at year-end (some plans allow a carryover or 2.5-month grace period — check your SPD).</li>
          </ul>
          <h3>2. CDCTC — non-refundable federal credit</h3>
          <ul>
            <li>Applies to qualifying childcare spend <em>not</em> already run through the FSA.</li>
            <li>Qualifying spend cap: $3,000 (one child) / $6,000 (two or more).</li>
            <li>
              <strong>2026 rate (OBBBA): 50% maximum</strong> at AGI ≤ $15,000 (single/HOH) or $30,000 (MFJ).
              The schedule is a two-phase step: rate drops 1pp per $2,000 (single/HOH) / $4,000 (MFJ) above
              that threshold until it hits a 35% floor (~$43k single / ~$86k MFJ); holds flat at 35% up
              to $75,000 / $150,000; then drops 1pp per same step until it hits a 20% floor at $105k+
              single / $210k+ MFJ.
            </li>
            <li>Most middle-income families with one child land between 20–35%, so the federal credit typically tops out at $600–$1,050 with one child and $1,200–$2,100 with two or more after maxing the FSA.</li>
            <li>Non-refundable: it can reduce your tax bill to zero but doesn't generate a refund beyond that. Low-income families who already owe no federal tax may get $0 from this credit — but may qualify for state subsidies that do pay out.</li>
          </ul>
          <h3>3. State CDCTC equivalents (stack on top)</h3>
          <p>
            About 25 states offer their own version. Some are refundable
            (Minnesota, Vermont, New York above certain incomes), which is more
            valuable than the federal version for low-income families. California's
            credit ranges from 30–50% of the federal credit; Oregon's "Working
            Family Household and Dependent Care Credit" is refundable and
            generous; New York's credit is up to 110% of the federal CDCTC for
            very low-income filers.
          </p>
          <h3>4. State-funded subsidies (CCDBG)</h3>
          <p>
            Lower-income families may qualify for direct childcare subsidy
            programs funded by the federal Child Care Development Block Grant
            and administered by each state. Eligibility is typically capped
            around 85% of state median income, with copays scaled to income.
            These are <em>distinct</em> from the tax credits above and do not
            require waiting for tax season — they reduce the bill directly each
            month at a participating provider.
          </p>
        </div>

        <div className="mt-8">
          <EmailCapture
            title="Want a tax & subsidy checklist for your state?"
            subtitle="We'll send the state-by-state CDCTC equivalents, CCDBG eligibility thresholds, and a printable 'questions for HR' sheet for open enrollment season."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/childcare-calculator" className="btn btn-accent inline-flex">
            Estimate your childcare bill <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/state-childcare-costs" className="btn btn-ghost inline-flex">
            Compare costs by state
          </Link>
        </div>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16 max-w-3xl">
        <SectionHeader title="Frequently asked questions" eyebrow="FAQ" />
        <div className="mt-6">
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
