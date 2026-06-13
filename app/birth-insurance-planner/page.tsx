import type { Metadata } from 'next';
import { BirthInsuranceCalculator } from '@/components/BirthInsuranceCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Birth & Insurance Out-of-Pocket Planner',
  description:
    'Plan birth and newborn out-of-pocket costs by insurance type and delivery type. Includes question lists for your insurer and hospital billing.',
  path: '/birth-insurance-planner',
});

const faq: FAQItem[] = [
  {
    q: 'How much does it cost to have a baby with insurance?',
    a: 'KFF\'s August 2024 analysis found that women with employer coverage who give birth incur about $18,865 in additional health costs across pregnancy, birth, and postpartum care, of which roughly $2,854 is paid out-of-pocket. Vaginal delivery alone averages about $15,712 ($2,563 OOP) and a C-section averages about $28,998 ($3,071 OOP) according to Peterson-KFF. Marketplace plans typically have higher deductibles and OOP maximums. Your specific bill depends heavily on your plan.',
  },
  {
    q: 'How much more does a C-section cost than a vaginal delivery?',
    a: 'C-sections are typically 30–60% more expensive in total billed amount than uncomplicated vaginal deliveries, due to surgery, longer hospital stay, and anesthesia. Out-of-pocket impact depends on your plan — once you hit your OOP max, additional costs are capped.',
  },
  {
    q: "What if I'm uninsured?",
    a: 'Many states automatically enroll pregnant individuals in Medicaid or CHIP if income qualifies — check healthcare.gov or your state Medicaid office before assuming uninsured costs. Hospitals often have financial assistance and cash discounts; ask billing directly. The uninsured ranges in this calculator reflect typical billed amounts, not what you might end up paying after assistance.',
  },
  {
    q: 'Will my baby be covered by my insurance from birth?',
    a: 'The birth of a child triggers a special enrollment period under federal law. Group employer plans typically give 30 days (sometimes 60) to add a newborn from the date of birth, and HealthCare.gov marketplace plans allow up to 60 days, with coverage usually retroactive to the birth date. Confirm the deadline and required paperwork with your insurer before delivery — late enrollment can mean coverage gaps. (See HealthCare.gov special enrollment.)',
  },
  {
    q: 'What is "balance billing" and how do I avoid it?',
    a: 'Balance billing happens when an out-of-network provider bills you for the difference between their charge and what your insurer paid. The federal No Surprises Act (effective January 2022) protects against most surprise bills for emergency and certain in-network hospital care, but always confirm in-network status of the hospital, OB, anesthesiologist, and pediatrician separately. (See cms.gov/nosurprises.)',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Birth & insurance planner', url: 'https://firstyearcost.com/birth-insurance-planner' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-coral mb-3">Specialized calculator</p>
            <h1 className="h1 text-ink-900">Birth & insurance out-of-pocket planner</h1>
            <p className="lede mt-4">
              Plan birth and newborn medical costs by insurance type and delivery type — with
              the right questions to ask your insurer and hospital before the bill arrives.
            </p>
          </div>
        </div>
      </section>

      <div className="container-pg pb-10">
        <BirthInsuranceCalculator />
      </div>

      <div className="container-pg my-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="Understanding your bill before delivery" eyebrow="How insurance works" />
        <div className="prose-custom mt-6 max-w-3xl">
          <h3>The four numbers that decide your OOP</h3>
          <p>
            Your final out-of-pocket on delivery comes down to four things: your <strong>deductible</strong> (what
            you pay before insurance starts contributing), your <strong>coinsurance</strong> (your % share after
            deductible), your <strong>OOP max</strong> (the cap), and whether the <strong>newborn has a separate
            deductible</strong>. If you've already met your deductible earlier in the year, your delivery bill can
            be dramatically lower than someone who's starting fresh.
          </p>
          <h3>Why a single hospital can produce wildly different bills</h3>
          <p>
            The hospital, the OB practice, the anesthesiologist, and the pediatric group are often separate billing
            entities — and any one of them can be out-of-network even if the hospital itself is in-network. Always
            confirm each piece individually before delivery. The federal No Surprises Act protects against many
            surprise bills, but it doesn't cover everything.
          </p>
          <h3>Cash discounts and financial assistance</h3>
          <p>
            Many hospitals offer a self-pay or prompt-pay discount — patient-advocate organizations report typical
            negotiated reductions of around 10–50% if you pay before or at delivery — and most have income-based
            financial assistance programs. If you're paying out-of-pocket, always ask about both — these are
            negotiated, not advertised.
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
