'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics 4 loader — consent-aware via Google Consent Mode v2.
//
// Behavior:
//   - Renders nothing if NEXT_PUBLIC_GA_ID is unset (local dev, or before
//     you've created a GA4 property). Safe to ship unconfigured.
//   - Loads gtag.js, then sets Consent Mode defaults to DENIED for all
//     storage. GA still sends cookieless "consent mode" pings (privacy-safe,
//     no identifiers) so you get aggregate traffic counts even before consent.
//   - When the visitor clicks "Accept all" in the cookie banner, consent is
//     upgraded to GRANTED and full analytics (with the _ga cookie) begins —
//     no page reload required.
//   - "Decline" leaves consent denied; GA stays in cookieless mode.
//
// The cookie banner (components/CookieBanner.tsx) stores the choice in
// localStorage under `fyc-cookie-consent-v1` and dispatches a
// `fyc-consent-change` event that this component listens for.

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'fyc-cookie-consent-v1';

function grantConsent() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',          // we don't run Google ads personalization
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    // If the visitor already accepted on a previous visit, grant immediately.
    try {
      if (window.localStorage.getItem(CONSENT_KEY) === 'accept') grantConsent();
    } catch {
      /* localStorage blocked — stay in cookieless mode */
    }

    // React to live accept/decline from the cookie banner.
    function onConsentChange(e: Event) {
      const choice = (e as CustomEvent<'accept' | 'decline'>).detail;
      if (choice === 'accept') grantConsent();
    }
    window.addEventListener('fyc-consent-change', onConsentChange);
    return () => window.removeEventListener('fyc-consent-change', onConsentChange);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {/* gtag.js loader */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Init + Consent Mode v2 defaults (denied until the banner grants) */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
