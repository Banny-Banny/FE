/**
 * components/timecapsule-create/components/confirm-modal/constants.ts
 * ConfirmModal 상수 정의
 *
 * @description
 * - 3가지 모달 타입별 설정 정의 (Figma 노드에서 확인한 값 사용)
 * - 공통 디자인 값 정의
 */

import { Colors } from '@/commons/constants/color';
import { ModalContentConfig } from './types';

/**
 * 모달 타입별 내용 설정
 * - Figma 노드에서 확인한 값 사용
 * - 노드 214:1721 → PAYMENT_COMPLETE
 * - 노드 370:2795 → SUBMIT_CONFIRM
 * - 노드 370:2921 → SUBMIT_COMPLETE
 */
export const MODAL_CONTENTS: Record<string, ModalContentConfig> = {
  /**
   * PAYMENT_COMPLETE - 결제완료 확인 모달
   * Figma 노드 214:1721
   */
  PAYMENT_COMPLETE: {
    title: '결제가 완료되었습니다!',
    description: '', // Figma에서 설명 텍스트 없음
    iconName: 'bank-card-2-line',
    iconColor: Colors.black[500],
    iconSize: 34,
    iconContainerSize: 80,
    iconContainerColor: Colors.white[500],
    confirmText: '확인',
    buttonCount: 1,
    closeOnBackdropPress: true,
    width: 344,
    height: 'auto',
  },
  /**
   * SUBMIT_CONFIRM - 제출 전 재확인 모달
   * Figma 노드 370:2795
   */
  SUBMIT_CONFIRM: {
    title: '이대로 타임캡슐을 묻을까요?',
    description: '한 번 닫힌 타임캡슐은 수정할 수 없어요',
    iconName: 'question-fill',
    iconColor: Colors.black[500],
    iconSize: 64,
    iconContainerSize: 112,
    iconContainerColor: Colors.white[500],
    confirmText: '묻기',
    cancelText: '취소',
    buttonCount: 2,
    closeOnBackdropPress: false, // 실수 방지
    width: 344,
    height: 'auto',
  },
  /**
   * SUBMIT_COMPLETE - 제출완료 확인 모달
   * Figma 노드 370:2921
   */
  SUBMIT_COMPLETE: {
    title: '타임캡슐이\n성공적으로 묻혔습니다!',
    description: '', // Figma에서 설명 텍스트 없음 (타임캡슐 정보 박스는 별도 구현 필요 시 추가)
    iconName: 'capsule-fill',
    iconColor: Colors.black[500],
    iconSize: 48,
    iconContainerSize: 90,
    iconContainerColor: Colors.white[500],
    confirmText: '확인',
    buttonCount: 1,
    closeOnBackdropPress: true,
    width: 344,
    height: 'auto',
  },
} as const;

/**
 * 공통 디자인 값
 * - Figma에서 확인한 값 사용
 */
export const MODAL_DESIGN = {
  // Border radius
  borderRadius: {
    modal: 24, // 모달 전체 cornerRadius
    iconContainer: 28, // 아이콘 컨테이너 cornerRadius
    button: 20, // 버튼 cornerRadius (PAYMENT_COMPLETE, SUBMIT_COMPLETE)
    buttonSmall: 16, // 버튼 cornerRadius (SUBMIT_CONFIRM)
  },
  // Spacing (간격)
  spacing: {
    iconToTitle: 24, // 아이콘과 제목 사이 간격
    titleToDescription: 8, // 제목과 설명 사이 간격
    descriptionToButton: 24, // 설명과 버튼 사이 간격
    buttonGap: 12, // 버튼 2개일 때 버튼 사이 간격
  },
  // Padding
  padding: {
    vertical: 32, // 모달 상하 패딩
    horizontal: 20, // 모달 좌우 패딩
  },
  // Button
  button: {
    height: 57, // PAYMENT_COMPLETE, SUBMIT_COMPLETE 버튼 높이
    heightSmall: 60, // SUBMIT_CONFIRM 버튼 높이
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
} as const;
