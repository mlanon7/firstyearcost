import type { Metadata } from 'next';
import { GearCalculator } from '@/components/GearCalculator';
import { AdSlot } from '@/components/AdSlot';
import { SectionHeader } from '@/components/SectionHeader';
import { FAQ, FAQSchema, type FAQItem } from '@/components/FAQ';
import { NextStepCTA } from '@/components/NextStepCTA';
import { BreadcrumbsJsonLd } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Baby Gear Budget Planner — What to Buy Before Birth',
  description:
    'Plan your baby gear budget by tier and registry coverage. Includes must-have-before-birth checklist and what to buy new for safety vs. take secondhand.',
  alternates: { canonical: '/baby-gear-budget' },
  openGraph: {
    title: 'Baby Gear Budget Planner — What to Buy Before Birth',
    description:
      'Plan your baby gear budget by tier and registry coverage. Must-have checklist + what to buy new for safety.',
    url: '/baby-gear-budget',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Gear Budget Planner',
    description:
      'Plan your baby gear budget by tier and registry coverage. Must-have-before-birth checklist included.',
  },
};

const faq: FAQItem[] = [
  {
    q: 'What baby items do I really need before birth?',
    a: 'A short list: an infant car seat (correctly installed), a safe sleep space with a new mattress, a thermometer, 8–10 onesies, 3–5 sleep outfits, diapers and wipes, and either bottles or breastfeeding supplies depending on your plan. Almost everything else can wait days or weeks if needed.',
  },
  {
    q: 'Which baby items should I always buy new?',
    a: "Car seats and crib mattresses, both for safety reasons. Car seats can have invisible damage from crashes and have expiration dates; crib mattresses should be firm and unused per AAP guidance. Many families also buy bottle nipples and pacifiers new and replace them on the manufacturer's schedule.",
  },
  {
    q: "What's safe to buy used or accept as a hand-me-down?",
    a: 'Strollers, bouncers, swings, play mats, dressers, baby carriers in good condition, books, toys, and especially clothes — babies outgrow most clothes in weeks. Always check for any recall on the specific model before using a hand-me-down.',
  },
  {
    q: 'How much does registry help actually offset?',
    a: 'Industry estimates from baby registry platforms put typical fulfillment somewhere around 30–60% of registry items as gifts, with bigger showers and larger families pushing the high end. Setting your registry "help" level adjusts the out-of-pocket gear estimate accordingly.',
  },
  {
    q: 'Do I need a bassinet AND a crib?',
    a: 'No. Many families use a bassinet for the first 3–4 months because it fits in the bedroom, then transition to a crib. Some skip the bassinet entirely and start with the crib. The AAP\'s 2022 safe-sleep policy recommends room-sharing (not bed-sharing) ideally for at least the first 6 months for SIDS risk reduction.',
  },
];

export default function Page() {
  return (
    <>
      <FAQSchema items={faq} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: 'https://firstyearcost.com/' },
          { name: 'Baby gear budget', url: 'https://firstyearcost.com/baby-gear-budget' },
        ]}
      />
      <section className="hero-bg">
        <div className="container-pg pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="max-w-2xl">
            <p className="pill pill-teal mb-3">Specialized calculator</p>
            <h1 className="h1 text-ink-900">Baby gear budget planner</h1>
            <p className="lede mt-4">
              Plan your gear by tier and registry help. We flag what to buy new for safety
              and what's fine to take secondhand.
            </p>
          </div>
        </div>
      </section>

      <div className="container-pg pb-10">
        <GearCalculator />
      </div>

      <div className="container-pg my-10">
        <AdSlot size="leaderboard" label="Sponsored" />
      </div>

      <section className="container-pg pb-16">
        <SectionHeader title="The honest gear philosophy" eyebrow="What matters" />
        <div className="prose-custom mt-6 max-w-3xl">
          <h3>Buy fewer, better, when you can</h3>
          <p>
            Newborns don't need most of what's marketed at them. The real heavy hitters in your gear budget are
            the car seat, stroller, crib, mattress, monitor, and feeding gear. Splurge there. Almost everything
            else can be budget tier or hand-me-down without affecting safety or comfort.
          </p>
          <h3>Wait on the "phase" gear</h3>
          <p>
            High chairs, exersaucers, and walkers don't get used until 4–6 months at the earliest. Buying these
            before birth means storing bulky items you can't use yet. Wait, then buy what fits your space and baby.
          </p>
          <h3>Safety isn't optional</h3>
          <p>
            Cribs and crib mattresses must meet current CPSC standards. Car seats have expiration dates and should
            never be used after a moderate or severe crash. Sleep products beyond a flat, firm crib mattress are
            not recommended by the AAP for unsupervised infant sleep — including inclined sleepers, loungers, and
            in-bed positioners.
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
