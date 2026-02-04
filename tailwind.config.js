/**
 * tailwind.config.js
 * Tailwind CSS 설정 파일 (NativeWind v4)
 *
 * @description
 * - 디자인 토큰을 TypeScript 파일에서 require로 불러와서 사용
 * - ts-node/register를 통해 TypeScript 파일 직접 require 가능
 * - 모든 디자인 토큰은 commons/constants/ 디렉토리에서 관리
 *
 * @see {@link ./commons/constants/color.ts} 색상 토큰
 * @see {@link ./commons/constants/fonts.ts} 폰트 토큰
 * @see {@link ./commons/constants/spacing.ts} 간격 토큰
 * @see {@link ./commons/constants/borderRadius.ts} Border Radius 토큰
 * @see {@link ./commons/constants/typography.ts} Typography 스타일 (React Native StyleSheet용)
 */

/** @type {import('tailwindcss').Config} */
require('ts-node/register');

// 디자인 토큰 import
const { Colors } = require('./commons/constants/color');
const {
  FontFamily,
  TailwindFontSize,
  FontWeight,
  LineHeight,
} = require('./commons/constants/fonts');
const { Spacing } = require('./commons/constants/spacing');
const { BorderRadius } = require('./commons/constants/borderRadius');
// Typography는 React Native StyleSheet 객체이므로 Tailwind 유틸리티로 변환하지 않음
// 직접 import하여 사용: import { Typography } from '@/commons/constants';
const { Typography } = require('./commons/constants/typography');

// Spacing과 BorderRadius를 Tailwind 형식으로 변환 (px 단위 문자열)
const tailwindSpacing = Object.fromEntries(
  Object.entries(Spacing).map(([key, value]) => [key, `${value}px`]),
);

const tailwindBorderRadius = Object.fromEntries(
  Object.entries(BorderRadius).map(([key, value]) => [
    key,
    value === 9999 ? '9999px' : `${value}px`,
  ]),
);

module.exports = {
  // NativeWind v4에서는 content 경로를 지정해야 합니다
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './commons/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 디자인 토큰 주입
      colors: Colors,
      fontFamily: FontFamily,
      fontSize: TailwindFontSize,
      fontWeight: FontWeight,
      lineHeight: LineHeight,
      spacing: tailwindSpacing,
      borderRadius: tailwindBorderRadius,
    },
  },
  plugins: [],
};
