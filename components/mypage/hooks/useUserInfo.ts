/**
 * User Info API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 내 정보 조회 API 통신
 * - GET /api/auth/me 엔드포인트 호출
 * - react-query를 사용한 데이터 페칭
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import type { UserInfoResponse, UseUserInfoReturn } from '../types';

/**
 * 내 정보를 조회하는 Hook
 */
export function useUserInfo(): UseUserInfoReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: queryKeys.userInfo(),
    queryFn: async () => {
      // API 엔드포인트: GET /api/auth/me
      const endpoint = `/${API_ENDPOINTS.AUTH.ME}`;

      const response = await apiClient.get<UserInfoResponse>(endpoint);
      // API 응답 형식: { success: boolean, data: { ... } }
      return response.data.data;
    },
    enabled: !!accessToken && !authLoading, // 토큰이 있고 인증 로딩이 끝났을 때만 호출
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const refetch = async () => {
    // 토큰이 있을 때만 refetch
    if (accessToken) {
      await refetchQuery();
    }
  };

  return {
    data: data || null,
    isLoading: isLoading || authLoading, // 인증 로딩 중이면 로딩 상태
    error: error
      ? (() => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              return '비활성화된 사용자입니다.';
            }
            return (
              error.response?.data?.message || '사용자 정보를 불러오는 중 오류가 발생했습니다.'
            );
          }
          if (error instanceof Error) {
            return error.message;
          }
          return '사용자 정보를 불러오는 중 오류가 발생했습니다.';
        })()
      : null,
    refetch,
  };
}
