'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'fyc-cookie-consent-v1';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function persist(value: 'accept' | 'decline') {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setShow(false);
  }

  // Closing the banner without a choice should NOT persist a "decline" — that
  // silently locks the user into a decision they didn't make. Just hide for the
  // session; the banner will return on the next visit.
  function dismissForSession() {
    setShow(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md z-50 card p-4 shadow-pop animate-fade-in">
      <button
        aria-label="Close (decide later)"
        onClick={dismissForSession}
        className="absolute top-2 right-2 p-1 text-ink-400 hover:text-ink-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-sm font-semibold text-ink-900 pr-8">Cookies & analytics</h3>
      <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">
        We use cookies for basic analytics and to remember your choices. We don't sell personal data.
        See our <Link href="/privacy" className="underline">privacy policy</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => persist('accept')} className="btn btn-primary text-xs py-1.5 px-3">
          Accept all
        </button>
        <button onClick={() => persist('decline')} className="btn btn-ghost text-xs py-1.5 px-3">
          Decline
        </button>
      </div>
    </div>
  );
}
