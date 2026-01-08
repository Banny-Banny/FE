/**
 * EggSlot Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import FilledEggIcon from '@/assets/images/filled_egg.svg';
import UnfilledEggIcon from '@/assets/images/unfilled_egg.svg';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useEggSlotData } from './hooks/useEggSlotData';
import { styles } from './styles';
import type { EggSlotProps } from './types';

export const EggSlot: React.FC<EggSlotProps> = ({ onPress }) => {
  const { slotData, isLoading } = useEggSlotData();

  // API 데이터가 없을 때 기본값 사용
  const remainingCount = slotData?.remainingSlots ?? 3;
  const totalCount = slotData?.totalSlots ?? 3;

  // 남은 개수가 전체 개수를 초과하지 않도록 제한
  const safeRemainingCount = Math.min(Math.max(0, remainingCount), totalCount);

  const handlePress = () => {
    if (onPress) {
      onPress(slotData);
    }
  };

  const content = (
    <View style={styles.container}>
      {Array.from({ length: totalCount }, (_, index) => {
        // remaining slots를 기준으로 찬 알 표시
        // 앞에서부터 remainingCount만큼 꽉찬 알, 그 다음부터 빈 알
        const isFilled = index < safeRemainingCount;
        const slotNumber = index + 1;

        return (
          <View key={slotNumber} style={styles.eggSlotItem}>
            <Image
              key={isFilled ? 'filled' : 'unfilled'}
              source={isFilled ? FilledEggIcon : UnfilledEggIcon}
              style={isFilled ? styles.eggSlotIcon : styles.eggSlotIconEmpty}
              contentFit="contain"
              accessibilityLabel={`에그 슬롯 ${slotNumber} - ${isFilled ? '사용됨' : '비어있음'}`}
            />
          </View>
        );
      })}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={styles.pressableWrapper}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="이스터에그 슬롯 정보 보기"
        disabled={isLoading}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.pressableWrapper}>{content}</View>;
};

export default EggSlot;
