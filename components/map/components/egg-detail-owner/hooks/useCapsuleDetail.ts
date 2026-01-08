/**
 * Capsule Detail API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 캡슐 상세 조회 API 통신
 * - GET /api/capsules/{id}?lat={latitude}&lng={longitude} 엔드포인트 호출
 * - react-query를 사용한 데이터 페칭
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { buildEndpointWithQuery } from '@/utils/api';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';

import type { CapsuleDetailResponse } from '../types';

export interface UseCapsuleDetailParams {
  capsuleId: string | null;
  lat: number | null;
  lng: number | null;
}

export interface UseCapsuleDetailReturn {
  data: CapsuleDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 캡슐 상세 정보를 조회하는 Hook
 */
export function useCapsuleDetail({
  capsuleId,
  lat,
  lng,
}: UseCapsuleDetailParams): UseCapsuleDetailReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.capsuleDetail({
      capsuleId: capsuleId || '',
      lat: lat ?? 0,
      lng: lng ?? 0,
    }),
    queryFn: async () => {
      if (!capsuleId || lat === null || lng === null) {
        return null;
      }

      // API 엔드포인트: GET /api/capsules/{id}?lat={latitude}&lng={longitude}
      const endpoint = buildEndpointWithQuery(`${API_ENDPOINTS.CAPSULE.LIST}/${capsuleId}`, {
        lat,
        lng,
      });

      const response = await apiClient.get<CapsuleDetailResponse>(endpoint);
      return response.data;
    },
    enabled: !!capsuleId && lat !== null && lng !== null,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  return {
    data: data || null,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '상세 정보를 불러오는 중 오류가 발생했습니다.'
      : null,
  };
}
