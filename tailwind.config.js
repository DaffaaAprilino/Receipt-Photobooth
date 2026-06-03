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
        'heading': ['Fredoka', 'sans-serif'],
      },
      colors: {
        'brand-bg': '#F7F5F0',
        'brand-surface': '#FFFFFF',
        'brand-primary': '#3D5245',
        'brand-primary-hover': '#2D3F34',
        'brand-secondary': '#E8E5DD',
        'brand-text': '#2E2A27',
        'brand-accent': '#C87A53',
        'brand-accent-hover': '#B46B46'
      }
    },
  },
  plugins: [],
}