/**
 * components/map/components/egg-detail-hint/hooks/useEggDetailHint.ts
 * 이스터에그 힌트 컴포넌트 비즈니스 로직 Hook
 *
 * @description
 * - 프로그레스 바 애니메이션 로직
 * - 타이머 관리 로직
 * - 힌트 데이터 조회 (API 또는 Mock)
 */

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { DURATION_MS, MOCK_HINT_DATA, PROGRESS_CONTAINER_WIDTH } from '../constants';
import type { EggHintData } from '../types';

export interface UseEggDetailHintReturn {
  progressWidth: Animated.AnimatedInterpolation<number>;
  hintData: EggHintData;
}

export interface UseEggDetailHintProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 이스터에그 힌트 토스트 애니메이션 및 데이터를 관리하는 Hook
 */
export function useEggDetailHint({
  visible,
  onClose,
}: UseEggDetailHintProps): UseEggDetailHintReturn {
  const progressAnim = useRef(new Animated.Value(1)).current; // 1 = 100%, 0 = 0%

  // TODO: API 연동 시 여기서 힌트 데이터를 가져옴
  // 현재는 Mock 데이터 사용
  const hintData: EggHintData = MOCK_HINT_DATA;

  useEffect(() => {
    if (visible) {
      // 프로그레스 바 애니메이션 시작 (10초 동안 100% -> 0%)
      progressAnim.setValue(1);
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: DURATION_MS,
        useNativeDriver: false, // width는 native driver 미지원
      }).start(() => {
        // 애니메이션 완료 후 자동으로 닫기
        onClose();
      });
    } else {
      // visible이 false가 되면 애니메이션 중지
      progressAnim.stopAnimation();
    }
  }, [visible, progressAnim, onClose]);

  // 프로그레스 바 너비 계산 (전체 너비 234px 기준)
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_CONTAINER_WIDTH], // 0% -> 0px, 100% -> 234px
  });

  return {
    progressWidth,
    hintData,
  };
}
