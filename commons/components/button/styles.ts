/**
 * commons/components/button/styles.ts
 * Button 컴포넌트 스타일 유틸리티
 */

import { DimensionValue, StyleSheet, ViewStyle } from 'react-native';
import { ButtonSize, ButtonVariant } from './types';
import {
  BUTTON_BACKGROUND_COLORS,
  BUTTON_BORDER_RADII,
  BUTTON_DISABLED_OPACITY,
  BUTTON_FONT_SIZE,
  BUTTON_HEIGHTS,
  BUTTON_HORIZONTAL_PADDING,
  BUTTON_OUTLINE_BORDER_COLOR,
  BUTTON_TEXT_COLORS,
} from './constants';

/**
 * 버튼 스타일 생성
 */
export const createButtonStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  width: DimensionValue | undefined,
  disabled: boolean
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
    opacity: disabled ? BUTTON_DISABLED_OPACITY : 1,
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

/**
 * 기본 버튼 스타일
 */
export const buttonStyles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: BUTTON_HORIZONTAL_PADDING,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: 'bold',
  },
});
