'use client';

import { InfoTip, type TipContent } from './InfoTip';

type Option<T extends string> = { value: T; label: string; info?: TipContent };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  ariaLabel?: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        // Visually de-emphasize the "unsure"/"unknown" option until it's selected.
        const isUncertainty =
          opt.value === 'unsure' || opt.value === 'unknown';
        const muted = isUncertainty && value !== opt.value ? 'opacity-70' : '';
        const button = (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={`${value === opt.value ? 'active' : ''} ${muted} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
        return opt.info ? (
          <InfoTip key={opt.value} content={opt.info}>
            {button}
          </InfoTip>
        ) : button;
      })}
    </div>
  );
}
