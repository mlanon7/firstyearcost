// AdSlot — drop-in ad placeholder. Replace internals with AdSense / publisher
// code when traffic is approved. Designed to never collapse layout (CLS).
// While `NEXT_PUBLIC_ADSENSE_CLIENT` is unset (e.g. in production before ads
// are wired), the component renders nothing — so live readers don't see empty
// "Advertisement" placeholders.

type Size = 'leaderboard' | 'rectangle' | 'inFeed' | 'sidebar' | 'sticky';

// Reserved heights match the live AdSense formats so there's no CLS when ads
// load: leaderboard is 50px on mobile / 90px on desktop; rectangle is 250px;
// in-feed responsive is 140-160px; sidebar half-page is 600px; sticky banner is 90px.
const sizeMap: Record<Size, string> = {
  leaderboard: 'h-[50px] sm:h-[90px]',
  rectangle:   'h-[250px]',
  inFeed:      'h-[140px] sm:h-[160px]',
  sidebar:     'h-[600px]',
  sticky:      'h-[90px]',
};

export function AdSlot({
  size = 'rectangle',
  label = 'Advertisement',
  className = '',
}: { size?: Size; label?: string; className?: string }) {
  // Don't render placeholder boxes in production until AdSense is wired.
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) return null;

  return (
    <div
      role="complementary"
      aria-label={label}
      className={`no-print w-full ${sizeMap[size]} rounded-xl bg-ink-50 border border-dashed border-ink-200 flex items-center justify-center text-xs uppercase tracking-wider text-ink-400 ${className}`}
    >
      <span>{label}</span>
    </div>
  );
}
