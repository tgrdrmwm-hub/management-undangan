/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          dark: '#1a1a2e',
          gold: '#d4af37',
          light: '#f9f9f9',
          pink: '#f8c8dc'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        handwriting: ['Great Vibes', 'cursive']
      }
    },
  },
  plugins: [],
}
