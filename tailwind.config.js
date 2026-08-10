/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#111213',    
          grey: '#5A5D64',
          silver: '#C4C7CC',
          smoke: '#F2F3F5',
          white: '#FFFFFF',
          accent: '#000000',
        }
      },
      fontFamily: {
        sans: ['Cabinet Grotesk', 'sans-serif'], 
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
