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
          50: '#effcf5',
          100: '#d9f8e7',
          200: '#b8f0d0',
          300: '#86e5b0',
          400: '#4dd58c',
          500: '#25c875',
          600: '#16b865',
          700: '#0c8c4b',
          800: '#0d6e3f',
          900: '#0d5b37',
        }
      }
    },
  },
  plugins: [],
}
