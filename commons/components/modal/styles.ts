/**
 * commons/components/modal/styles.ts
 * Modal 컴포넌트 스타일 및 상수 정의
 *
 * @description
 * - Figma 노드 370:3126 기준 디자인 값
 * - 모든 색상은 commons/constants/color.ts의 Colors 사용
 * - Backdrop과 Modal Container 스타일 정의
 * - 내부 컨텐츠 스타일은 사용처에서 정의
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';

/**
 * 모달 디자인 시스템 스타일
 * Figma 노드 370:3126에서 추출한 값
 */
const MODAL_STYLES = {
  /**
   * 뒷배경(Backdrop) 색상
   * Figma: #000000 with opacity 0.6
   */
  backdropColor: 'rgba(0, 0, 0, 0.6)',

  /**
   * 모달 배경색
   * Figma: #fafafa → Colors.white[500]
   */
  backgroundColor: Colors.white[500],

  /**
   * 모달 테두리 색상
   * Figma: #fafafa (배경색과 동일)
   */
  borderColor: Colors.white[500],

  /**
   * 모달 테두리 두께
   * Figma: 1px stroke
   */
  borderWidth: 1,

  /**
   * 모달 모서리 둥글기
   * Figma: 24px
   */
  borderRadius: 24,

  /**
   * 모달 내부 여백
   * Figma 분석 결과: 약 20px
   */
  padding: 20,

  /**
   * 모달 그림자 (React Native shadow 스타일)
   * 모달을 부각시키기 위한 그림자 효과
   */
  shadow: {
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8, // Android shadow
  },
} as const;

/**
 * 모달 기본 설정값
 */
export const DEFAULT_CONFIG = {
  /**
   * 기본 가로 크기
   * Figma: 344px (모바일 기준 약 90%)
   */
  defaultWidth: 344,

  /**
   * 기본 세로 크기
   * 내용에 따라 자동 조절
   */
  defaultHeight: 'auto' as const,

  /**
   * 뒷배경 클릭 시 닫기 기본값
   */
  closeOnBackdropPress: true,
} as const;

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
