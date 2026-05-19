'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Calculator } from 'lucide-react';

// `priority` controls which links stay visible at tablet (md) breakpoints.
// The lower-priority links collapse into the burger on md but reappear on lg.
const navItems: { href: string; label: string; priority: 'high' | 'normal' }[] = [
  { href: '/', label: 'Home', priority: 'high' },
  { href: '/childcare-calculator', label: 'Childcare', priority: 'high' },
  { href: '/diaper-calculator', label: 'Diapers', priority: 'normal' },
  { href: '/formula-vs-breastfeeding-calculator', label: 'Feeding', priority: 'normal' },
  { href: '/baby-gear-budget', label: 'Gear', priority: 'normal' },
  { href: '/birth-insurance-planner', label: 'Birth & Insurance', priority: 'normal' },
  { href: '/childcare-subsidy-calculator', label: 'Tax credits', priority: 'normal' },
  { href: '/maternity-leave-by-state', label: 'Leave', priority: 'normal' },
  { href: '/state-childcare-costs', label: 'By State', priority: 'high' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-cream supports-[backdrop-filter]:bg-cream/80 supports-[backdrop-filter]:backdrop-blur-md border-b border-ink-100">
      <div className="container-pg flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="inline-flex w-8 h-8 rounded-lg bg-teal-500 text-white items-center justify-center">
            <Calculator className="w-4 h-4" />
          </span>
          <span>FirstYearCost</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-md transition ${n.priority === 'normal' ? 'hidden lg:inline-flex' : ''}`}
            >
              {n.label}
            </Link>
          ))}
          <button
            className="lg:hidden px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-md transition"
            aria-label="More menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            More
          </button>
          <Link href="/#calculator" className="btn btn-accent ml-2 text-sm py-2">
            Start estimate
          </Link>
        </nav>
        <button
          className="md:hidden p-2 -mr-2 rounded-md hover:bg-ink-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-ink-100 bg-white">
          <nav className="container-pg py-3 grid gap-1">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/#calculator"
              onClick={() => setOpen(false)}
              className="btn btn-accent mt-2 text-sm"
            >
              Start estimate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
