/**
 * commons/components/button/index.tsx
 * Button 컴포넌트
 */

import React from 'react';
import { DimensionValue, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import {
  BUTTON_ICON_SIZE,
  BUTTON_ICON_TEXT_GAP,
  ButtonSize,
  ButtonVariant,
  createButtonStyle,
  getTextColor,
  styles,
} from './styles';

// ============================================================================
// 타입 정의 (styles.ts에서 re-export)
// ============================================================================

export type { ButtonSize, ButtonVariant } from './styles';

/**
 * 아이콘 위치 타입
 * - left: 아이콘 + 텍스트 (아이콘이 텍스트 왼쪽)
 * - right: 아이콘 + 텍스트 (아이콘이 텍스트 오른쪽)
 * - only: 아이콘만 표시 (텍스트 숨김)
 */
export type IconPosition = 'left' | 'right' | 'only';

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps {
  /**
   * 버튼 텍스트 (필수)
   */
  label: string;

  /**
   * 버튼 variant (선택, 기본값: 'primary')
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기 (선택, 기본값: 'L')
   */
  size?: ButtonSize;

  /**
   * 아이콘 이름 (선택)
   * react-native-remix-icon 아이콘 이름
   * @example 'ri-inbox-line', 'ri-share-line'
   */
  icon?: string;

  /**
   * 아이콘 위치 (선택, 기본값: 'left')
   * - left: 아이콘 + 텍스트 (아이콘이 텍스트 왼쪽)
   * - right: 아이콘 + 텍스트 (아이콘이 텍스트 오른쪽)
   * - only: 아이콘만
   */
  iconPosition?: IconPosition;

  /**
   * 전체 너비 사용 여부 (선택, 기본값: true)
   * width가 지정되면 무시됨
   */
  fullWidth?: boolean;

  /**
   * 커스텀 너비 (선택)
   * 숫자(px) 또는 퍼센트 문자열 지정 가능
   * @example width={200} // 200px
   * @example width="50%" // 50%
   */
  width?: DimensionValue;

  /**
   * 비활성화 상태 (선택, 기본값: false)
   */
  disabled?: boolean;

  /**
   * 버튼 클릭 핸들러 (필수)
   */
  onPress: () => void;
}

// ============================================================================
// Button 컴포넌트
// ============================================================================

function ButtonComponent({
  label,
  variant = 'primary',
  size = 'L',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  width,
  disabled = false,
  onPress,
}: ButtonProps) {
  // disabled 상태일 때 variant를 'disabled'로 변경
  const actualVariant = disabled ? 'disabled' : variant;

  // 스타일 생성
  const buttonStyle = createButtonStyle(actualVariant, size, fullWidth, width);
  const textColor = getTextColor(actualVariant);

  // 아이콘 표시 여부
  const showIconOnly = iconPosition === 'only' && icon;
  const showIconWithTextLeft = iconPosition === 'left' && icon;
  const showIconWithTextRight = iconPosition === 'right' && icon;

  return (
    <Pressable
      onPress={
        disabled
          ? undefined
          : () => {
              onPress();
            }
      }
      disabled={disabled}
      style={[styles.button, buttonStyle]}>
      <View style={styles.content}>
        {showIconWithTextLeft && icon && (
          <Icon
            name={icon as any}
            size={BUTTON_ICON_SIZE}
            color={textColor}
            style={{ marginRight: BUTTON_ICON_TEXT_GAP }}
          />
        )}
        {!showIconOnly && <Text style={[styles.text, { color: textColor }]}>{label}</Text>}
        {showIconWithTextRight && icon && (
          <Icon
            name={icon as any}
            size={BUTTON_ICON_SIZE}
            color={textColor}
            style={{ marginLeft: BUTTON_ICON_TEXT_GAP }}
          />
        )}
        {showIconOnly && icon && (
          <Icon name={icon as any} size={BUTTON_ICON_SIZE} color={textColor} />
        )}
      </View>
    </Pressable>
  );
}

// React DevTools를 위한 displayName 설정
ButtonComponent.displayName = 'Button';

// Named export
export const Button = ButtonComponent;

// Default export
export default Button;
