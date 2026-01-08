/**
 * Capsules API Hook
 * Version: 2.0.0
 * Created: 2025-01-XX
 * Updated: 2025-01-XX - react-query로 마이그레이션
 *
 * [Business Logic] 캡슐 목록 조회 API 통신
 * - GET /api/capsules 엔드포인트 호출
 * - 위치 기반 캡슐 목록 조회
 * - react-query를 사용한 데이터 페칭
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { buildEndpointWithQuery } from '@/utils/api';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import type { CapsuleItem, CapsulesResponse } from '../types';

export interface UseCapsulesParams {
  lat: number;
  lng: number;
  radius_m?: number; // 기본 300, 10~5000
  limit?: number; // 기본 50, ≤200
  include_locationless?: boolean;
  include_consumed?: boolean;
}

export interface UseCapsulesReturn {
  capsules: CapsuleItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 캡슐 목록을 조회하는 Hook
 */
export function useCapsules(params: UseCapsulesParams): UseCapsulesReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: queryKeys.capsules({
      lat: params.lat,
      lng: params.lng,
      radius_m: params.radius_m,
      limit: params.limit,
      include_locationless: params.include_locationless,
      include_consumed: params.include_consumed,
    }),
    queryFn: async () => {
      // 인증 토큰이 없으면 API 호출하지 않음
      if (!accessToken) {
        if (__DEV__) {
          console.warn('[useCapsules] 토큰이 없어 API 호출을 건너뜁니다.');
        }
        return { items: [] };
      }

      const endpoint = buildEndpointWithQuery(API_ENDPOINTS.CAPSULE.LIST, {
        lat: params.lat,
        lng: params.lng,
        radius_m: params.radius_m,
        limit: params.limit,
        include_locationless: params.include_locationless,
        include_consumed: params.include_consumed,
      });

      const response = await apiClient.get<CapsulesResponse>(endpoint);
      return response.data;
    },
    enabled: !!accessToken && !authLoading && !!params.lat && !!params.lng,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  const refetch = async () => {
    if (accessToken) {
      await refetchQuery();
    }
  };

  return {
    capsules: data?.items || [],
    isLoading: isLoading || authLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '캡슐 목록을 불러오는 중 오류가 발생했습니다.'
      : null,
    refetch,
  };
}
