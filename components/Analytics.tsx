'use client';

import { useEffect } from 'react';

// Google Analytics 4 loader — consent-aware via Google Consent Mode v2.
//
// IMPORTANT: we render plain <script> tags (not next/script). In the App
// Router, next/script with an *inline* afterInteractive script does not
// reliably render its content into the HTML, so gtag.js would load but never
// get gtag('config') — GA stays silent. Plain SSR'd <script> tags are part of
// the initial HTML and execute on parse, which is what GA needs.
//
// Consent posture (US-only site):
//   - This site targets U.S. users. The U.S. has no GDPR-style opt-IN
//     requirement; CCPA/CPRA is opt-OUT and we run no ad personalization and
//     don't sell data. So analytics_storage defaults to GRANTED with an
//     informational cookie banner + a working opt-out, which is the standard
//     U.S. posture and lets Realtime populate immediately.
//   - ad_storage / ad_user_data / ad_personalization stay DENIED always.
//   - If the visitor clicks "Decline" in the cookie banner, analytics_storage
//     is downgraded to denied for the rest of the session (and on return
//     visits, read from localStorage).
//
// The cookie banner dispatches `fyc-consent-change`; this component reacts live.

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'fyc-cookie-consent-v1';

function setAnalyticsConsent(state: 'granted' | 'denied') {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', { analytics_storage: state });
}

export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    // Honor a previously stored decline on return visits.
    try {
      if (window.localStorage.getItem(CONSENT_KEY) === 'decline') setAnalyticsConsent('denied');
    } catch {
      /* localStorage blocked — leave default */
    }
    function onConsentChange(e: Event) {
      const choice = (e as CustomEvent<'accept' | 'decline'>).detail;
      setAnalyticsConsent(choice === 'decline' ? 'denied' : 'granted');
    }
    window.addEventListener('fyc-consent-change', onConsentChange);
    return () => window.removeEventListener('fyc-consent-change', onConsentChange);
  }, []);

  if (!GA_ID) return null;

  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('config', '${GA_ID}', { anonymize_ip: true });
`.trim();

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script id="ga-init" dangerouslySetInnerHTML={{ __html: init }} />
    </>
  );
}
