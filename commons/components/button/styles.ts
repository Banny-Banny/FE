/**
 * commons/components/button/styles.ts
 * Button 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] Typography 토큰 사용
 * - [✓] 인라인 스타일 0건
 * - [✓] Figma 디자인 1:1 대응
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { DimensionValue, StyleSheet, TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 버튼 Variant 타입
 * - disabled: 진한 회색 배경 (비활성화 상태)
 * - primary: 검은색 배경 (활성화 상태, 기본)
 * - outline: 흰색 배경 + 검은색 테두리 + 아이콘 (공유 등)
 * - danger: 빨간색 배경 (로그아웃, 삭제 등)
 */
export type ButtonVariant = 'disabled' | 'primary' | 'outline' | 'danger';

/**
 * 버튼 크기 타입
 * - L: Large (64px)
 * - M: Medium (56px)
 * - S: Small (48px)
 */
export type ButtonSize = 'L' | 'M' | 'S';

// ============================================================================
// 상수 정의
// ============================================================================

/**
 * 버튼 크기별 높이 (px)
 */
export const BUTTON_HEIGHTS: Record<ButtonSize, number> = {
  L: 64,
  M: 56,
  S: 48,
};

/**
 * 버튼 크기별 Border Radius (px)
 */
export const BUTTON_BORDER_RADII: Record<ButtonSize, number> = {
  L: BorderRadius['2xl'], // 24
  M: BorderRadius.xl, // 20
  S: BorderRadius.lg, // 16
};

/**
 * 버튼 Variant별 배경색
 */
export const BUTTON_BACKGROUND_COLORS: Record<ButtonVariant, string> = {
  disabled: Colors.grey[500], // #B2B2B2
  primary: Colors.black[500], // #0A0A0A
  outline: Colors.white[500], // #FAFAFA
  danger: Colors.red[500], // #FF515A
};

/**
 * 버튼 Variant별 텍스트 색상
 */
export const BUTTON_TEXT_COLORS: Record<ButtonVariant, string> = {
  disabled: Colors.white[500], // #FAFAFA
  primary: Colors.white[500], // #FAFAFA
  outline: Colors.black[500], // #0A0A0A
  danger: Colors.white[500], // #FAFAFA
};

/**
 * Outline variant의 테두리 색상
 */
export const BUTTON_OUTLINE_BORDER_COLOR = Colors.whiteGrey[500]; // #E4E4E4

/**
 * Disabled 상태의 Opacity
 */
export const BUTTON_DISABLED_OPACITY = 0.4;

/**
 * 아이콘 크기 (px)
 */
export const BUTTON_ICON_SIZE = 20;

/**
 * 아이콘과 텍스트 간격 (px)
 */
export const BUTTON_ICON_TEXT_GAP = Spacing.sm; // 8

/**
 * 버튼 가로 패딩 (px)
 * Note: Spacing.md는 16이지만 기존 디자인 값 20을 유지
 */
export const BUTTON_HORIZONTAL_PADDING = 20;

// ============================================================================
// 스타일 유틸리티 함수
// ============================================================================

/**
 * 버튼 스타일 생성
 */
export const createButtonStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  width: DimensionValue | undefined,
): ViewStyle => {
  const height = BUTTON_HEIGHTS[size];
  const borderRadius = BUTTON_BORDER_RADII[size];
  const backgroundColor = BUTTON_BACKGROUND_COLORS[variant];

  return {
    height,
    borderRadius,
    backgroundColor,
    // width 우선순위: width prop > fullWidth
    width: width !== undefined ? width : fullWidth ? '100%' : undefined,
    // outline variant는 테두리 추가
    ...(variant === 'outline' && {
      borderWidth: 1,
      borderColor: BUTTON_OUTLINE_BORDER_COLOR,
    }),
  };
};

/**
 * 텍스트 색상 가져오기
 */
export const getTextColor = (variant: ButtonVariant): string => {
  return BUTTON_TEXT_COLORS[variant];
};

// ============================================================================
// StyleSheet 정의
// ============================================================================

export const styles = StyleSheet.create({
  // 버튼 컨테이너
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: BUTTON_HORIZONTAL_PADDING,
  },
  // 버튼 내부 컨텐츠 (아이콘 + 텍스트)
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 버튼 텍스트
  text: {
    ...Typography.caption.button, // fontSize: 18, fontWeight: 'bold', lineHeight: 28
  } as TextStyle,
});
