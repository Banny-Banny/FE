/**
 * Egg Slot Data Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 슬롯 정보 조회 API 통신
 * - GET /api/capsules/slots 엔드포인트 호출
 * - 에러 처리 로직 포함
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { useCallback, useEffect, useState } from 'react';

export interface EggSlotDataResponse {
  /** 전체 슬롯 개수 (기본 슬롯은 최대 3개, 이후 추가 구매나 이벤트를 통해 증가 가능) */
  totalSlots: number;
  /** 사용된 슬롯 개수 */
  usedSlots: number;
  /** 남은 슬롯 개수 */
  remainingSlots: number;
}

export interface UseEggSlotDataReturn {
  /** 슬롯 데이터 */
  slotData: EggSlotDataResponse | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 데이터 재조회 함수 */
  refetch: () => Promise<void>;
}

/**
 * 슬롯 정보를 조회하는 Hook
 *
 * @returns {UseEggSlotDataReturn} 슬롯 정보, 로딩 상태, 에러, 재조회 함수
 */
export function useEggSlotData(): UseEggSlotDataReturn {
  const [slotData, setSlotData] = useState<EggSlotDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlotData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<EggSlotDataResponse>(API_ENDPOINTS.CAPSULE.SLOTS);

      setSlotData(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '슬롯 정보를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setSlotData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlotData();
  }, [fetchSlotData]);

  return {
    slotData,
    isLoading,
    error,
    refetch: fetchSlotData,
  };
}
