/**
 * EggSlot Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

export interface EggSlotProps {
  /** 사용된 egg 슬롯 개수 (0 ~ totalCount) */
  usedCount: number;
  /** 전체 egg 슬롯 개수 (기본값: 3) */
  totalCount?: number;
}

