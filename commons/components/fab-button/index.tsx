/**
 * FAB Button Component
 * Version: 1.0.0
 * Created: 2025-12-16
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] nativewind 토큰 참조만 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';

// 텍스트 상수
const LABELS = {
  easterEgg: '이스터에그',
  timeCapsule: '타임캡슐',
};

interface FabButtonProps {
  onEasterEggPress?: () => void;
  onTimeCapsulePress?: () => void;
}

export const FabButton: React.FC<FabButtonProps> = ({ onEasterEggPress, onTimeCapsulePress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const subButtonsTranslateY = useSharedValue(50);

  const handleMainButtonPress = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // Rotation animation for main button
    rotation.value = withSpring(newExpandedState ? 45 : 0, {
      damping: 15,
      stiffness: 150,
    });

    // Overlay fade animation
    overlayOpacity.value = withTiming(newExpandedState ? 1 : 0, {
      duration: 200,
    });

    // Sub buttons slide animation
    subButtonsTranslateY.value = withSpring(newExpandedState ? 0 : 50, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleSubButtonPress = (callback?: () => void) => {
    setIsExpanded(false);
    rotation.value = withSpring(0);
    overlayOpacity.value = withTiming(0);
    subButtonsTranslateY.value = withSpring(50);
    callback?.();
  };

  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedSubButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subButtonsTranslateY.value }],
    opacity: 1 - subButtonsTranslateY.value / 50,
  }));

  return (
    <View style={styles.container}>
      {/* Dimmed Overlay */}
      {isExpanded && (
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <Pressable
            style={styles.overlayPressable}
            onPress={() => handleMainButtonPress()}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          />
        </Animated.View>
      )}

      {/* Sub Buttons Container */}
      {isExpanded && (
        <Animated.View style={[styles.subButtonsContainer, animatedSubButtonsStyle]}>
          {/* Easter Egg Button */}
          <TouchableOpacity
            style={styles.subButtonRow}
            onPress={() => handleSubButtonPress(onEasterEggPress)}
            accessibilityRole="button"
            accessibilityLabel={LABELS.easterEgg}>
            <Text style={styles.subButtonLabel}>{LABELS.easterEgg}</Text>
            <View style={styles.subButtonCircle}>
              <Image
                source={require('../../../assets/icons/egg-icon.svg')}
                style={styles.subButtonIcon}
                contentFit="contain"
                accessibilityLabel="이스터에그 아이콘"
              />
            </View>
          </TouchableOpacity>

          {/* Time Capsule Button */}
          <TouchableOpacity
            style={styles.subButtonRow}
            onPress={() => handleSubButtonPress(onTimeCapsulePress)}
            accessibilityRole="button"
            accessibilityLabel={LABELS.timeCapsule}>
            <Text style={styles.subButtonLabel}>{LABELS.timeCapsule}</Text>
            <View style={styles.subButtonCircle}>
              <View style={styles.capsuleIconContainer}>
                <Image
                  source={require('../../../assets/icons/capsule-icon.svg')}
                  style={styles.capsuleIcon}
                  contentFit="contain"
                  accessibilityLabel="타임캡슐 아이콘"
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Main FAB Button */}
      <View style={styles.mainButtonContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleMainButtonPress}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? '닫기' : '메뉴 열기'}
          accessibilityState={{ expanded: isExpanded }}>
          <Animated.View style={[styles.mainButtonInner, animatedRotationStyle]}>
            {isExpanded ? (
              <Image
                source={require('../../../assets/icons/close-icon.svg')}
                style={styles.mainButtonIcon}
                contentFit="contain"
                accessibilityLabel="닫기 아이콘"
              />
            ) : (
              <Image
                source={require('../../../assets/icons/plus-icon.svg')}
                style={styles.mainButtonIcon}
                contentFit="contain"
                accessibilityLabel="더하기 아이콘"
              />
            )}
          </Animated.View>
          <View style={styles.mainButtonShadowInset} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FabButton;
