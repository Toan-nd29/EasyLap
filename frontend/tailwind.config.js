/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Emerald 500
          600: '#059669', // Emerald 600
          700: '#047857', // Emerald 700
        }
      }
    },
  },
  plugins: [],
}
