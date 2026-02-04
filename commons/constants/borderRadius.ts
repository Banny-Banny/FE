/**
 * commons/constants/borderRadius.ts
 * 디자인 시스템 Border Radius 토큰 정의
 *
 * @description
 * - 컴포넌트 모서리 둥글기 값 정의
 * - tailwind.config.js의 borderRadius와 동기화 필요
 *
 * @example
 * ```typescript
 * import { BorderRadius } from '@/commons/constants';
 * ```
 */
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;
