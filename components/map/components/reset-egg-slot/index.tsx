/**
 * ResetEggSlot Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 *
 * Note: 마이페이지에서 이스터에그 수정, 삭제 기능 추가 시 삭제 될 예정
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useResetEggSlot } from './hooks/useResetEggSlot';
import { styles } from './styles';

export const ResetEggSlot: React.FC = () => {
  const { resetEggSlot, isResetting } = useResetEggSlot();

  const handlePress = () => {
    resetEggSlot();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={isResetting}
        accessibilityRole="button"
        accessibilityLabel="이스터에그 슬롯 초기화"
        accessibilityHint="이스터에그 슬롯을 3개로 초기화합니다">
        <Icon name="refresh-line" size={24} color={Colors.black[500]} />
      </TouchableOpacity>
    </View>
  );
};

export default ResetEggSlot;
