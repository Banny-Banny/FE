/**
 * Egg Slot Data Hook
 * Version: 2.0.0
 * Created: 2025-01-XX
 * Updated: 2025-01-XX - react-query로 마이그레이션
 *
 * [Business Logic] 슬롯 정보 조회 API 통신
 * - GET /api/capsules/slots 엔드포인트 호출
 * - react-query를 사용한 데이터 페칭
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';

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
  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: queryKeys.eggSlotData(),
    queryFn: async () => {
      const response = await apiClient.get<EggSlotDataResponse>(API_ENDPOINTS.CAPSULE.SLOTS);
      return response.data;
    },
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  const refetch = async () => {
    await refetchQuery();
  };

  return {
    slotData: data || null,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '슬롯 정보를 불러오는 중 오류가 발생했습니다.'
      : null,
    refetch,
  };
}
