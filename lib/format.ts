// Formatting helpers used across the UI.

export function formatUSD(n: number, opts: { decimals?: number } = {}): string {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: opts.decimals ?? 0,
    minimumFractionDigits: opts.decimals ?? 0,
  });
}

export function formatRange(low: number, high: number): string {
  return `${formatUSD(low)}–${formatUSD(high)}`;
}

export function formatPercent(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`;
}

export function compactUSD(n: number): string {
  if (!isFinite(n)) return '—';
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}
