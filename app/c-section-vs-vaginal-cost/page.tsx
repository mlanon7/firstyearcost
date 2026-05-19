import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { AdSlot } from '@/components/AdSlot';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { Disclaimer } from '@/components/Disclaimer';
import { birthOOPRanges, birthBilledAnchors } from '@/data/assumptions';
import { formatUSD } from '@/lib/format';
import { BreadcrumbsJsonLd, ArticleJsonLd } from '@/components/Breadcrumbs';

const URL = 'https://firstyearcost.com/c-section-vs-vaginal-cost';

export const metadata: Metadata = {
  title: 'C-Section vs. Vaginal Birth Cost (2026) — With and Without Insurance',
  description:
    'How much does each type of delivery actually cost in 2026 — billed totals, employer-plan out-of-pocket, marketplace, Medicaid, and uninsured. Sourced from KFF/Peterson-KFF benchmarks.',
  alternates: { canonical: '/c-section-vs-vaginal-cost' },
  openGraph: {
    title: 'C-Section vs. Vaginal Birth Cost (2026)',
    description:
      "Billed totals, employer-plan OOP, marketplace, Medicaid, and uninsured ranges — by delivery type. Plus the questions to ask your insurer.",
    url: '/c-section-vs-vaginal-cost',
    type: 'article',
  },
};

const faq: FAQItem[] = [
  {
    q: 'How much more does a C-section cost than a vaginal delivery?',
    a: "On the billed side, a C-section typically runs roughly $10,000–$15,000 more than a vaginal delivery — Peterson-KFF benchmarks place billed totals around $29,000 for cesarean delivery and $16,000 for vaginal delivery on employer plans. After insurance, the gap is smaller: out-of-pocket usually runs a few hundred to a couple thousand dollars more for a C-section, because most birthing parents hit their out-of-pocket maximum regardless of delivery type.",
  },
  {
    q: 'Does my insurance cover a planned C-section?',
    a: "Yes, if it's medically indicated. ACA-compliant plans (including all marketplace plans and most employer plans) cover both vaginal and cesarean deliveries as essential health benefits. Elective C-sections without medical indication may face partial coverage — call your insurer and ask explicitly: 'Is a maternal-request cesarean covered, and at what cost-share?'",
  },
  {
    q: 'Why are the OOP ranges so wide?',
    a: "Three big variables: (1) how much of your deductible and out-of-pocket max you've already met this plan year, (2) whether the hospital and anesthesiologist are in-network — out-of-network anesthesia is a classic surprise bill, though the No Surprises Act now caps most of these, (3) whether the newborn has a separate deductible on your plan (some plans treat the baby as a new covered person with their own deductible from day one).",
  },
  {
    q: 'Is uninsured C-section worth the discount?',
    a: "Many nonprofit hospitals offer 'cash discount' or financial-assistance rates for uninsured patients; the size of the discount varies widely by hospital and isn't publicly standardized — ask the billing office directly and request their financial-assistance policy in writing. Even with a discount, vaginal delivery can leave you on the hook for several thousand dollars and a C-section for considerably more. Compare against marketplace premium subsidies: for 2026 ACA marketplace plans, the federal cap on in-network annual out-of-pocket is $10,600 per individual ($21,200 per family), and many uninsured parents qualify for premium subsidies that make a marketplace plan cheaper than self-paying for a birth.",
  },
  {
    q: 'Should I switch insurance plans before giving birth?',
    a: "Only during open enrollment, after a qualifying life event, or to Medicaid if you become eligible. Pregnancy itself is not a Special Enrollment Period qualifying event (the birth is — for adding the baby). Before switching, model the total OOP under each plan with our birth & insurance planner. A high-deductible plan with HSA may beat a low-deductible plan even for a birth year if premiums are dramatically lower.",
  },
  {
    q: 'What about doula, lactation consultant, and postpartum costs?',
    a: "These are usually out-of-pocket: doula $800-$2,500, in-home lactation consultant $150-$300/visit, postpartum doula $25-$60/hour. ACA plans cover one breast pump per pregnancy. Some marketplace plans now cover doula services (CA, NY, NJ, OR, and others). Check 'Maternity and Newborn Care' details in your Summary of Benefits.",
  },
];

