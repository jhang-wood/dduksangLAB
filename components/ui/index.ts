/**
 * 공통 UI 컴포넌트 및 스타일
 * 일관성 있는 디자인 시스템을 위한 재사용 가능한 컴포넌트들
 */

// Form 관련 공통 스타일
export const inputStyles = {
  base: 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none',
  dark: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400',
  light: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
} as const;

export const buttonStyles = {
  primary:
    'bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border-2 border-yellow-400 text-yellow-400 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

export const cardStyles = {
  base: 'border rounded-lg p-4 transition-all',
  dark: 'border-gray-700 bg-gray-800',
  light: 'border-gray-200 bg-white shadow-sm',
  interactive: 'cursor-pointer hover:shadow-md',
} as const;

// Layout 관련 공통 스타일
export const containerStyles = {
  page: 'min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900',
  content: 'max-w-7xl mx-auto px-4 py-8',
  section: 'max-w-4xl mx-auto',
} as const;

// Text 관련 공통 스타일
export const textStyles = {
  heading: 'text-3xl font-bold text-white mb-6',
  subheading: 'text-xl font-semibold text-white mb-4',
  body: 'text-gray-300',
  muted: 'text-gray-400 text-sm',
  error: 'text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3',
} as const;

// Modal 관련 공통 스타일
export const modalStyles = {
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50',
  content: 'bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 relative',
  closeButton: 'absolute top-4 right-4 text-gray-400 hover:text-white',
} as const;

// Type definitions
export type InputVariant = keyof typeof inputStyles;
export type ButtonVariant = keyof typeof buttonStyles;
export type CardVariant = keyof typeof cardStyles;
