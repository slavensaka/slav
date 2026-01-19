import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // ⚠️ ISTI FONTOVI KAO PORTFOLIO
        sans: ['var(--font-lato)', 'Lato', 'sans-serif'],       // Body text
        display: ['var(--font-oswald)', 'Oswald', 'sans-serif'], // Headings
      },
      colors: {
        // TODO: Extract exact colors from portfolio CSS
        // Placeholder values - will be updated
        primary: '#333333',
        secondary: '#666666',
      },
    },
  },
  plugins: [],
}

export default config
