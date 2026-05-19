'use client';

import { useEffect, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { TipContent } from './InfoTip';

// Section-level info popover. Renders ONE small (?) icon next to a field
// label; clicking opens a wider popover that lists every option for that
// section with its summary, bullets, and example.
//
// Why this instead of per-chip icons: 9 sections × 1 icon = 9 icons total
// on the calculator, vs. 40 icons sprinkled across every chip. Much cleaner
// visually while still surfacing the same rich content for any user who
// asks for it.
//
// Interaction:
//   - Click toggles open (works on touch and mouse).
//   - Hover with a small delay also opens — but the icon is small enough
//     and far enough from the chip sweep path that incidental hovers are
//     rare.
//   - Escape, outside-click, and blur close.

const OPEN_DELAY = 220;
const CLOSE_DELAY = 180;

export type OptionTip = { label: string; info: TipContent };

export function OptionsInfo({ options, sectionLabel }: { options: OptionTip[]; sectionLabel: string }) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  function clearTimers() {
    if (openTimer.current)  { clearTimeout(openTimer.current);  openTimer.current  = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        clearTimers();
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { clearTimers(); setOpen(false); }
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  if (options.length === 0) return null;

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
        if (!open) openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY);
      }}
      onMouseLeave={() => {
        if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
        closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
      }}
    >
      <button
        type="button"
        aria-label={`About the ${sectionLabel} options`}
        aria-expanded={open}
        className="info-trigger"
        onClick={(e) => {
          e.preventDefault();
          clearTimers();
          setOpen((v) => !v);
        }}
      >
        <HelpCircle className="w-3.5 h-3.5" aria-hidden />
      </button>
      {open && (
        <span
          role="dialog"
          aria-label={`${sectionLabel} options`}
          className="options-info-card top-full mt-2 left-0"
          onMouseEnter={() => {
            clearTimers();
            setOpen(true);
          }}
          onMouseLeave={() => {
            closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
          }}
        >
          <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">
            {sectionLabel}
          </p>
          <ul className="mt-3 space-y-4">
            {options.map((opt) => (
              <li key={opt.label}>
                <p className="text-sm font-semibold text-ink-900 leading-snug">{opt.label}</p>
                <p className="mt-1 text-xs text-ink-700 leading-snug">{opt.info.summary}</p>
                {opt.info.bestFor && opt.info.bestFor.length > 0 && (
                  <p className="mt-1 text-xs text-ink-500 leading-snug">
                    <span className="font-semibold text-ink-600">Best for: </span>
                    {opt.info.bestFor.join('; ')}
                  </p>
                )}
                {opt.info.example && (
                  <p className="mt-1 text-xs italic text-teal-700 leading-snug">{opt.info.example}</p>
                )}
              </li>
            ))}
          </ul>
          <span className="options-info-arrow" aria-hidden />
        </span>
      )}
    </span>
  );
}
