/** @type {import('next').NextConfig} */

// ============================================================================
// CSP allow-lists for third-party providers.
// Toggle a provider on by setting its env var on Vercel. Each provider's hosts
// are added to the right CSP directive only when it's configured — keep the
// production CSP minimal until a provider is actually live.
// ============================================================================

const CSP_PROVIDERS = {
  // Google AdSense
  adsense: {
    enabled: !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    'script-src': ['https://pagead2.googlesyndication.com', 'https://*.googlesyndication.com', 'https://*.google.com', 'https://tpc.googlesyndication.com', 'https://*.googleadservices.com', 'https://*.doubleclick.net'],
    'img-src':    ['https://*.googlesyndication.com', 'https://*.doubleclick.net', 'https://*.google.com', 'https://*.googleadservices.com'],
    'frame-src':  ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com', 'https://*.googlesyndication.com'],
    'connect-src':['https://pagead2.googlesyndication.com', 'https://*.googlesyndication.com', 'https://*.google.com', 'https://*.doubleclick.net'],
  },

  // Google Analytics 4 / Tag Manager
  ga4: {
    enabled: !!process.env.NEXT_PUBLIC_GA_ID,
    'script-src': ['https://www.googletagmanager.com', 'https://www.google-analytics.com'],
    'img-src':    ['https://www.google-analytics.com', 'https://www.googletagmanager.com'],
    'connect-src':['https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'],
  },

  // Plausible (privacy-friendly analytics, recommended)
  plausible: {
    enabled: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    'script-src': ['https://plausible.io'],
    'connect-src':['https://plausible.io'],
  },

  // Microsoft Clarity (free heatmaps + session recordings)
  clarity: {
    enabled: !!process.env.NEXT_PUBLIC_CLARITY_ID,
    'script-src': ['https://www.clarity.ms', 'https://*.clarity.ms'],
    'connect-src':['https://*.clarity.ms', 'https://c.bing.com'],
  },

  // ConvertKit / Buttondown / Beehiiv newsletter endpoint
  newsletter: {
    enabled: !!process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
    // Endpoint hostname is configured via env var; allow common form providers.
    'connect-src':[
      'https://api.convertkit.com', 'https://*.convertkit.com',
      'https://api.buttondown.email',
      'https://api.beehiiv.com',
    ],
  },
};

function buildCsp() {
  // Start with a tight default.
  const csp = {
    'default-src': ["'self'"],
    'script-src':  ["'self'", "'unsafe-inline'"],
    'style-src':   ["'self'", "'unsafe-inline'"],
    'img-src':     ["'self'", 'data:', 'blob:', 'https:'],
    'font-src':    ["'self'", 'data:'],
    'connect-src': ["'self'"],
    'frame-src':   [],
    'frame-ancestors': ["'self'"],
    'base-uri':    ["'self'"],
    'form-action': ["'self'"],
  };

  for (const provider of Object.values(CSP_PROVIDERS)) {
    if (!provider.enabled) continue;
    for (const [directive, hosts] of Object.entries(provider)) {
      if (directive === 'enabled' || !Array.isArray(hosts)) continue;
      if (!csp[directive]) csp[directive] = ["'self'"];
      for (const h of hosts) {
        if (!csp[directive].includes(h)) csp[directive].push(h);
      }
    }
  }

  return Object.entries(csp)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Treat `import x from '.../foo.csv'` as a raw string. CSVs in public/data/
  // are the source of truth for tabular data (see data/csv/README.md). The
  // same files are also served statically at /data/foo.csv for client fetches
  // and round-tripping through Google Sheets.
  webpack(config) {
    config.module.rules.push({
      test: /\.csv$/,
      type: 'asset/source',
    });
    return config;
  },
  async headers() {
    const csp = buildCsp();
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
