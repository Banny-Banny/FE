/**
 * EggSlotModal Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

export interface EggSlotModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 사용된 egg 슬롯 개수 (0 ~ totalCount) */
  usedCount: number;
  /** 전체 egg 슬롯 개수 (기본값: 3) */
  totalCount?: number;
}
