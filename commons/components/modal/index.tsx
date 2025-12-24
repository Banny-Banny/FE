/**
 * commons/components/modal/index.tsx
 * Modal 컴포넌트 구현
 *
 * @description
 * - Backdrop과 Modal Container로 구성
 * - children (ReactNode)를 통해 모든 내부 컨텐츠를 자유롭게 구성
 * - Figma 디자인 시스템 기준 스타일 적용
 */

import React, { useMemo } from 'react';
import { View, Pressable, Modal as RNModal } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { ModalConfig } from './types';
import { DEFAULT_CONFIG, styles } from './styles';

interface ModalProps extends ModalConfig {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
}

/**
 * Modal 컴포넌트
 *
 * @example
 * ```tsx
 * <Modal
 *   visible={isVisible}
 *   onClose={handleClose}
 *   width={300}
 *   closeOnBackdropPress={true}
 * >
 *   <View>
 *     <Text>모달 내용</Text>
 *   </View>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  width = DEFAULT_CONFIG.defaultWidth,
  height = DEFAULT_CONFIG.defaultHeight,
  closeOnBackdropPress = DEFAULT_CONFIG.closeOnBackdropPress,
}) => {
  // 모달 컨테이너 스타일 계산 (width, height)
  const modalContainerStyle = useMemo(() => {
    const dynamicStyle: any = {};

    // width 설정
    if (typeof width === 'number') {
      dynamicStyle.width = width;
    } else if (typeof width === 'string') {
      dynamicStyle.width = width;
    }

    // height 설정
    if (height !== 'auto') {
      if (typeof height === 'number') {
        dynamicStyle.height = height;
      } else if (typeof height === 'string') {
        dynamicStyle.height = height;
      }
    }

    return dynamicStyle;
  }, [width, height]);

  // 뒷배경 클릭 핸들러
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop (뒷배경) */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropPressable} onPress={handleBackdropPress}>
          {/* Modal Container */}
          <Animated.View
            entering={SlideInUp.duration(300).springify()}
            exiting={SlideOutDown.duration(200)}
            style={[styles.modalContainer, modalContainerStyle]}
            // 모달 내부 클릭 시 이벤트 전파 중단 (backdrop close 방지)
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Modal Content - children을 그대로 렌더링 */}
            {children}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </RNModal>
  );
};

export default Modal;
