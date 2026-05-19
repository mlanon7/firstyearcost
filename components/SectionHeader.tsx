export function SectionHeader({
  eyebrow, title, subtitle, align = 'left',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="pill pill-teal mb-3">{eyebrow}</p>
      )}
      <h2 className="h2 text-ink-900">{title}</h2>
      {subtitle && <p className="lede mt-3">{subtitle}</p>}
    </div>
  );
}
