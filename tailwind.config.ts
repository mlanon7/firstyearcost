import type { Config } from 'tailwindcss';

// Warm palette — terracotta primary, honey amber, dusty rust accents.
// The legacy token names (teal, coral, sun) are retained so existing
// `text-teal-*` / `bg-teal-*` / `pill-teal` / `btn-accent` classes get
// the warm look automatically — no component refactor needed.

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          // Warm browns (espresso/coffee) so dark text doesn't clash with the warm bg.
          50:  '#f7f1e8',
          100: '#ede1cd',
          200: '#d7c2a1',
          300: '#b89d75',
          400: '#917450',
          500: '#6b563b',
          600: '#4f3f29',
          700: '#3a2d1d',
          800: '#241b10',
          900: '#171008',
          950: '#0c0703',
        },
        teal: {
          // Terracotta (primary accent). Kept under the `teal` key so existing
          // class names keep working post-rebrand.
          50:  '#fcf2eb',
          100: '#f7dccc',
          200: '#efbb9d',
          300: '#e3936a',
          400: '#d36e3f',
          500: '#c75f3e',
          600: '#a3411a',
          700: '#813119',
          800: '#682818',
          900: '#552216',
        },
        coral: {
          // Burnt sienna — slightly warmer rust accent. Used for danger/accent2.
          50:  '#fdf4ef',
          100: '#fbe1d3',
          200: '#f6bda4',
          300: '#f08e69',
          400: '#e76343',
          500: '#d44822',
          600: '#b6371a',
          700: '#952d17',
          800: '#7b2918',
          900: '#682517',
        },
        sun: {
          // Honey amber — kept warm, used for highlights and the Disclaimer.
          50:  '#fff8e8',
          100: '#feedb8',
          200: '#fcdb7a',
          300: '#fac142',
          400: '#f5a323',
          500: '#e08515',
          600: '#bf6a0c',
          700: '#945005',
          800: '#794107',
          900: '#623509',
        },
        cream: '#fbf3e7',   // warm peach cream
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        // Warm-toned shadows (brown undertone instead of cool slate).
        soft: '0 1px 2px rgba(72,48,24,0.05), 0 4px 12px rgba(72,48,24,0.05)',
        card: '0 1px 3px rgba(72,48,24,0.07), 0 8px 24px rgba(72,48,24,0.06)',
        pop:  '0 4px 8px rgba(72,48,24,0.08), 0 16px 40px rgba(72,48,24,0.10)',
        glow: '0 0 0 4px rgba(199,95,62,0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
