/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito', 'sans-serif'],
      },
      colors: {
        'brand-bg': '#F3F6FB',
        'brand-surface': '#FFFFFF',
        'brand-primary': '#2F4B8A',
        'brand-primary-hover': '#253B6A',
        'brand-secondary': '#E2E7F1',
        'brand-text': '#1F2533'
      }
    },
  },
  plugins: [],
}