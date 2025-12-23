/**
 * commons/components/modal/constants.ts
 * Modal 시스템 상수 정의
 *
 * @description
 * - Figma 노드 370:3126 기준 디자인 값
 * - 모든 색상은 commons/constants/color.ts의 Colors 사용
 */

import { Colors } from '@/commons/constants/color';

/**
 * 모달 디자인 시스템 스타일
 * Figma 노드 370:3126에서 추출한 값
 */
export const MODAL_STYLES = {
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
