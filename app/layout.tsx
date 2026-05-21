import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://firstyearcost.com'),
  title: {
    default: "FirstYearCost — Estimate Your Baby's First-Year Cost",
    template: '%s | FirstYearCost',
  },
  description:
    "Plan your baby's first year with realistic cost ranges by state, childcare plan, feeding choice, and gear tier. Free calculators, source-backed assumptions, no signup.",
  keywords: [
    'baby cost calculator',
    'first year baby cost',
    'baby budget',
    'newborn cost',
    'daycare cost calculator',
    'diaper cost',
    'formula cost',
    'baby gear budget',
    'cost of having a baby',
  ],
  openGraph: {
    title: "FirstYearCost — Estimate Your Baby's First-Year Cost",
    description:
      "Free, source-backed calculators for diapers, formula, daycare, gear, and birth out-of-pocket. Plan baby's first year with realistic ranges.",
    url: 'https://firstyearcost.com',
    siteName: 'FirstYearCost',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FirstYearCost — Estimate Your Baby's First-Year Cost",
    description:
      "Free, source-backed calculators for diapers, formula, daycare, gear, and birth out-of-pocket.",
  },
  robots: { index: true, follow: true },
  applicationName: 'FirstYearCost',
  appleWebApp: { title: 'FirstYearCost' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbf9f5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
