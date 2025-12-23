/**
 * commons/components/modal/hooks/useModal.ts
 * useModal Hook 구현
 *
 * @description
 * - ModalContext에서 모달 제어 함수 가져오기
 * - openModal, closeModal 함수 제공
 * - Provider 외부에서 사용 시 에러 발생
 */

import { useContext } from 'react';
import { ModalContext } from '@/commons/layout/provider/modal/modal.context';
import { ModalContextType } from '../types';

/**
 * useModal Hook
 * 모달을 제어하기 위한 Hook
 *
 * @throws {Error} ModalProvider 외부에서 사용 시 에러 발생
 *
 * @returns {ModalContextType} openModal, closeModal 함수
 *
 * @example
 * ```tsx
 * import { useModal } from '@/commons/components/modal/hooks/useModal';
 *
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 *
 *   const handleOpenModal = () => {
 *     openModal({
 *       width: 300,
 *       children: (
 *         <View>
 *           <Text>모달 내용</Text>
 *           <Pressable onPress={closeModal}>
 *             <Text>닫기</Text>
 *           </Pressable>
 *         </View>
 *       ),
 *     });
 *   };
 *
 *   return (
 *     <Pressable onPress={handleOpenModal}>
 *       <Text>모달 열기</Text>
 *     </Pressable>
 *   );
 * }
 * ```
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      'useModal must be used within a ModalProvider. ' +
        'Make sure your component is wrapped with <ModalProvider>.'
    );
  }

  return context;
};

export default useModal;
