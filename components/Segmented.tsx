'use client';

import { OptionsInfo, type OptionTip } from './OptionsInfo';
import type { TipContent } from './InfoTip';

type Option<T extends string> = { value: T; label: string; info?: TipContent };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  label,
  help,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  ariaLabel?: string;
  /** Optional field label rendered above the chips. If any option has `info`,
   *  a single (?) help icon is added next to the label that opens a popover
   *  listing all options' descriptions — keeps the chip strip visually
   *  clean while preserving rich option context. */
  label?: string;
  /** Optional help/footer text rendered below the chips. */
  help?: React.ReactNode;
}) {
  const optionTips: OptionTip[] = options
    .filter((o): o is Option<T> & { info: TipContent } => Boolean(o.info))
    .map((o) => ({ label: o.label, info: o.info }));

  const chips = (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel ?? label}>
      {options.map((opt) => {
        const isUncertainty = opt.value === 'unsure' || opt.value === 'unknown';
        const muted = isUncertainty && value !== opt.value ? 'opacity-70' : '';
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`chip ${isActive ? 'active' : ''} ${muted}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  if (!label && !help) return chips;

  return (
    <div>
      {label && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="label !mb-0">{label}</span>
          {optionTips.length > 0 && (
            <OptionsInfo options={optionTips} sectionLabel={label} />
          )}
        </div>
      )}
      {chips}
      {help && <p className="help">{help}</p>}
    </div>
  );
}
