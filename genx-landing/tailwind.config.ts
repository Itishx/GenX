module.exports = {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['Neue Haas Display', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        display: ['Neue Haas Display', 'serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#FBBF24',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}