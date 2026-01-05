/**
 * useRefreshAnimation Hook
 * Version: 1.0.0
 * Created: 2025-12-18
 *
 * 새로고침 버튼의 회전 애니메이션을 담당하는 커스텀 훅
 */

import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

// 애니메이션 설정 상수
const ANIMATION_CONFIG = {
  duration: 1000, // 1초
  rotation: 360, // 360도 회전
};

export const useRefreshAnimation = (isRefreshing: boolean = false) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRefreshing) {
      // 동기화 중일 때 무한 회전 애니메이션 시작
      rotation.value = withRepeat(
        withTiming(ANIMATION_CONFIG.rotation, { duration: ANIMATION_CONFIG.duration }),
        -1, // 무한 반복
        false, // 역방향 없음
      );
    } else {
      // 동기화 완료 시 즉시 정지
      rotation.value = 0;
    }
  }, [isRefreshing, rotation]);

  /**
   * 새로고침 아이콘 회전 애니메이션 스타일
   */
  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return {
    animatedRotationStyle,
  };
};

