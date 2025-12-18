/**
 * commons/constants/fonts.ts
 * 디자인 시스템 폰트 토큰 정의
 *
 * @description
 * - 폰트 패밀리, 크기, 두께, Line Height 토큰 관리
 * - tailwind.config.js에서 require로 불러와서 사용
 * - Figma의 "Pretendard Variable"과 매칭
 *
 * @example
 * ```typescript
 * import { FontFamily, FontSize, FontWeight } from '@/commons/constants';
 * // 또는
 * const { FontFamily, TailwindFontSize } = require('./commons/constants/fonts');
 * ```
 */

// 폰트 패밀리 토큰
export const FontFamily = {
  pretendard: [
    'Pretendard Variable',
    'Pretendard-100',
    'Pretendard-200',
    'Pretendard-300',
    'Pretendard-400',
    'Pretendard-500',
    'Pretendard-600',
    'Pretendard-700',
    'Pretendard-800',
    'Pretendard-900',
    'sans-serif',
  ],
  // Figma 매칭용
  variable: 'Pretendard Variable',
  // 개별 weight 파일 (필요시)
  100: 'Pretendard-100',
  200: 'Pretendard-200',
  300: 'Pretendard-300',
  400: 'Pretendard-400',
  500: 'Pretendard-500',
  600: 'Pretendard-600',
  700: 'Pretendard-700',
  800: 'Pretendard-800',
  900: 'Pretendard-900',
} as const;

// 폰트 크기 토큰 (px 단위)
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

// 폰트 두께 토큰
export const FontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Line Height 토큰
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Tailwind용 fontSize (lineHeight 포함)
// tailwind.config.js에서 사용
export const TailwindFontSize = {
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['14px', { lineHeight: '20px' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['18px', { lineHeight: '28px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '36px' }],
  '4xl': ['36px', { lineHeight: '40px' }],
  '5xl': ['48px', { lineHeight: '1' }],
} as const;
