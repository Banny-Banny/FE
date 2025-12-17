/**
 * components/map/components/fab-btn/index.tsx
 * 우측 하단 플로팅 버튼
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FabBtnProps } from './types';
import { styles } from './styles';

export const FabBtn: React.FC<FabBtnProps> = ({ onPress, label }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

