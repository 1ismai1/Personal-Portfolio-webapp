import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        newsreader: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ground: '#0a0a0c',
        surface: { DEFAULT: '#101014', raised: '#17171c', hover: '#1f1f26' },
        blue: { field: '#0e1e30', DEFAULT: '#16304a', hi: '#1e4066', txt: '#9db3c7' },
        aub: { field: '#241633', DEFAULT: '#3a2450', hi: '#4a2f63', lilac: '#c9b0da' },
        ox: { DEFAULT: '#5e1b26', txt: '#e6c9cd' },
        paper: '#f6f4f1',
        ink: { DEFAULT: '#f6f4f1', 2: '#c6c3bf', 3: '#8b8986' },
      },
      borderRadius: {
        xs: '8px',
        sm: '16px',
        DEFAULT: '28px',
        pill: '999px',
      },
      boxShadow: {
        ring: '0 0 0 4px rgba(74, 47, 99, .28)',
      },
    },
  },
}

export default config
