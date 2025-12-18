/**
 * useFabAnimation Hook
 * Version: 1.0.0
 * Created: 2025-12-17
 *
 * FAB 버튼의 애니메이션 및 상태 관리를 담당하는 커스텀 훅
 */

import { useState } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

// 애니메이션 설정 상수
const ANIMATION_CONFIG = {
  spring: {
    damping: 15,
    stiffness: 150,
  },
  timing: {
    duration: 200,
  },
  rotation: {
    expanded: 45,
    collapsed: 0,
  },
  subButtons: {
    expanded: 0,
    collapsed: 50,
  },
};

export const useFabAnimation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const subButtonsTranslateY = useSharedValue(ANIMATION_CONFIG.subButtons.collapsed);

  /**
   * 메인 버튼 클릭 핸들러
   * FAB 메뉴를 열거나 닫음
   */
  const handleMainButtonPress = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // 메인 버튼 회전 애니메이션
    rotation.value = withSpring(
      newExpandedState ? ANIMATION_CONFIG.rotation.expanded : ANIMATION_CONFIG.rotation.collapsed,
      ANIMATION_CONFIG.spring,
    );

    // 오버레이 페이드 애니메이션
    overlayOpacity.value = withTiming(newExpandedState ? 1 : 0, ANIMATION_CONFIG.timing);

    // 서브 버튼 슬라이드 애니메이션
    subButtonsTranslateY.value = withSpring(
      newExpandedState
        ? ANIMATION_CONFIG.subButtons.expanded
        : ANIMATION_CONFIG.subButtons.collapsed,
      ANIMATION_CONFIG.spring,
    );
  };

  /**
   * 서브 버튼 클릭 핸들러
   * FAB 메뉴를 닫고 콜백을 실행
   */
  const handleSubButtonPress = (callback?: () => void) => {
    setIsExpanded(false);
    rotation.value = withSpring(ANIMATION_CONFIG.rotation.collapsed, ANIMATION_CONFIG.spring);
    overlayOpacity.value = withTiming(0, ANIMATION_CONFIG.timing);
    subButtonsTranslateY.value = withSpring(
      ANIMATION_CONFIG.subButtons.collapsed,
      ANIMATION_CONFIG.spring,
    );
    callback?.();
  };

  /**
   * 메인 버튼 회전 애니메이션 스타일
   */
  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  /**
   * 오버레이 페이드 애니메이션 스타일
   */
  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  /**
   * 서브 버튼 슬라이드 애니메이션 스타일
   */
  const animatedSubButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subButtonsTranslateY.value }],
    opacity: 1 - subButtonsTranslateY.value / ANIMATION_CONFIG.subButtons.collapsed,
  }));

  return {
    isExpanded,
    handleMainButtonPress,
    handleSubButtonPress,
    animatedRotationStyle,
    animatedOverlayStyle,
    animatedSubButtonsStyle,
  };
};

