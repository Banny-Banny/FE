/**
 * useEggForm Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 작성 폼 바텀시트 상태 관리
 * - 바텀시트 표시/숨김 상태 관리
 * - 이스터에그 버튼 클릭 핸들러
 * - 바텀시트 닫기 핸들러
 */

import { useToggle } from '@/commons/hooks';
import { useCallback } from 'react';

interface UseEggFormProps {
  onEasterEggPress?: () => void;
}

export const useEggForm = ({ onEasterEggPress }: UseEggFormProps = {}) => {
  const { isOpen: isEggFormVisible, open, close: handleCloseEggForm } = useToggle({
    onOpen: onEasterEggPress,
  });

  // 이스터에그 버튼 클릭 핸들러
  const handleEasterEggPress = useCallback(() => {
    open();
  }, [open]);

  return {
    isEggFormVisible,
    handleEasterEggPress,
    handleCloseEggForm,
  };
};
