/**
 * components/timecapsule-create/components/confirm-modal/types.ts
 * ConfirmModal 컴포넌트 타입 정의
 */

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
  /** 모달 타입 (3가지 중 선택) */
  type: ConfirmModalType;
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 시 콜백 (SUBMIT_CONFIRM 타입에서만 사용) */
  onCancel?: () => void;
  /** 추가 데이터 (SUBMIT_COMPLETE에서 개봉일, 참여인원 표시용) */
  data?: {
    openDate?: string; // 개봉일 (예: "2026년 1월 16일")
    participantCount?: number; // 참여 인원
    dDay?: number; // D-day (예: 365)
    capsuleName?: string; // 캡슐 이름
  };
}

/**
 * 모달 내용 설정 타입
 */
export interface ModalContentConfig {
  title: string;
  subtitle?: string;
  description: string;
  iconName: string;
  iconColor: string;
  iconBackgroundColor: string;
  confirmText: string;
  cancelText?: string;
  buttonCount: 1 | 2;
  closeOnBackdropPress: boolean;
  width: number;
  height: 'auto' | number;
}
