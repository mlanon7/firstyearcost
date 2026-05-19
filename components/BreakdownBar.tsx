import { formatUSD } from '@/lib/format';

type Row = { label: string; value: number; color: string };

export function BreakdownBar({ rows }: { rows: Row[] }) {
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;
  return (
    <div>
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-ink-100">
        {rows.map((r, i) => (
          <div
            key={i}
            style={{ width: `${(r.value / total) * 100}%`, backgroundColor: r.color }}
            title={`${r.label}: ${formatUSD(r.value)}`}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {rows.map((r, i) => {
          const pct = ((r.value / total) * 100).toFixed(0);
          return (
            <li
              key={i}
              className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-x-3 gap-y-0 text-sm"
            >
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
              <span className="text-ink-700 leading-snug">{r.label}</span>
              <span className="text-xs text-ink-500 tabular-nums whitespace-nowrap">{pct}%</span>
              <span className="text-right font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                {formatUSD(r.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
