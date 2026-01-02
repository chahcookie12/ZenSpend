/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F0',
          50: '#FFFFFF',
          100: '#F8F6F2',
          200: '#F5F1E8',
          300: '#F2ECDF',
          400: '#EFE7D6',
        },
        sage: {
          DEFAULT: '#8FB3A2',
          50: '#E8F0EC',
          100: '#D1E1D9',
          200: '#BAD2C6',
          300: '#A3C3B3',
          400: '#8FB3A2',
          500: '#7FAF9A',
          600: '#6A9B87',
          700: '#558774',
        },
        olive: {
          DEFAULT: '#B8A990',
          light: '#D4C9B5',
          dark: '#9C8F73',
        },
        terracotta: {
          DEFAULT: '#D8B5A8',
          light: '#E8D1C8',
          dark: '#C89B88',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.5' }],
        'sm': ['1rem', { lineHeight: '1.6' }],
        'base': ['1.125rem', { lineHeight: '1.7' }],
        'lg': ['1.25rem', { lineHeight: '1.7' }],
        'xl': ['1.5rem', { lineHeight: '1.6' }],
        '2xl': ['1.875rem', { lineHeight: '1.5' }],
        '3xl': ['2.25rem', { lineHeight: '1.4' }],
        '4xl': ['3rem', { lineHeight: '1.3' }],
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

