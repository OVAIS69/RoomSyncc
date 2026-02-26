/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          accent: 'var(--accent-cyan)',
          vibrant: {
            cyan: 'var(--accent-cyan)',
            blue: 'var(--accent-blue)',
            indigo: 'var(--accent-indigo)',
            purple: '#A855F7',
          }
        },
        cyber: {
          dark: 'var(--bg-primary)',
          card: 'var(--surface)',
          border: 'var(--border)',
          glow: 'var(--glass-border)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
