/**
 * commons/components/modal/styles.ts
 * Modal 컴포넌트 스타일 정의
 *
 * @description
 * - MODAL_STYLES 상수를 사용하여 스타일 정의
 * - Backdrop과 Modal Container 스타일만 정의
 * - 내부 컨텐츠 스타일은 사용처에서 정의
 */

import { StyleSheet } from 'react-native';
import { MODAL_STYLES } from './constants';

export const styles = StyleSheet.create({
  /**
   * 뒷배경 (Backdrop) 스타일
   * - 전체 화면 커버
   * - 반투명 검은색 배경
   * - 중앙 정렬
   */
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: MODAL_STYLES.backdropColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Backdrop Pressable 영역
   * - 전체 영역을 터치 가능하게 만듦
   */
  backdropPressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * 모달 컨테이너 스타일
   * - 중앙 정렬
   * - 피그마 기준 디자인 적용
   * - width/height는 props로 동적 설정
   */
  modalContainer: {
    backgroundColor: MODAL_STYLES.backgroundColor,
    borderRadius: MODAL_STYLES.borderRadius,
    padding: MODAL_STYLES.padding,
    borderWidth: MODAL_STYLES.borderWidth,
    borderColor: MODAL_STYLES.borderColor,
    // Shadow styles (iOS & Android)
    ...MODAL_STYLES.shadow,
    // 최대 너비 제한 (화면보다 크지 않게)
    maxWidth: '90%',
    maxHeight: '90%',
  },
});
