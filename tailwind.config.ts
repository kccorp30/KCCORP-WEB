import type { Config } from 'tailwindcss';

// Design tokens — KCCORP Web
// Fuente única de verdad para color/tipografía/spacing/radii/shadows.
// Ningún componente debe usar valores sueltos fuera de esta config.

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // v4 — realineado con Marine Cloud (shared-visual-tokens.md)
        navy: '#070E18',          // base casi negro, coincide con la app
        'navy-2': '#0E1C2E',
        panel: '#0B1826',
        'marine-white': '#F5F3EE', // texto primario, alto contraste
        'cool-gray': '#9FB0C4',    // texto secundario
        silver: '#C7CDD6',
        gold: '#C9A24B',           // KCC Gold — acento, nunca fondo
        'gold-dim': '#8A7239',
        'blue-accent': '#4C7C9E',  // profundidad marina sutil, gradiente con gold
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'], // v4: grotesk contemporáneo, no serif editorial
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      spacing: {
        '4.5': '18px',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        // deliberadamente sin lg/xl/full genéricos — nada de look "card SaaS"
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(11,27,43,0.08)',
      },
      maxWidth: {
        content: '1200px',
        wide: '1600px',
      },
      transitionTimingFunction: {
        precise: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
