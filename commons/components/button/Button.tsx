/**
 * commons/components/button/Button.tsx
 * 단일 Button 컴포넌트
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { BUTTON_ICON_SIZE, BUTTON_ICON_TEXT_GAP } from './constants';
import { buttonStyles, createButtonStyle, getTextColor } from './styles';
import { ButtonProps } from './types';

export function Button({
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
  // 스타일 생성
  const buttonStyle = createButtonStyle(variant, size, fullWidth, width, disabled);
  const textColor = getTextColor(variant);

  // 아이콘 표시 여부
  const showIconOnly = iconPosition === 'only' && icon;
  const showIconWithText = iconPosition === 'left' && icon;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[buttonStyles.button, buttonStyle]}>
      <View style={buttonStyles.content}>
        {(showIconOnly || showIconWithText) && icon && (
          <Icon
            name={icon as any}
            size={BUTTON_ICON_SIZE}
            color={textColor}
            style={showIconWithText ? { marginRight: BUTTON_ICON_TEXT_GAP } : undefined}
          />
        )}
        {!showIconOnly && (
          <Text style={[buttonStyles.text, { color: textColor }]}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}
