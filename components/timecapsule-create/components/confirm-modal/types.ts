/**
 * components/timecapsule-create/components/confirm-modal/types.ts
 * ConfirmModal 타입 정의
 */

import { IconName } from 'react-native-remix-icon';

/**
 * 모달 타입 정의
 * - PAYMENT_COMPLETE: 결제완료 확인 모달
 * - SUBMIT_CONFIRM: 제출 전 재확인 모달
 * - SUBMIT_COMPLETE: 제출완료 확인 모달
 */
export type ConfirmModalType = 'PAYMENT_COMPLETE' | 'SUBMIT_CONFIRM' | 'SUBMIT_COMPLETE';

/**
 * ConfirmModal 컴포넌트 Props
 */
export interface ConfirmModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 타입 (3가지 중 선택) */
  type: ConfirmModalType;
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 시 콜백 (SUBMIT_CONFIRM 타입에서만 사용) */
  onCancel?: () => void;
  /** 모달 닫기 콜백 (backdrop 클릭 또는 기타 닫기 이벤트) */
  onClose?: () => void;
}

/**
 * 모달 내용 설정 타입
 */
export interface ModalContentConfig {
  /** 제목 텍스트 */
  title: string;
  /** 설명 텍스트 */
  description: string;
  /** 아이콘 이름 (react-native-remix-icon) */
  iconName: IconName;
  /** 아이콘 색상 */
  iconColor: string;
  /** 아이콘 크기 */
  iconSize: number;
  /** 아이콘 컨테이너 크기 */
  iconContainerSize: number;
  /** 아이콘 컨테이너 배경색 */
  iconContainerColor: string;
  /** 확인 버튼 텍스트 */
  confirmText: string;
  /** 취소 버튼 텍스트 (buttonCount가 2일 때 사용) */
  cancelText?: string;
  /** 버튼 개수 (1 또는 2) */
  buttonCount: 1 | 2;
  /** 뒷배경 클릭 시 모달 닫기 여부 */
  closeOnBackdropPress: boolean;
  /** 모달 가로 크기 */
  width: number;
  /** 모달 세로 크기 */
  height: 'auto' | number;
}
