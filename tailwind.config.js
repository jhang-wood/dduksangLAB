/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Color System
        charcoal: {
          50: '#f6f6f7',
          100: '#e1e1e3',
          200: '#c3c3c7',
          300: '#9d9da5',
          400: '#797982',
          500: '#5e5e67',
          600: '#4a4a52',
          700: '#3d3d44',
          800: '#34343a',
          900: '#2d2d33',
          950: '#0A0A0B',
        },
        // Premium Gold Palette
        premiumGold: {
          50: '#fffdf5',
          100: '#fffae6',
          200: '#fff4c2',
          300: '#ffeb94',
          400: '#ffdd5c',
          500: '#D4AF37', // Main premium gold
          600: '#c09b23',
          700: '#a07d1a',
          800: '#84641a',
          900: '#70531a',
          foil: '#FFD700',
        },
        // Soft Cream
        cream: {
          50: '#FFFFFE',
          100: '#FEFDFB',
          200: '#FBF7F4',
          300: '#F7F0EA',
          400: '#F2E8DF',
          500: '#EADED2',
        },
        // Deep Purple Gradient
        deepPurple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#1e0e3e',
        },
        // Keep existing colors for compatibility
        gold: {
          50: '#fffdf7',
          100: '#fef9e7',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#fbbf24',
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
          foil: '#FFD700',
        },
        ink: {
          950: '#030307',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      },
      fontFamily: {
        'pretendard': ['Pretendard Variable', 'system-ui', 'sans-serif'],
        'noto-serif': ['Noto Serif KR', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'gmarket': ['GmarketSans', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-.075em',
        'tighter': '-.05em',
        'tight': '-.025em',
        'normal': '0',
        'wide': '.025em',
        'wider': '.05em',
        'widest': '.1em',
        'ultra': '.2em',
        'mega': '.3em',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'display': ['10rem', { lineHeight: '0.9' }],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'aurora': 'aurora 15s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'reveal': 'reveal 1s ease-out',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        aurora: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'translateY(0) scale(1)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateY(-10px) scale(1.05)',
          },
        },
        glow: {
          '0%, 100%': {
            opacity: '0.5',
            filter: 'blur(15px)',
          },
          '50%': {
            opacity: '0.8',
            filter: 'blur(20px)',
          },
        },
        reveal: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}