/**
 * My Egg Detail API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 상세 조회 API 통신
 * - GET /api/capsules/{id}/detail 엔드포인트 호출
 * - react-query를 사용한 데이터 페칭
 * - 미디어 ID를 URL로 변환
 * - 좌표를 주소로 변환
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * API 응답 타입: FOUND 타입
 */
export interface FoundEggDetailResponse {
  eggId: string;
  type: 'FOUND';
  isMine: boolean;
  title: string;
  message: string;
  imageMediaId: string | null;
  imageObjectKey: string | null;
  audioMediaId: string | null;
  audioObjectKey: string | null;
  videoMediaId: string | null;
  videoObjectKey: string | null;
  location: {
    address: string | null;
    latitude: number;
    longitude: number;
  };
  author: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
  createdAt: string;
  foundAt: string;
  expiredAt: string | null;
  discoveredCount: number;
  viewers: Array<{
    id: string;
    nickname: string;
    profileImg: string | null;
    viewedAt: string;
  }>;
}

/**
 * API 응답 타입: PLANTED 타입
 */
export interface PlantedEggDetailResponse {
  eggId: string;
  type: 'PLANTED';
  isMine: boolean;
  title: string;
  message: string;
  imageMediaId: string | null;
  imageObjectKey: string | null;
  audioMediaId: string | null;
  audioObjectKey: string | null;
  videoMediaId: string | null;
  videoObjectKey: string | null;
  location: {
    address: string | null;
    latitude: number;
    longitude: number;
  };
  author: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
  createdAt: string;
  foundAt: string | null;
  expiredAt: string | null;
  discoveredCount: number;
  viewers: Array<{
    id: string;
    nickname: string;
    profileImg: string | null;
    viewedAt: string;
  }>;
}

export type EggDetailResponse = FoundEggDetailResponse | PlantedEggDetailResponse;

/**
 * 변환된 상세 데이터 타입 (모달에서 사용)
 */
export interface TransformedEggDetail {
  eggId: string;
  type: 'FOUND' | 'PLANTED';
  isMine: boolean;
  title: string;
  message: string;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  location: {
    address: string | null;
    latitude: number;
    longitude: number;
  };
  author: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
  createdAt: string;
  foundAt: string | null;
  expiredAt: string | null;
  discoveredCount: number;
  viewers: Array<{
    id: string;
    nickname: string;
    profileImg: string | null;
    viewedAt: string;
  }>;
}

export interface UseEggDetailParams {
  eggId: string | null;
}

export interface UseEggDetailReturn {
  /** 상세 데이터 (원본 API 응답) */
  data: EggDetailResponse | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 데이터 재조회 함수 */
  refetch: () => Promise<void>;
}

/**
 * 이스터에그 상세를 조회하는 Hook
 *
 * @param params 조회 파라미터
 * @returns 상세 데이터, 로딩 상태, 에러, 재조회 함수
 */
export function useEggDetail(params: UseEggDetailParams): UseEggDetailReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  // API 호출
  const {
    data: apiData,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['eggDetail', params.eggId] as const,
    queryFn: async () => {
      // eggId가 없으면 API 호출하지 않음
      if (!params.eggId || !accessToken) {
        if (__DEV__) {
        }
        return null;
      }

      const endpoint = `${API_ENDPOINTS.CAPSULE.LIST}/${params.eggId}/detail`;
      const response = await apiClient.get<EggDetailResponse>(endpoint);
      return response.data;
    },
    enabled: !!accessToken && !authLoading && !!params.eggId,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  // 원본 데이터를 그대로 반환 (모달 컴포넌트에서 직접 변환)

  const refetch = async () => {
    if (accessToken && params.eggId) {
      await refetchQuery();
    }
  };

  return {
    data: apiData ?? null,
    isLoading: isLoading || authLoading,
    error: error
      ? (() => {
          if (error instanceof AxiosError) {
            return (
              error.response?.data?.message || '이스터에그 상세를 불러오는 중 오류가 발생했습니다.'
            );
          }
          if (error instanceof Error) {
            return error.message;
          }
          return '이스터에그 상세를 불러오는 중 오류가 발생했습니다.';
        })()
      : null,
    refetch,
  };
}
