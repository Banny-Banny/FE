/**
 * EggSlot Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { EggSlotDataResponse } from './hooks/useEggSlotData';

export interface EggSlotProps {
  /** 클릭 핸들러 - 슬롯 데이터를 전달 (선택) */
  onPress?: (slotData: EggSlotDataResponse | null) => void;
}
