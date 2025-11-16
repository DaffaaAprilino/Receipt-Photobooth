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
        'brand-bg': '#FFF5E4',      // Soft Peach/Beige
        'brand-surface': '#FFFFFF', // Tetap putih bersih
        'brand-primary': '#FF9494', // Soft Pink/Coral
        'brand-primary-hover': '#FF7A7A',
        'brand-secondary': '#FFE3E1', // Lightest Pink
        'brand-text': '#524A4A'    // Dark Brown (lebih lembut dari hitam)
      }
    },
  },
  plugins: [],
}