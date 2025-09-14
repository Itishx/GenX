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
      colors: {
        primary: '#4F46E5', // Example primary color
        secondary: '#FBBF24', // Example secondary color
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}