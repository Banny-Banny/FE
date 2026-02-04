/**
 * EggDetailHint Component
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
 * - [x] react-native-remix-icon 사용
 */

import QuestionEggIcon from '@/assets/images/question_egg.svg';
import { Image } from 'expo-image';
import React from 'react';
import { Animated, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Colors } from '@/commons/constants';

import { useEggDetailHint } from './hooks/useEggDetailHint';
import { styles } from './styles';
import type { EggDetailHintProps } from './types';

export const EggDetailHint: React.FC<EggDetailHintProps> = ({
  visible,
  onClose,
  capsule,
  currentLocation,
}) => {
  // 비즈니스 로직은 Hook에서 가져옴 (애니메이션 + 데이터)
  const { progressBarStyle, hintData, arrowTransformStyle } = useEggDetailHint({
    visible,
    onClose,
    capsule,
    currentLocation,
  });

  if (!visible) {
    return null;
  }

  // 거리 포맷팅 (예: "약 70.5m 거리") - 소수점 한 자리까지만 표시
  const formattedDistance = `약 ${hintData.distance.toFixed(1)}m 거리`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 메인 컨텐츠 영역 */}
        <View style={styles.contentContainer}>
          {/* 왼쪽: 알 아이콘 */}
          <View style={styles.iconContainer}>
            <Image
              source={QuestionEggIcon}
              style={styles.eggIcon}
              contentFit="contain"
              accessibilityLabel="이스터에그 아이콘"
            />
          </View>

          {/* 중앙: 텍스트 영역 */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{hintData.title}</Text>
            <View style={styles.distanceContainer}>
              <Icon name="map-pin-line" size={12} color={Colors.grey[800]} />
              <Text style={styles.distanceText}>{formattedDistance}</Text>
            </View>
          </View>

          {/* 오른쪽: 방향 화살표 (이스터에그가 있는 방향) */}
          <View style={styles.arrowContainer}>
            <View style={[styles.arrowWrapper, arrowTransformStyle]}>
              <Icon name="arrow-up-line" size={24} color={Colors.black[500]} />
            </View>
          </View>
        </View>

        {/* 진행 바 */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, ...progressBarStyle]} />
        </View>
      </View>
    </View>
  );
};

export default EggDetailHint;
