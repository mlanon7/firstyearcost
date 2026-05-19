'use client';

import { useId } from 'react';

// Range slider with a reliable filled-track gradient.
//
// The gradient is computed in JS on every render and applied via inline style,
// so the track fill always tracks the value. We avoided the CSS-custom-property
// indirection pattern because some browsers don't repaint the gradient when
// only the var changes.
//
// Accessibility: the input has its own generated id. If callers want to point
// a <label htmlFor> at it, they can pass `id` explicitly to override.

export function Slider({
  id: idProp,
  value, min, max, step = 1, onChange, suffix, ariaLabel, disabled = false,
}: {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const autoId = useId();
  const id = idProp ?? `slider-${autoId}`;
  const pct = Math.max(0, Math.min(100, ((value - min) / Math.max(1, max - min)) * 100));
  const filled = disabled ? 'rgb(199 154 110)' : 'rgb(199 95 62)';
  const empty  = 'rgb(234 220 200)';
  const trackBg = `linear-gradient(to right, ${filled} 0%, ${filled} ${pct}%, ${empty} ${pct}%, ${empty} 100%)`;

  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-60' : ''}`}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-valuetext={`${value}${suffix ? ' ' + suffix : ''}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fyc-range"
        style={{ background: trackBg }}
      />
      <span className="text-sm font-semibold text-ink-900 w-16 text-right tabular-nums">
        {value}{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  );
}
