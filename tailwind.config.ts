import type { Config } from 'tailwindcss'

/**
 * Design system: "the site is a running board".
 * Every value here is also exposed as a CSS variable in app/globals.css.
 * Use these tokens; never reach for the default Tailwind palette.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    // Replace (not extend) so default palette and random spacing can't leak in.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Ground: soldermask in shadow. Three surfaces: base -> raised -> floating.
      mask: { 950: '#060D0C', 900: '#0A1312', 800: '#0F1B19', 700: '#162623', 600: '#1F3531' },
      // Silkscreen: text.
      silk: { DEFAULT: '#E9EEE6', 2: '#AEBAB2', 3: '#7C8B83' },
      // Phosphor amber: channel 1 (SDA, roll), primary accent.
      phos: { DEFAULT: '#F5B546', dim: '#8A6521', ink: '#1A1203' },
      // Trace teal: channel 2 (SCL, pitch), secondary accent.
      trace: { DEFAULT: '#5CD6C0', dim: '#2B6E63' },
      // Fault red: errors, "before" state, unplug marker. Never decorative.
      fault: { DEFAULT: '#FF6A55', dim: '#7A2E24' },
      line: { DEFAULT: 'rgba(233,238,230,0.10)', 2: 'rgba(233,238,230,0.18)' },
    },
    fontFamily: {
      display: ['var(--font-display)', 'Arial Black', 'sans-serif'],
      sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    // Type scale, ~1.25 ratio. [size, line-height]
    fontSize: {
      '2xs': ['0.6875rem', '1.4'],  // 11  silkscreen refs
      xs: ['0.8125rem', '1.5'],     // 13  labels, captions
      sm: ['0.9375rem', '1.6'],     // 15  secondary copy
      base: ['1.0625rem', '1.7'],   // 17  body
      lg: ['1.3125rem', '1.5'],     // 21  lead
      xl: ['1.75rem', '1.25'],      // 28  h3
      '2xl': ['2.375rem', '1.12'],  // 38  h2
      '3xl': ['3.375rem', '1.02'],  // 54  page title
      '4xl': ['5rem', '0.95'],      // 80  hero
    },
    borderRadius: {
      none: '0',
      xs: '2px',     // chips, decode cells
      sm: '6px',     // buttons, inputs
      DEFAULT: '10px', // panels, cards
      lg: '16px',    // hero-level plates
      full: '999px',
    },
    extend: {
      // Spacing tokens on top of the 4px grid: section rhythm.
      spacing: { gutter: 'clamp(20px, 4vw, 56px)', section: 'clamp(72px, 10vw, 136px)' },
      maxWidth: { wrap: '1240px', prose: '68ch' },
      boxShadow: {
        // base -> raised -> floating. Tinted with the mask green, never flat grey.
        raised: '0 1px 0 rgba(233,238,230,0.05) inset, 0 1px 2px rgba(2,8,7,0.5), 0 8px 24px -12px rgba(2,8,7,0.7)',
        floating: '0 1px 0 rgba(233,238,230,0.07) inset, 0 2px 4px rgba(2,8,7,0.5), 0 24px 56px -20px rgba(2,8,7,0.85)',
        glow: '0 0 0 1px rgba(245,181,70,0.35), 0 0 24px -4px rgba(245,181,70,0.35)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.2, 0.9, 0.25, 1.15)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: { fast: '140ms', base: '240ms', slow: '480ms' },
    },
  },
}

export default config
