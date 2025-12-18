/**
 * commons/constants/spacing.ts
 * 디자인 시스템 간격(Spacing) 토큰 정의
 *
 * @description
 * - 컴포넌트 간 간격, 패딩, 마진 등에 사용
 * - tailwind.config.js의 spacing과 동기화 필요
 *
 * @example
 * ```typescript
 * import { Spacing } from '@/commons/constants';
 * ```
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;
