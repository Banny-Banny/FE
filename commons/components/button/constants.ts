/**
 * commons/components/button/constants.ts
 * Button 컴포넌트 상수 정의
 */

import { ButtonSize, ButtonVariant } from './types';

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
  L: 24,
  M: 20,
  S: 16,
};

/**
 * 버튼 Variant별 배경색
 */
export const BUTTON_BACKGROUND_COLORS: Record<ButtonVariant, string> = {
  primary: '#0A0A0A',
  secondary: '#B2B2B2',
  outline: '#FAFAFA',
  danger: '#FF3B30',
};

/**
 * 버튼 Variant별 텍스트 색상
 */
export const BUTTON_TEXT_COLORS: Record<ButtonVariant, string> = {
  primary: '#FAFAFA',
  secondary: '#FAFAFA',
  outline: '#0A0A0A',
  danger: '#FAFAFA',
};

/**
 * Outline variant의 테두리 색상
 */
export const BUTTON_OUTLINE_BORDER_COLOR = '#E4E4E4';

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
export const BUTTON_ICON_TEXT_GAP = 8;

/**
 * 버튼 가로 패딩 (px)
 */
export const BUTTON_HORIZONTAL_PADDING = 20;

/**
 * 버튼 텍스트 폰트 크기 (px)
 */
export const BUTTON_FONT_SIZE = 18;

/**
 * DualButton 간격 (px)
 */
export const DUAL_BUTTON_GAP = 12;
