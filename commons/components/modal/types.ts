/**
 * commons/components/modal/types.ts
 * Modal 시스템 타입 정의
 */

import { ReactNode } from 'react';

/**
 * 모달 설정 타입
 */
export interface ModalConfig {
  /** 모달 내부에 표시할 컨텐츠 */
  children: ReactNode;
  /** 모달 가로 크기 (number: px, string: '%' 또는 'auto') */
  width?: number | string;
  /** 모달 세로 크기 (number: px, string: '%' 또는 'auto') */
  height?: number | string;
  /** 뒷배경 클릭 시 모달 닫기 여부 (기본값: true) */
  closeOnBackdropPress?: boolean;
  /** 모달 닫힐 때 호출되는 콜백 함수 */
  onClose?: () => void;
}

/**
 * 모달 상태 타입
 */
export interface ModalState {
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 모달 설정 */
  config: ModalConfig | null;
}

/**
 * Modal Context 타입
 */
export interface ModalContextType {
  /** 모달 열기 함수 */
  openModal: (config: ModalConfig) => void;
  /** 모달 닫기 함수 */
  closeModal: () => void;
}
