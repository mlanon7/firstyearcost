import { formatUSD } from '@/lib/format';

export function StatCard({
  label,
  value,
  range,
  accent = 'ink',
  hint,
}: {
  label: string;
  value: number;
  range?: [number, number];
  accent?: 'ink' | 'teal' | 'coral' | 'sun';
  hint?: string;
}) {
  const accentClass =
    accent === 'teal' ? 'text-teal-700' :
    accent === 'coral' ? 'text-coral-600' :
    accent === 'sun' ? 'text-sun-700' :
    'text-ink-900';
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold tracking-tight ${accentClass} tabular-nums`}>
        {formatUSD(value)}
      </p>
      {range && (
        <p className="mt-1 text-xs text-ink-500 tabular-nums">
          Range {formatUSD(range[0])} – {formatUSD(range[1])}
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-ink-500 leading-snug">{hint}</p>}
    </div>
  );
}
