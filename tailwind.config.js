/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        },
        wedding: {
          dark: '#1a1a2e',
          gold: '#d4af37',
          light: '#f9f9f9',
          pink: '#f8c8dc'
        },
        // Premium admin palette
        surface: {
          50:  '#FAFAF9',
          100: '#F5F5F3',
          200: '#ECEAE6',
          300: '#D6D3CD',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          850: '#1C1917',
          900: '#0C0A09',
          950: '#050403',
        },
        accent: {
          gold:    '#C6A969',
          amber:   '#D4A853',
          warm:    '#B8956A',
          muted:   '#8B7355',
        },
      },
      fontFamily: {
        sans: ['Cabinet Grotesk', 'sans-serif'], 
        serif: ['Playfair Display', 'serif'],
        handwriting: ['Great Vibes', 'cursive']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':     '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'lifted':   '0 4px 24px -4px rgba(0,0,0,0.06), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'elevated': '0 8px 40px -8px rgba(0,0,0,0.08), 0 4px 16px -4px rgba(0,0,0,0.04)',
        'glow-gold': '0 0 40px -8px rgba(198,169,105,0.25)',
        'inner-highlight': 'inset 0 1px 1px rgba(255,255,255,0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.32,0.72,0,1) both',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.32,0.72,0,1) both',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.32,0.72,0,1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.32,0.72,0,1) both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.32, 0.72, 0, 1)',
      }
    },
  },
  plugins: [],
}
