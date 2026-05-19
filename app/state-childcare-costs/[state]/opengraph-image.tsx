import { ImageResponse } from 'next/og';
import { stateBySlug, slugifyState, stateChildcare } from '@/data/stateChildcare';

export const runtime = 'edge';
export const alt = 'Infant childcare cost by state';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { state: string } }) {
  const s = stateBySlug[params.state];
  return [
    {
      id: 'main',
      contentType: 'image/png',
      size,
      alt: s ? `Infant childcare cost in ${s.name}` : alt,
    },
  ];
}

// Pre-render an OG image per state slug at build time.
export function generateStaticParams() {
  return stateChildcare.map((s) => ({ state: slugifyState(s.name) }));
}

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default async function Image({ params }: { params: { state: string } }) {
  const s = stateBySlug[params.state];
  const name = s?.name ?? 'United States';
  const range = s ? `${fmt.format(s.centerLow)}–${fmt.format(s.centerHigh)} / yr` : '';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'linear-gradient(135deg, #fbf3e7 0%, #f7dccc 55%, #feedb8 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: '#c75f3e',
              color: 'white',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            $
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#171008' }}>
            FirstYearCost
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span
            style={{
              fontSize: 28,
              color: '#a3411a',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Infant childcare in {name}
          </span>
          <h1
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#171008',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {range || 'Center care planning ranges'}
          </h1>
          <p style={{ fontSize: 28, color: '#4f3f29', maxWidth: 1000, margin: 0 }}>
            Center, home daycare, and nanny ranges — sourced from Child Care Aware market rate surveys.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 22, color: '#4f3f29' }}>
          <span>50-state data</span>
          <span>·</span>
          <span>Source-backed</span>
          <span>·</span>
          <span>Free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
