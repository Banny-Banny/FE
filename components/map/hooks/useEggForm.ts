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

import { useState } from 'react';

interface UseEggFormProps {
  onEasterEggPress?: () => void;
}

export const useEggForm = ({ onEasterEggPress }: UseEggFormProps = {}) => {
  const [isEggFormVisible, setIsEggFormVisible] = useState(false);

  // 이스터에그 버튼 클릭 핸들러
  const handleEasterEggPress = () => {
    setIsEggFormVisible(true);
    // 외부 핸들러가 있으면 호출
    onEasterEggPress?.();
  };

  // 바텀시트 닫기 핸들러
  const handleCloseEggForm = () => {
    setIsEggFormVisible(false);
  };

  return {
    isEggFormVisible,
    handleEasterEggPress,
    handleCloseEggForm,
  };
};
