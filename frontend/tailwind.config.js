/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e17',
          darker: '#06090e',
          card: '#0f172a',
          cardHover: '#1e293b',
          border: '#1e293b',
          primary: '#38bdf8',
          accent: '#06b6d4',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace', 'ui-monospace'],
        sans: ['Inter', 'sans-serif', 'system-ui']
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -2px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 15px -2px rgba(56, 189, 248, 0.4)',
        'glow-red': '0 0 15px -2px rgba(239, 68, 68, 0.4)',
        'glow-green': '0 0 15px -2px rgba(16, 185, 129, 0.4)'
      }
    },
  },
  plugins: [],
}
