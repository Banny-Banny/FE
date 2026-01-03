/**
 * useToggle Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Pure Logic] Boolean 상태 토글 관리
 * - 모달, 바텀시트, 드롭다운 등 열림/닫힘 상태 관리
 * - open, close, toggle 함수 제공
 * - 선택적 콜백 지원 (onOpen, onClose)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const { isOpen, open, close, toggle } = useToggle();
 *
 * // 초기값 설정
 * const { isOpen, open, close } = useToggle(true);
 *
 * // 콜백과 함께 사용
 * const { isOpen, open, close } = useToggle({
 *   initialValue: false,
 *   onOpen: () => console.log('opened'),
 *   onClose: () => console.log('closed'),
 * });
 * ```
 */

import { useState, useCallback } from 'react';

interface UseToggleOptions {
  /** 초기값 (기본값: false) */
  initialValue?: boolean;
  /** 열림 시 호출될 콜백 */
  onOpen?: () => void;
  /** 닫힘 시 호출될 콜백 */
  onClose?: () => void;
}

type UseToggleReturn = {
  /** 현재 상태 */
  isOpen: boolean;
  /** 상태를 true로 설정 */
  open: () => void;
  /** 상태를 false로 설정 */
  close: () => void;
  /** 상태를 토글 */
  toggle: () => void;
};

/**
 * useToggle Hook
 * Boolean 상태를 관리하는 범용 훅
 *
 * @param options - 초기값 및 콜백 옵션
 * @returns {UseToggleReturn} isOpen, open, close, toggle
 */
export const useToggle = (
  options?: boolean | UseToggleOptions
): UseToggleReturn => {
  // 옵션 파싱: boolean이면 initialValue로, 객체면 옵션으로 처리
  const initialValue =
    typeof options === 'boolean' ? options : options?.initialValue ?? false;
  const onOpen = typeof options === 'object' ? options?.onOpen : undefined;
  const onClose = typeof options === 'object' ? options?.onClose : undefined;

  const [isOpen, setIsOpen] = useState(initialValue);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }
      return next;
    });
  }, [onOpen, onClose]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useToggle;

