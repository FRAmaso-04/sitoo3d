import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark:        'var(--dark)',
        red:         'var(--red)',
        cream:       'var(--cream)',
        'off-white': 'var(--white)',
        smoke:       'var(--smoke)',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        jp:      ['var(--font-jp)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.15em',
        wide:  '0.25em',
      },
    },
  },
  plugins: [],
};

export default config;
