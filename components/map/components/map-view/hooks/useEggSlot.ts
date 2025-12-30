/**
 * Egg Slot Data Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] Egg Slot 정보 조회
 * ⚠️ 현재는 Mock 데이터 사용 중
 * TODO: 백엔드 API 연동 시 실제 데이터로 교체 필요
 *
 * @see components/map/components/egg-form/hooks/useEggForm.ts - EGG_SLOTS_EXCEEDED 에러 처리 참고
 */

import { useMemo } from 'react';
import { MOCK_EGG_SLOT_TOTAL_COUNT, MOCK_EGG_SLOT_USED_COUNT } from '../constants/mockData';

export interface EggSlotData {
  /** 사용된 슬롯 개수 */
  usedCount: number;
  /** 전체 슬롯 개수 */
  totalCount: number;
  /** 남은 슬롯 개수 */
  remainingCount: number;
  /** 슬롯 사용률 (0 ~ 1) */
  usageRate: number;
}

export interface UseEggSlotReturn {
  /** 슬롯 데이터 */
  slotData: EggSlotData;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * Egg Slot 정보를 조회하는 Hook
 *
 * ⚠️ 현재는 Mock 데이터 사용 중
 * TODO: 백엔드 API 연동 필요
 * - GET /api/user/slots 또는
 * - GET /api/auth/me 응답에 슬롯 정보 포함
 *
 * @returns {UseEggSlotReturn} 슬롯 정보 및 로딩 상태
 */
export function useEggSlot(): UseEggSlotReturn {
  // TODO: 실제 API 호출로 교체
  // const { data, isLoading } = useQuery({
  //   queryKey: ['eggSlots'],
  //   queryFn: async () => {
  //     const response = await apiClient.get('/api/user/slots');
  //     return response.data;
  //   },
  // });

  const slotData = useMemo<EggSlotData>(() => {
    const usedCount = MOCK_EGG_SLOT_USED_COUNT;
    const totalCount = MOCK_EGG_SLOT_TOTAL_COUNT;
    const remainingCount = Math.max(0, totalCount - usedCount);
    const usageRate = totalCount > 0 ? usedCount / totalCount : 0;

    return {
      usedCount,
      totalCount,
      remainingCount,
      usageRate,
    };
  }, []);

  return {
    slotData,
    isLoading: false, // Mock 데이터는 즉시 반환
  };
}

