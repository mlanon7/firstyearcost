'use client';

import { Info } from 'lucide-react';
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
        // Visually de-emphasize the "unsure"/"unknown" option until selected.
        const isUncertainty = opt.value === 'unsure' || opt.value === 'unknown';
        const muted = isUncertainty && value !== opt.value ? 'opacity-70' : '';
        const isActive = value === opt.value;

        return (
          <span key={opt.value} className="segmented-item">
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`chip ${isActive ? 'active' : ''} ${muted}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
            {opt.info && (
              <InfoTip content={opt.info}>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`More about ${opt.label}`}
                  className="info-trigger"
                  onClick={(e) => e.preventDefault()}
                >
                  <Info className="w-3 h-3" aria-hidden />
                </button>
              </InfoTip>
            )}
          </span>
        );
      })}
    </div>
  );
}