export default function Page() {
  const employerVag = birthOOPRanges.employer.vaginal;
  const employerCS = birthOOPRanges.employer.csection;
  const marketVag = birthOOPRanges.marketplace.vaginal;
  const marketCS = birthOOPRanges.marketplace.csection;
  const medVag = birthOOPRanges.medicaid.vaginal;
  const medCS = birthOOPRanges.medicaid.csection;
  const uninsVag = birthOOPRanges.uninsured.vaginal;
  const uninsCS = birthOOPRanges.uninsured.csection;
  const billedVag = birthBilledAnchors.vaginal;
  const billedCS = birthBilledAnchors.csection;

  return (
    <>
      <FAQSchema items={faq} />
      <ArticleJsonLd
        title="C-Section vs. Vaginal Birth Cost (2026)"
        description="Billed totals and out-of-pocket ranges by delivery type and insurance coverage."
        url={URL}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'C-section vs vaginal cost', url: URL },
        ]}
      />

      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-3xl">
            <p className="pill pill-teal mb-3">Birth cost comparison</p>
            <h1 className="h1 text-ink-900">
              C-section vs. vaginal birth: what each actually costs in 2026.
            </h1>
            <p className="lede mt-4">
              Billed totals, employer-plan out-of-pocket, marketplace,
              Medicaid, and uninsured — broken down by delivery type. Plus
              the specific questions to ask your insurer before week 36.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/birth-insurance-planner" className="btn btn-accent">
                Plan your specific OOP <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pg pb-10">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Scenario</th>
                  <th className="text-right font-semibold px-4 py-3">Vaginal</th>
                  <th className="text-right font-semibold px-4 py-3">C-section</th>
                  <th className="text-right font-semibold px-4 py-3 hidden sm:table-cell">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 tabular-nums">
                <CompareRow
                  label="Billed total (before insurance)"
                  v={formatUSD(billedVag)}
                  c={formatUSD(billedCS)}
                  diff={`+${formatUSD(billedCS - billedVag)}`}
                  note="Hospital + physician + anesthesia + newborn nursery. Source: KFF/Peterson-KFF 2024 benchmarks."
                />
                <CompareRow
                  label="Employer plan OOP"
                  v={`${formatUSD(employerVag.low)}–${formatUSD(employerVag.high)}`}
                  c={`${formatUSD(employerCS.low)}–${formatUSD(employerCS.high)}`}
                  diff={`mid +${formatUSD(employerCS.mid - employerVag.mid)}`}
                  note="Typical mid-range OOP after deductible and coinsurance."
                />
                <CompareRow
                  label="Marketplace (ACA) plan OOP"
                  v={`${formatUSD(marketVag.low)}–${formatUSD(marketVag.high)}`}
                  c={`${formatUSD(marketCS.low)}–${formatUSD(marketCS.high)}`}
                  diff={`mid +${formatUSD(marketCS.mid - marketVag.mid)}`}
                  note="Silver/Gold tier; varies widely with plan and subsidy."
                />
                <CompareRow
                  label="Medicaid OOP"
                  v={`${formatUSD(medVag.low)}–${formatUSD(medVag.high)}`}
                  c={`${formatUSD(medCS.low)}–${formatUSD(medCS.high)}`}
                  diff="≈ same — Medicaid covers labor and delivery in full in nearly all states."
                />
                <CompareRow
                  label="Uninsured (cash pay)"
                  v={`${formatUSD(uninsVag.low)}–${formatUSD(uninsVag.high)}`}
                  c={`${formatUSD(uninsCS.low)}–${formatUSD(uninsCS.high)}`}
                  diff="Large; depends on hospital cash discount policy."
                />
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          Numbers are planning ranges, not bills. Anchored to Peterson-KFF Health System Tracker employer-plan averages for vaginal and cesarean delivery, and the 2026 ACA cost-sharing limits set by the{' '}
          <a href="https://www.federalregister.gov/documents/2025/06/25/2025-11606/patient-protection-and-affordable-care-act-marketplace-integrity-and-affordability" target="_blank" rel="noopener" className="underline">HHS/CMS Marketplace Integrity and Affordability Final Rule</a>
          {' '}(Federal Register 2025-11606, published June 25 2025) — which revised the original 2026 NBPP limits of $10,150/$20,300 upward to $10,600/$21,200. Marketplace and uninsured rows are directional; local hospital pricing varies widely. Last reviewed 2026-05-18.
        </p>
      </section>

      <div className="container-pg my-6">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-12 max-w-3xl">
        <div className="prose-custom">
          <h2>Why the gap exists</h2>
          <p>
            A C-section is major abdominal surgery. The cost stack adds an
            operating room, surgical team, anesthesia, more nursing time,
            and a longer hospital stay (typically 3 nights vs. 2 for vaginal).
            That's the source of the ~$10,000 billed gap. Once insurance
            applies, the gap compresses sharply because most birthing parents
            hit their out-of-pocket maximum regardless of delivery type — so
            the marginal OOP cost of a C-section vs. vaginal is often $500–$1,200,
            not $10,000.
          </p>

          <h2>The 6 questions to ask your insurer before week 36</h2>
          <ol>
            <li><strong>What is my current deductible balance and out-of-pocket max?</strong> Both reset each plan year. If you'll cross plan-year boundaries during pregnancy, the math gets complex.</li>
            <li><strong>Is the hospital and OB in-network? What about the anesthesiologist?</strong> Anesthesia is the classic out-of-network surprise. The No Surprises Act caps it in most cases but ask anyway.</li>
            <li><strong>Does the newborn have a separate deductible?</strong> Some plans treat the baby as a new covered person with their own deductible from birth.</li>
            <li><strong>What is the cost-share for newborn nursery?</strong> Usually covered, but the level-of-care code matters (well-baby vs. NICU).</li>
            <li><strong>Is a doula or lactation consultant covered?</strong> Some plans now reimburse; check the maternity benefits page.</li>
            <li><strong>Will the breast pump be covered, and which models?</strong> ACA mandates one pump per pregnancy; brands and timing (before/after birth) vary by plan.</li>
          </ol>

          <h2>If you're uninsured</h2>
          <p>
            Before paying cash, check three things:
          </p>
          <ul>
            <li><strong>Medicaid for Pregnant Women</strong> — eligibility extends higher than regular Medicaid in every state (typically 138–200% of FPL). It's retroactive in most states, so you can apply after the birth and have the bill covered.</li>
            <li><strong>Marketplace Special Enrollment Period</strong> — pregnancy itself doesn't trigger SEP federally, but loss of other coverage does. After birth, you can add the baby and re-enroll for the family.</li>
            <li><strong>Hospital financial assistance</strong> — most nonprofit hospitals are required to offer charity care below certain income thresholds. The application is not advertised; you must ask the billing office specifically.</li>
          </ul>
        </div>

        <div className="mt-8">
          <Disclaimer>
            <strong>Not medical or insurance advice.</strong> Plan terms,
            network status, and benefits change. Confirm coverage with your
            insurer and provider before relying on any number on this page.
          </Disclaimer>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/birth-insurance-planner" className="btn btn-accent inline-flex">
            Run your specific birth OOP planner <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/#calculator" className="btn btn-ghost inline-flex">
            Full first-year calculator
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

function CompareRow({
  label, v, c, diff, note,
}: { label: string; v: string; c: string; diff: string; note?: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top">
        <p className="font-medium text-ink-900">{label}</p>
        {note && <p className="mt-1 text-xs text-ink-500 leading-snug font-normal">{note}</p>}
      </td>
      <td className="px-4 py-3 text-right text-ink-700">{v}</td>
      <td className="px-4 py-3 text-right text-ink-900 font-semibold">{c}</td>
      <td className="px-4 py-3 text-right text-teal-700 hidden sm:table-cell">{diff}</td>
    </tr>
  );
}
