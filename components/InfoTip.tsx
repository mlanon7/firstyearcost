'use client';

import { useEffect, useId, useRef, useState } from 'react';

// Accessible info popover for option chips and labels.
//
// Interaction model:
//   - Desktop: hover or focus opens. 200ms close delay so users can move the
//     pointer into the popover without flicker.
//   - Mobile/touch: tap toggles. Tap outside or Escape closes.
//   - Keyboard: focus opens; Escape closes.
//
// Positioning: absolute below the trigger, centered. The popover is rendered
// inside the trigger's relative container — caller passes a `wrapperClassName`
// of `relative` if it isn't already.

export type TipContent = {
  /** Short one-line summary, bolded at the top of the popover. */
  summary: string;
  /** Bulleted "what it covers / includes" list. */
  covers?: string[];
  /** Bulleted "best for" list. */
  bestFor?: string[];
  /** Bulleted "tradeoffs / watch out for" list. */
  tradeoffs?: string[];
  /** A short concrete example, italicized. */
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  // Close on outside click (mobile)
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
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

  function show() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpen(true);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }

  const placement = position === 'top'
    ? 'bottom-full mb-2 origin-bottom'
    : 'top-full mt-2 origin-top';

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={scheduleClose}
      onFocus={show}
      onBlur={scheduleClose}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`absolute left-1/2 -translate-x-1/2 ${placement} z-50 w-72 sm:w-80 rounded-xl bg-ink-900 text-white shadow-pop p-4 text-left animate-fade-in pointer-events-auto`}
          onMouseEnter={show}
          onMouseLeave={scheduleClose}
        >
          <p className="text-sm font-semibold leading-snug">{content.summary}</p>
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
            <p className="mt-3 text-xs italic text-ink-300 leading-snug">{content.example}</p>
          )}
          <span
            className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-ink-900 rotate-45"
            aria-hidden
            style={position === 'top' ? { top: 'auto', bottom: '-6px' } : undefined}
          />
        </span>
      )}
    </span>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-300 font-semibold">{title}</p>
      <ul className="mt-1 space-y-1 text-xs text-ink-100 leading-snug">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="text-teal-300 shrink-0" aria-hidden>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
