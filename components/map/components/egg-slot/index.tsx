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

import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import type { EggSlotProps } from './types';

export const EggSlot: React.FC<EggSlotProps> = ({ usedCount, totalCount = 3 }) => {
  // 사용된 개수가 전체 개수를 초과하지 않도록 제한
  const safeUsedCount = Math.min(Math.max(0, usedCount), totalCount);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalCount }, (_, index) => {
        const isFilled = index < safeUsedCount;
        const slotNumber = index + 1;

        return (
          <View key={slotNumber} style={styles.eggSlotItem}>
            <View style={styles.eggSlotIconWrapper}>
              {isFilled ? (
                <Image
                  source={require('../../../../assets/icons/egg-icon.svg')}
                  style={styles.eggSlotIcon}
                  contentFit="contain"
                  accessibilityLabel={`에그 슬롯 ${slotNumber} - 사용됨`}
                />
              ) : (
                <View style={styles.eggSlotIconEmpty}>
                  <Image
                    source={require('../../../../assets/icons/egg-icon.svg')}
                    style={styles.eggSlotIconOutline}
                    contentFit="contain"
                    accessibilityLabel={`에그 슬롯 ${slotNumber} - 비어있음`}
                  />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default EggSlot;

