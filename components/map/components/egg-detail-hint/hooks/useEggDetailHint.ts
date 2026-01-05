/**
 * components/map/components/egg-detail-hint/hooks/useEggDetailHint.ts
 * 이스터에그 힌트 컴포넌트 비즈니스 로직 Hook
 *
 * @description
 * - 프로그레스 바 애니메이션 로직
 * - 타이머 관리 로직
 * - 힌트 데이터 조회 (실제 capsule 데이터 기반)
 */

import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import type { CapsuleItem } from '../../map-view/types';

import { createHintDataFromCapsule, DURATION_MS, PROGRESS_CONTAINER_WIDTH } from '../constants';
import type { EggHintData } from '../types';

export interface UseEggDetailHintReturn {
  progressBarStyle: Array<{ width: Animated.AnimatedInterpolation<number> }>;
  hintData: EggHintData;
  arrowTransformStyle: { transform: Array<{ rotate: string }> };
}

export interface UseEggDetailHintProps {
  visible: boolean;
  onClose: () => void;
  capsule: CapsuleItem | null;
  currentLocation: { lat: number; lng: number } | null;
}

/**
 * 이스터에그 힌트 토스트 애니메이션 및 데이터를 관리하는 Hook
 */
export function useEggDetailHint({
  visible,
  onClose,
  capsule,
  currentLocation,
}: UseEggDetailHintProps): UseEggDetailHintReturn {
  const progressAnim = useRef(new Animated.Value(1)).current; // 1 = 100%, 0 = 0%

  // 실제 capsule 데이터를 기반으로 힌트 데이터 생성
  const hintData: EggHintData = useMemo(() => {
    if (!capsule) {
      // capsule이 없을 경우 기본값 반환
      return {
        title: '근처에 이스터에그가 있어요!',
        distance: 0,
        direction: undefined,
      };
    }

    // constants.ts의 createHintDataFromCapsule 함수 사용
    return createHintDataFromCapsule(capsule, currentLocation || undefined);
  }, [capsule, currentLocation]);

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

  // 프로그레스 바 스타일 (hook에서 계산하여 반환)
  const progressBarStyle = useMemo(() => [{ width: progressWidth }], [progressWidth]);

  // 방향 화살표 transform 스타일 (hook에서 계산하여 반환)
  const arrowTransformStyle = useMemo(() => {
    const direction = hintData.direction || 0;
    return {
      transform: [{ rotate: `${direction}deg` }],
    };
  }, [hintData.direction]);

  return {
    progressBarStyle,
    hintData,
    arrowTransformStyle,
  };
}
