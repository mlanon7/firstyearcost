import Link from 'next/link';
import { Calculator } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-24">
      <div className="container-pg py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-flex w-8 h-8 rounded-lg bg-teal-500 text-white items-center justify-center">
              <Calculator className="w-4 h-4" />
            </span>
            FirstYearCost
          </Link>
          <p className="mt-3 text-sm text-ink-600 max-w-sm leading-relaxed">
            Realistic, source-backed estimates for what a baby may cost in the first 12 months.
            Built for expecting parents who want a planning number, not a guess.
          </p>
          <p className="mt-4 text-xs text-ink-500 leading-relaxed max-w-sm">
            FirstYearCost.com provides planning estimates, not medical, insurance, legal, or financial
            advice. Actual costs vary by location, provider, insurance plan, and family choices.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 mb-3">Calculators</h4>
          <ul className="text-sm space-y-2 text-ink-600">
            <li><Link href="/" className="hover:text-ink-900">First-year total</Link></li>
            <li><Link href="/childcare-calculator" className="hover:text-ink-900">Childcare</Link></li>
            <li><Link href="/diaper-calculator" className="hover:text-ink-900">Diapers</Link></li>
            <li><Link href="/formula-vs-breastfeeding-calculator" className="hover:text-ink-900">Feeding</Link></li>
            <li><Link href="/baby-gear-budget" className="hover:text-ink-900">Gear budget</Link></li>
            <li><Link href="/birth-insurance-planner" className="hover:text-ink-900">Birth & insurance</Link></li>
            <li><Link href="/childcare-subsidy-calculator" className="hover:text-ink-900">Tax credit & FSA</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900 mb-3">Resources</h4>
          <ul className="text-sm space-y-2 text-ink-600">
            <li><Link href="/monthly-baby-budget" className="hover:text-ink-900">Month-by-month budget</Link></li>
            <li><Link href="/state-childcare-costs" className="hover:text-ink-900">Childcare by state</Link></li>
            <li><Link href="/maternity-leave-by-state" className="hover:text-ink-900">Maternity leave by state</Link></li>
            <li><Link href="/daycare-vs-nanny-cost" className="hover:text-ink-900">Daycare vs. nanny</Link></li>
            <li><Link href="/c-section-vs-vaginal-cost" className="hover:text-ink-900">C-section vs. vaginal cost</Link></li>
            <li><Link href="/second-baby-cost" className="hover:text-ink-900">Second-baby cost</Link></li>
            <li><Link href="/registry-essentials" className="hover:text-ink-900">Registry essentials</Link></li>
            <li><Link href="/methodology" className="hover:text-ink-900">Methodology</Link></li>
            <li><Link href="/faq" className="hover:text-ink-900">FAQ</Link></li>
            <li><Link href="/privacy" className="hover:text-ink-900">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-ink-900">Terms</Link></li>
            <li><a href="mailto:hello@firstyearcost.com" className="hover:text-ink-900">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="container-pg py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} FirstYearCost. All rights reserved.</p>
          <p>Made for parents planning the first 12 months.</p>
        </div>
      </div>
    </footer>
  );
}
