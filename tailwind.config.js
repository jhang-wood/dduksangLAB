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
        // Deep Black System - 깊이감 있는 다크 모드
        deepBlack: {
          50: '#2A2A2A', // Border Black
          100: '#232323',
          200: '#1F1F1F',
          300: '#1A1A1A', // Card Background
          400: '#171717',
          500: '#141414',
          600: '#121212', // Main Background
          700: '#0F0F0F',
          800: '#0C0C0C',
          900: '#0A0A0A', // Primary Black (Deepest)
          950: '#050505',
        },
        // Metallic Gold System - 광택과 음영이 느껴지는 금색
        metallicGold: {
          50: '#FFF9E6', // Lightest tint
          100: '#FFF5CC', // Highlight Gold
          200: '#FFEB99',
          300: '#FFE066',
          400: '#FFD633',
          500: '#FFD700', // Base Gold (Pure Gold)
          600: '#E6C300',
          700: '#CCAC00',
          800: '#B39600',
          900: '#B8860B', // Shadow Gold (Dark Goldenrod)
          gradient: 'linear-gradient(45deg, #FFD700 0%, #B8860B 100%)',
        },
        // Off White System - 가독성을 위한 밝은 색상
        offWhite: {
          50: '#FFFFFF',
          100: '#F5F5F5',
          200: '#EAEAEA', // Primary Text
          300: '#DEDEDE',
          400: '#C9C9C9',
          500: '#B0B0B0', // Secondary Text
          600: '#969696',
          700: '#7D7D7D',
          800: '#666666', // Disabled Text
          900: '#4F4F4F',
        },
        // Keep existing for compatibility
        neutral: {
          950: '#0a0a0a',
        },
        charcoal: {
          950: '#0a0a0a',
        },
        premiumGold: {
          500: '#FFD700',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        display: ['var(--font-montserrat)', 'Pretendard', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0',
        wide: '.025em',
        wider: '.05em',
        widest: '.1em',
        ultra: '.2em',
        mega: '.3em',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        display: ['10rem', { lineHeight: '0.9' }],
      },
      extend: {
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'mesh-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
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
        gradientShift: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideIn: {
          '0%': {
            transform: 'translateX(-10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        pulseSoft: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
