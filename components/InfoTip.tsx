'use client';

import { useEffect, useId, useRef, useState } from 'react';

// Accessible, opt-in info popover.
//
// Trigger contract: this component wraps a small icon button (the ⓘ next to
// each chip in Segmented). We deliberately do NOT trigger on the chip body —
// only on the icon — so users selecting options quickly aren't bombarded by
// tooltips. The icon is small and out of the natural sweep path, so even a
// casual mouse-over rarely lands on it.
//
// Interaction:
//   - Hover/focus opens after OPEN_DELAY (350ms — long enough that a flyover
//     doesn't trigger, short enough that a deliberate hover feels responsive).
//   - Closes after CLOSE_DELAY (180ms) once the pointer leaves both the icon
//     and the popover — so users can move into the popover to read it.
//   - Tap on the icon toggles immediately on touch devices.
//   - Escape closes; outside-click closes.
//
// Visual: warm cream card with terracotta accents and a soft fade-slide-in,
// keyed by the `.infotip-card` class in globals.css.

const OPEN_DELAY = 350;
const CLOSE_DELAY = 180;

export type TipContent = {
  summary: string;
  covers?: string[];
  bestFor?: string[];
  tradeoffs?: string[];
  example?: string;
};

export function InfoTip({
  content,
  children,
  position = 'bottom',
}: {
  content: TipContent;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  function clearTimers() {
    if (openTimer.current)  { clearTimeout(openTimer.current);  openTimer.current  = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }

  function scheduleOpen() {
    if (open) return;
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY);
  }
  function scheduleClose() {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }
  function openNow() {
    clearTimers();
    setOpen(true);
  }

  // Outside click + Escape close
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

  // Cleanup any pending timers on unmount
  useEffect(() => () => clearTimers(), []);

  const placement = position === 'top'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
      onClick={(e) => {
        // Toggle on touch / explicit click of the icon trigger.
        e.preventDefault();
        if (open) { clearTimers(); setOpen(false); }
        else openNow();
      }}
      aria-describedby={open ? id : undefined}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`infotip-card ${placement}`}
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
        >
          <p className="text-sm font-semibold leading-snug text-ink-900">{content.summary}</p>
          {content.covers && content.covers.length > 0 && (
            <Section title="What it covers" items={content.covers} />
          )}
          {content.bestFor && content.bestFor.length > 0 && (
            <Section title="Best for" items={content.bestFor} />
          )}
          {content.tradeoffs && content.tradeoffs.length > 0 && (
            <Section title="Watch out for" items={content.tradeoffs} />
          )}
          {content.example && (
            <p className="mt-3 text-xs italic text-ink-600 leading-snug">{content.example}</p>
          )}
          <span className="infotip-arrow" aria-hidden />
        </span>
      )}
    </span>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">{title}</p>
      <ul className="mt-1 space-y-1 text-xs text-ink-700 leading-snug">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="text-teal-600 shrink-0 leading-tight" aria-hidden>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
