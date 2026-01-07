/**
 * useZoomControl Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * ZoomControl 컴포넌트의 비즈니스 로직 및 상태 관리를 담당하는 커스텀 훅
 */

import { useCallback } from 'react';

export interface UseZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
}

export interface UseZoomControlReturn {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
  isZoomInDisabled: boolean;
  isZoomOutDisabled: boolean;
  hasResetButton: boolean;
}

/**
 * ZoomControl 컴포넌트의 비즈니스 로직을 관리하는 훅
 */
export function useZoomControl({
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn = true,
  canZoomOut = true,
}: UseZoomControlProps): UseZoomControlReturn {
  /**
   * 확대 버튼 클릭 핸들러
   */
  const handleZoomIn = useCallback(() => {
    if (canZoomIn) {
      onZoomIn();
    }
  }, [onZoomIn, canZoomIn]);

  /**
   * 축소 버튼 클릭 핸들러
   */
  const handleZoomOut = useCallback(() => {
    if (canZoomOut) {
      onZoomOut();
    }
  }, [onZoomOut, canZoomOut]);

  /**
   * 줌 리셋 버튼 클릭 핸들러
   */
  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  return {
    handleZoomIn,
    handleZoomOut,
    handleReset,
    isZoomInDisabled: !canZoomIn,
    isZoomOutDisabled: !canZoomOut,
    hasResetButton: !!onReset,
  };
}

