'use client';

import { useState } from 'react';
import { ArrowRight, Mail, CheckCircle2, Clock } from 'lucide-react';
import { track } from '@/lib/analytics';

// Email capture for the downloadable budget workbook lead magnet.
// Submits to NEXT_PUBLIC_NEWSLETTER_ENDPOINT (e.g. ConvertKit form URL,
// Buttondown, Beehiiv, or a Next API route).
//
// When NEXT_PUBLIC_NEWSLETTER_ENDPOINT is unset (typical pre-launch), the
// component renders an honest "coming soon" state instead of accepting an
// email. We previously faked a success here, which falsely told users that
// a workbook was on the way — fixed.

const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export function EmailCapture({
  variant = 'card',
  title = 'Get the free first-year budget workbook',
  subtitle = 'A printable XLSX template pre-filled with our state-aware ranges. Update the numbers as your situation firms up. No spam, unsubscribe with one click.',
}: {
  variant?: 'card' | 'inline';
  title?: string;
  subtitle?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ENDPOINT) return; // Endpoint not configured — UI should never reach this branch
    setStatus('submitting');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus('ok');
      track('newsletter_signup', { mode: 'submitted' });
    } catch {
      setStatus('error');
    }
  }

  // No newsletter provider wired yet — render an honest "coming soon" card.
  if (!ENDPOINT) {
    return (
      <div className={variant === 'card' ? 'card p-6' : ''}>
        <div className="flex items-start gap-3">
          <span className="inline-flex w-10 h-10 rounded-xl bg-sun-100 text-sun-800 items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h3 className="h4 text-ink-900">Budget workbook — coming soon</h3>
            <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
              We're finishing the downloadable XLSX workbook and the newsletter
              flow. We're not collecting emails yet — when the workbook is ready
              you'll see the signup form here. In the meantime, every cost
              table behind these calculators is already downloadable as CSV
              from <a href="/methodology" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">our methodology page</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ok') {
    return (
      <div className={`${variant === 'card' ? 'card p-6' : ''} flex items-start gap-3`}>
        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-ink-900">You're on the list.</p>
          <p className="text-sm text-ink-600 mt-1">
            We'll email the budget workbook within 24 hours. Check your spam folder if you don't see it.
          </p>
        </div>
      </div>
    );
  }

  const inner = (
    <>
      <div className="flex items-start gap-3">
        <span className="inline-flex w-10 h-10 rounded-xl bg-teal-100 text-teal-700 items-center justify-center shrink-0">
          <Mail className="w-5 h-5" />
        </span>
        <div>
          <h3 className="h4 text-ink-900">{title}</h3>
          <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="ec-email">Email address</label>
        <input
          id="ec-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-accent disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : <>Send me the workbook <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-sm text-coral-700">
          Something went wrong. Please try again or email hello@firstyearcost.com.
        </p>
      )}
      <p className="mt-2 text-xs text-ink-500">
        We use your email only to send the workbook and occasional updates to our cost data. Unsubscribe any time.
      </p>
    </>
  );

  return variant === 'card' ? <div className="card p-6">{inner}</div> : <div>{inner}</div>;
}
