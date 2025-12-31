/**
 * Capsules API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 캡슐 목록 조회 API 통신
 * - GET /api/capsules 엔드포인트 호출
 * - 위치 기반 캡슐 목록 조회
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { buildEndpointWithQuery } from '@/utils/api';
import { apiClient } from '@/utils/apiClient';
import { useCallback, useEffect, useState } from 'react';
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
  const [capsules, setCapsules] = useState<CapsuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCapsules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = buildEndpointWithQuery(API_ENDPOINTS.CAPSULE.LIST, {
        lat: params.lat,
        lng: params.lng,
        radius_m: params.radius_m,
        limit: params.limit,
        include_locationless: params.include_locationless,
        include_consumed: params.include_consumed,
      });

      const response = await apiClient.get<CapsulesResponse>(endpoint);

      setCapsules(response.data.items || []);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '캡슐 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    params.lat,
    params.lng,
    params.radius_m,
    params.limit,
    params.include_locationless,
    params.include_consumed,
  ]);

  useEffect(() => {
    if (params.lat && params.lng) {
      fetchCapsules();
    }
  }, [params.lat, params.lng, fetchCapsules]);

  return {
    capsules,
    isLoading,
    error,
    refetch: fetchCapsules,
  };
}
