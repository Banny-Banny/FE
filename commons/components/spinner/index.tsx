/**
 * Spinner Component
 * Version: 1.0.0
 * Created: 2025-01-11
 *
 * [Pure UI Component] 로딩 스피너
 * - 전역적으로 사용 가능한 로딩 인디케이터
 */

import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { styles } from './styles';
import type { SpinnerProps } from './types';

export function Spinner({ size = 'large', color, fullScreen = false }: SpinnerProps = {}) {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color || '#007AFF'} />
    </View>
  );
}
