/**
 * commons/constants/index.ts
 * 공통 상수 메인 진입점
 *
 * @description
 * - 모든 디자인 토큰과 라우트 상수를 한 곳에서 export
 * - 프로젝트 전역에서 @/commons/constants로 import 가능
 * - tailwind.config.js는 개별 파일을 require로 직접 불러옴
 *
 * @example
 * ```typescript
 * import { Colors, FontSize, Spacing, ROUTES } from '@/commons/constants';
 * ```
 */

// 라우트 상수
export { ROUTES } from './routes';
export type { RouteKey, RoutePath } from './routes';

// 디자인 토큰 (tailwind.config.js와 동기화)
export { BorderRadius } from './borderRadius';
export { Colors } from './color';
export { FontFamily, FontSize, FontWeight, LineHeight } from './fonts';
export { Spacing } from './spacing';
export { Typography, getTypographyStyle } from './typography';
export type { TypographyKey } from './typography';
