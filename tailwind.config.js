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
        // 먹색 그라데이션 팔레트
        ink: {
          50: '#f7f7f8',
          100: '#e8e8ea',
          200: '#c7c7cc',
          300: '#9d9da5',
          400: '#6b6b75',
          500: '#4a4a55',
          600: '#363640',
          700: '#282832',
          800: '#1a1a24',
          900: '#0f0f18',
          950: '#030307',
        },
        // 파스텔 오로라 팔레트
        aurora: {
          green: {
            light: '#34d399',
            DEFAULT: '#10b981',
            dark: '#059669',
          },
          blue: {
            light: '#93c5fd',
            DEFAULT: '#60a5fa',
            dark: '#3b82f6',
          },
          purple: {
            light: '#d8b4fe',
            DEFAULT: '#c084fc',
            dark: '#a855f7',
          },
          amber: {
            light: '#fde047',
            DEFAULT: '#fbbf24',
            dark: '#f59e0b',
          },
        },
        // 금박 포인트 색상
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
          foil: '#FFD700', // 금박 효과용
        },
        // 기존 dark 색상 유지
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0a0a',
        }
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
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'aurora': 'aurora 15s ease-in-out infinite',
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
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}