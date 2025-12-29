/**
 * commons/components/button/Button.tsx
 * 단일 Button 컴포넌트
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ButtonProps } from './types';

export function Button({
  label,
  variant = 'primary',
  size = 'L',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  disabled = false,
  onPress,
}: ButtonProps) {
  // 크기
  const heights = { L: 64, M: 56, S: 48 };
  const height = heights[size];

  // 배경색
  let backgroundColor = '#0A0A0A'; // primary
  if (variant === 'secondary') backgroundColor = '#B2B2B2';
  if (variant === 'outline') backgroundColor = '#FAFAFA';

  // 텍스트 색
  let textColor = '#FAFAFA'; // primary, secondary
  if (variant === 'outline') textColor = '#0A0A0A';

  // Border radius
  const borderRadii = { L: 24, M: 20, S: 16 };
  const borderRadius = borderRadii[size];

  // 아이콘만 표시
  const showIconOnly = iconPosition === 'only' && icon;
  const showIconWithText = iconPosition === 'left' && icon;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          height,
          backgroundColor,
          borderRadius,
          width: fullWidth ? '100%' : undefined,
        },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: '#E4E4E4',
        },
      ]}>
      <View style={styles.content}>
        {(showIconOnly || showIconWithText) && icon && (
          <Icon
            name={icon as any}
            size={20}
            color={textColor}
            style={showIconWithText ? { marginRight: 8 } : undefined}
          />
        )}
        {!showIconOnly && <Text style={[styles.text, { color: textColor }]}>{label}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
