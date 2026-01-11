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
import { Platform, Pressable, Modal as RNModal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { DEFAULT_CONFIG, styles } from './styles';
import { ModalConfig } from './types';

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
  padding = DEFAULT_CONFIG.defaultPadding,
  closeOnBackdropPress = DEFAULT_CONFIG.closeOnBackdropPress,
  disableAnimation = false,
}) => {
  // Android + Fabric에서 Reanimated 진입/퇴장 애니메이션이 Modal 내부 View를 중복 마운트하며
  // "addViewAt: The specified child already has a parent" 크래시가 발생할 수 있음.
  // 안드로이드에서는 애니메이션을 비활성화해 안정성을 우선시한다.
  const shouldDisableAnimation = disableAnimation || Platform.OS === 'android';

  // 모달 컨테이너 스타일 계산 (width, height, padding)
  const modalContainerStyle = useMemo(() => {
    const dynamicStyle: any = {
      // iOS에서 콘텐츠가 밖으로 나가지 않도록 기본 제약 추가
      overflow: 'hidden',
      alignSelf: 'center',
    };

    // width 설정
    if (typeof width === 'number') {
      dynamicStyle.width = width;
      dynamicStyle.maxWidth = width; // iOS에서 명시적 제한
    } else if (typeof width === 'string') {
      dynamicStyle.width = width;
      // 퍼센트나 'auto'인 경우에도 maxWidth 제한
      if (width !== 'auto') {
        dynamicStyle.maxWidth = width;
      }
    }

    // height 설정
    if (height !== 'auto') {
      if (typeof height === 'number') {
        dynamicStyle.height = height;
        dynamicStyle.maxHeight = height; // iOS에서 명시적 제한
      } else if (typeof height === 'string') {
        dynamicStyle.height = height;
        if (height !== 'auto') {
          dynamicStyle.maxHeight = height;
        }
      }
    }

    // padding 설정
    if (padding !== undefined) {
      dynamicStyle.padding = padding;
    }

    return dynamicStyle;
  }, [width, height, padding]);

  // 뒷배경 클릭 핸들러
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  // visible이 false일 때 즉시 렌더링하지 않도록 처리
  if (!visible && shouldDisableAnimation) {
    return null;
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      {/* Backdrop (뒷배경) */}
      {shouldDisableAnimation ? (
        <View style={styles.backdrop} collapsable={false}>
          {/* Backdrop 영역 - 클릭 시 모달 닫기 */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          {/* Modal Container - absolute로 배치하여 Pressable과 분리 */}
          <View
            style={[styles.modalContainer, modalContainerStyle, styles.modalContainerAbsolute]}
            collapsable={false}>
            {/* Modal Content - children을 그대로 렌더링 */}
            {children}
          </View>
        </View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(100)}
          exiting={FadeOut.duration(100)}
          style={styles.backdrop}
          collapsable={false}>
          {/* Backdrop 영역 - 클릭 시 모달 닫기 */}
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          {/* Modal Container - absolute로 배치하여 Pressable과 분리 */}
          <Animated.View
            entering={SlideInUp.duration(150).damping(20).stiffness(90)}
            exiting={SlideOutDown.duration(100)}
            style={[styles.modalContainer, modalContainerStyle, styles.modalContainerAbsolute]}
            collapsable={false}>
            {/* Modal Content - children을 그대로 렌더링 */}
            {children}
          </Animated.View>
        </Animated.View>
      )}
    </RNModal>
  );
};

export default Modal;
