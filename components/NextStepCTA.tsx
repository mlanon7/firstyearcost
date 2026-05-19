import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// A small, neutral CTA shown at the end of any calculator/state/content page
// to send users back to the full first-year estimator.
export function NextStepCTA({
  title = 'Want the full first-year estimate?',
  body = 'Run the main calculator with your state, insurance, feeding plan, and gear preferences for an integrated number.',
  href = '/#calculator',
  label = 'Open the full calculator',
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="container-pg pb-16">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="font-semibold text-ink-900 text-lg">{title}</h2>
          <p className="text-sm text-ink-600 mt-1 leading-relaxed">{body}</p>
        </div>
        <Link href={href} className="btn btn-primary text-sm shrink-0">
          {label} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
