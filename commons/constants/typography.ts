/**
 * commons/constants/typography.ts
 * 전역 Typography 스타일 정의
 *
 * @description
 * - Figma 디자인 시스템의 Typography 스타일을 React Native StyleSheet로 정의
 * - Header, Body, Caption 카테고리별로 관리
 * - 모든 텍스트 스타일은 이 파일에서 단일 소스로 관리
 * - Pretendard Variable 폰트 사용
 *
 * @example
 * ```typescript
 * import { Typography } from '@/commons/constants';
 * import { Text, StyleSheet } from 'react-native';
 *
 * <Text style={Typography.header.h1}>제목 텍스트</Text>
 * <Text style={Typography.body.body1}>본문 텍스트</Text>
 * <Text style={Typography.caption.caption1}>캡션 텍스트</Text>
 * ```
 */

import { TextStyle } from 'react-native';
import { FontFamily, FontWeight } from './fonts';

// Typography 스타일 정의
// Figma 디자인 시스템과 1:1 매칭
export const Typography = {
  // Header 스타일
  // - h1: 헤더바 메뉴 이름
  // - h2: 일반 헤더
  // - h3: 서브 헤더
  // - h4: 탭
  // - h5: 대형 헤더
  header: {
    h1: {
      fontFamily: FontFamily.variable,
      fontSize: 24,
      lineHeight: 24,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
    } as TextStyle,
    h2: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
    } as TextStyle,
    h3: {
      fontFamily: FontFamily.variable,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: FontWeight.medium,
      letterSpacing: -0.150390625,
    } as TextStyle,
    h4: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.semibold,
      letterSpacing: -0.3125,
    } as TextStyle,
    h5: {
      fontFamily: FontFamily.variable,
      fontSize: 30,
      lineHeight: 36,
      fontWeight: FontWeight.extrabold,
      letterSpacing: 0.3955078125,
    } as TextStyle,
  },

  // Body 스타일
  // - body1: 기본 본문 (Bold)
  // - body2: 플레이스홀더 (Bold, lineHeight: auto)
  // - body3: 작은 본문 (Bold)
  // - body4: 기본 본문 (Regular)
  // - body5: 작은 본문 (Bold)
  // - body6: 중간 본문 (Regular)
  // - body7: 작은 본문 (Regular)
  // - body8: 작은 본문 (SemiBold)
  // - body9: 작은 본문 (Medium)
  // - body10: 작은 본문 (Bold, lineHeight: 18px)
  // - body11: body 타이틀 (SemiBold)
  body: {
    body1: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
    } as TextStyle,
    body2: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
      // lineHeight: auto (명시하지 않음)
    } as TextStyle,
    body3: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeight.bold,
      letterSpacing: 0,
    } as TextStyle,
    body4: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.regular,
      letterSpacing: -0.3125,
    } as TextStyle,
    body5: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeight.bold,
      letterSpacing: 0,
    } as TextStyle,
    body6: {
      fontFamily: FontFamily.variable,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: FontWeight.regular,
      letterSpacing: -0.150390625,
    } as TextStyle,
    body7: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeight.regular,
      letterSpacing: 0,
    } as TextStyle,
    body8: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeight.semibold,
      letterSpacing: 0,
    } as TextStyle,
    body9: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: FontWeight.medium,
      letterSpacing: 0,
    } as TextStyle,
    body10: {
      fontFamily: FontFamily.variable,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: FontWeight.bold,
      letterSpacing: 0,
    } as TextStyle,
    body11: {
      fontFamily: FontFamily.variable,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: FontWeight.semibold,
      letterSpacing: -0.150390625,
    } as TextStyle,
  },

  // Caption 스타일
  // - caption1: 각 가격 표시전
  // - caption2: 단위
  // - button: 버튼 글씨
  // - sectionTitle: 섹션 타이틀
  caption: {
    caption1: {
      fontFamily: FontFamily.variable,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.150390625,
    } as TextStyle,
    caption2: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
    } as TextStyle,
    button: {
      fontFamily: FontFamily.variable,
      fontSize: 18,
      lineHeight: 28,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.43950000405311584,
    } as TextStyle,
    sectionTitle: {
      fontFamily: FontFamily.variable,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3125,
    } as TextStyle,
  },
} as const;

/**
 * Typography 타입 정의
 */
export type TypographyKey =
  | `header.${keyof typeof Typography.header}`
  | `body.${keyof typeof Typography.body}`
  | `caption.${keyof typeof Typography.caption}`;

/**
 * Typography 스타일을 가져오는 헬퍼 함수
 *
 * @example
 * ```typescript
 * import { getTypographyStyle } from '@/commons/constants';
 *
 * const style = getTypographyStyle('header.h1');
 * ```
 */
export function getTypographyStyle(key: TypographyKey): TextStyle {
  const [category, style] = key.split('.') as [keyof typeof Typography, string];
  return Typography[category][style as never] as TextStyle;
}
