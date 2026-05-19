import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Estimate your baby's first-year cost";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#171008',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Estimate your baby's
            <br />
            <span style={{ color: '#a3411a' }}>first-year cost.</span>
          </h1>
          <p style={{ fontSize: 28, color: '#4f3f29', maxWidth: 900, margin: 0 }}>
            Realistic ranges for childcare, feeding, gear, and birth bills — by your state and choices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 22, color: '#4f3f29' }}>
          <span>50-state childcare data</span>
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
