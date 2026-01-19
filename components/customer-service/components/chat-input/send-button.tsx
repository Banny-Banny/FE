/**
 * components/customer-service/components/chat-input/send-button.tsx
 * 전송 버튼 컴포넌트
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { SendButtonProps } from './types';
import { styles } from './styles';
import { Colors } from '@/commons/constants';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * 전송 버튼 컴포넌트
 * 
 * @description
 * - 네이버 톡톡 스타일의 전송 버튼
 * - 애니메이션 포함
 * - 비활성화 상태 지원
 */
export function SendButton({ onPress, disabled = false, isLoading = false }: SendButtonProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1, { duration: 200 }),
      transform: [
        {
          scale: withSpring(disabled ? 0.95 : 1, {
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[styles.sendButton, animatedStyle]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}>
      <View style={styles.sendButtonContent}>
        {isLoading ? (
          <Icon name="loader-4-line" size={20} color={Colors.white[50]} />
        ) : (
          <Icon name="send-plane-fill" size={20} color={Colors.white[50]} />
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
}
