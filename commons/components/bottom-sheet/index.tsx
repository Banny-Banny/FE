/**
 * commons/components/bottom-sheet/index.tsx
 * 재사용 가능한 BottomSheet 공통 컴포넌트
 *
 * 주요 기능:
 * - Modal 기반 바텀시트 구현
 * - 검은색 반투명 배경 (dim overlay)
 * - 드래그하여 확장/축소 가능
 * - 초기 높이(60%) -> 풀스크린(100%)
 * - 내부 스크롤 지원
 * - 외부 클릭 시 닫기
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { styles } from './styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT - 100; // 바텀시트 높이 (상단 100px 제외)
const INITIAL_SNAP = BOTTOM_SHEET_HEIGHT * 0.4; // 초기 위치 (40%만큼 아래로 = 60% 보임)
const FULL_SNAP = 0; // 풀스크린 위치 (이동 없음 = 100% 보임)

// Props 인터페이스 정의
export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode; // 하단 고정 영역 (버튼 등)
  showHandle?: boolean;
  initialHeight?: number; // 초기 높이 (픽셀 단위, 선택사항)
  maxHeight?: number; // 최대 높이 제한 (픽셀 단위, 선택사항)
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
  footer,
  showHandle = true,
  initialHeight,
  maxHeight,
}) => {
  // maxHeight가 있으면 해당 값 사용, 없으면 기본값 사용
  const actualMaxHeight = maxHeight ?? BOTTOM_SHEET_HEIGHT;
  // initialHeight가 있으면 해당 값 사용, 없으면 최대 높이 사용
  const actualInitialHeight = initialHeight ?? actualMaxHeight;

  // 애니메이션 값 초기화
  const translateY = useRef(new Animated.Value(actualInitialHeight)).current;
  const sheetHeight = useRef(new Animated.Value(actualInitialHeight)).current; // 초기 높이
  const [isExpanded, setIsExpanded] = useState(actualInitialHeight >= actualMaxHeight);

  // isVisible 변경 시 애니메이션 실행
  useEffect(() => {
    if (isVisible) {
      setIsExpanded(actualInitialHeight >= actualMaxHeight);
      // 높이를 초기 높이로 리셋
      sheetHeight.setValue(actualInitialHeight);
      // 먼저 화면 밖으로 위치 리셋 (애니메이션 없이)
      translateY.setValue(actualInitialHeight);
      // 그 다음 슬라이드 업 애니메이션 (화면 하단으로)
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: false, // height 애니메이션 때문에 false
      }).start();
    } else {
      // 슬라이드 다운 애니메이션 (화면 밖으로)
      Animated.timing(translateY, {
        toValue: actualInitialHeight,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, translateY, sheetHeight, actualInitialHeight, actualMaxHeight]);

  // 핸들 탭 핸들러 (확장/축소 토글)
  const handleToggleExpand = () => {
    if (isExpanded) {
      // 축소
      setIsExpanded(false);
      Animated.spring(sheetHeight, {
        toValue: actualMaxHeight * 0.6,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start();
    } else {
      // 확장
      setIsExpanded(true);
      Animated.spring(sheetHeight, {
        toValue: actualMaxHeight,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start();
    }
  };

  // PanResponder 설정 (드래그 핸들링)
  // ⭐ 핸들 영역에만 적용되도록 수정 (footer 버튼 클릭 허용)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return false; // ⭐ 기본적으로 비활성화
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 수직 이동이 수평 이동보다 클 때만 PanResponder 활성화
        // ⭐ 최소 5px 이상 이동해야 드래그로 인식 (버튼 클릭과 구분)
        const shouldActivate =
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 5;
        if (shouldActivate) {
        }
        return shouldActivate;
      },
      onPanResponderMove: (_, gestureState) => {
        // 드래그 중 처리 없음
      },
      onPanResponderRelease: (_, gestureState) => {
        const velocity = gestureState.vy;

        // 아래로 드래그 시 닫기
        if (gestureState.dy > 100 && velocity > 0.5) {
          Animated.timing(translateY, {
            toValue: actualInitialHeight,
            duration: 200,
            useNativeDriver: false,
          }).start(() => onClose());
          return;
        }

        // 위로 드래그 시 확장 (풀스크린)
        if (gestureState.dy < -50 || velocity < -0.5) {
          setIsExpanded(true);
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: false,
            }),
            Animated.spring(sheetHeight, {
              toValue: actualMaxHeight,
              tension: 65,
              friction: 11,
              useNativeDriver: false,
            }),
          ]).start();
          return;
        }

        // 아래로 드래그 시 축소 (초기 위치)
        if (gestureState.dy > 50 || velocity > 0.5) {
          setIsExpanded(false);
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: false,
            }),
            Animated.spring(sheetHeight, {
              toValue: actualMaxHeight * 0.6,
              tension: 65,
              friction: 11,
              useNativeDriver: false,
            }),
          ]).start();
          return;
        }

        // 기본: 현재 위치로 스냅
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            tension: 65,
            friction: 11,
            useNativeDriver: false,
          }),
          Animated.spring(sheetHeight, {
            toValue: isExpanded ? actualMaxHeight : actualMaxHeight * 0.6,
            tension: 65,
            friction: 11,
            useNativeDriver: false,
          }),
        ]).start();
      },
    }),
  ).current;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.modalContainer}>
        {/* 검은색 반투명 배경 (외부 클릭 영역) */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* 바텀시트 컨테이너 */}
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              height: sheetHeight,
              transform: [{ translateY }],
            },
          ]}>
          {/* 드래그 핸들 영역 */}
          {showHandle && (
            <View style={styles.handleContainer} {...panResponder.panHandlers}>
              <Pressable onPress={handleToggleExpand}>
                <View style={styles.handle} />
              </Pressable>
            </View>
          )}

          {/* 바텀시트 내용 (항상 스크롤 가능) */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEnabled={true}>
            {children}
          </ScrollView>

          {/* 하단 고정 영역 (footer) - ⭐ PanResponder 영향 받지 않도록 설정 */}
          {footer && (
            <View style={styles.footer} pointerEvents="auto">
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};
