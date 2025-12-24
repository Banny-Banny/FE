/**
 * commons/layout/provider/modal/modal.provider.tsx
 * Modal Provider 구현
 *
 * @description
 * - 모달 상태 관리
 * - openModal, closeModal 함수 제공
 * - Modal 컴포넌트 렌더링
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ModalContext } from './modal.context';
import { Modal } from '@/commons/components/modal';
import { ModalConfig, ModalState } from '@/commons/components/modal/types';

interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * Modal Provider 컴포넌트
 * 앱의 최상위 레이아웃에서 사용
 *
 * @example
 * ```tsx
 * // app/_layout.tsx
 * import { ModalProvider } from '@/commons/layout/provider/modal/modal.provider';
 *
 * export default function RootLayout() {
 *   return (
 *     <ModalProvider>
 *       <Stack />
 *     </ModalProvider>
 *   );
 * }
 * ```
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // 모달 상태 관리
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    config: null,
  });

  /**
   * 모달 열기 함수
   * @param config - 모달 설정 (children, width, height, closeOnBackdropPress, onClose)
   */
  const openModal = useCallback((config: ModalConfig) => {
    setModalState({
      isVisible: true,
      config,
    });
  }, []);

  /**
   * 모달 닫기 함수
   * onClose 콜백이 있으면 실행
   */
  const closeModal = useCallback(() => {
    // onClose 콜백 실행
    if (modalState.config?.onClose) {
      modalState.config.onClose();
    }

    // 모달 상태 초기화
    setModalState({
      isVisible: false,
      config: null,
    });
  }, [modalState.config]);

  // Context value 메모이제이션
  const contextValue = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Modal 렌더링 - isVisible이 true일 때만 표시 */}
      {modalState.isVisible && modalState.config && (
        <Modal
          visible={modalState.isVisible}
          onClose={closeModal}
          width={modalState.config.width}
          height={modalState.config.height}
          closeOnBackdropPress={modalState.config.closeOnBackdropPress}
        >
          {modalState.config.children}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
