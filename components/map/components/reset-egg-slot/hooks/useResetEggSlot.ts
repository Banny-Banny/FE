/**
 * components/map/components/reset-egg-slot/hooks/useResetEggSlot.ts
 * 이스터에그 슬롯 초기화 API Hook
 *
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 슬롯 초기화 API 통신
 * - POST /api/capsules/slots/reset 엔드포인트 호출
 * - 이스터에그 슬롯을 3개로 초기화
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { apiClient, buildApiUrl, normalizeApiBaseUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

interface ResetEggSlotResponse {
  message?: string;
  slots_count?: number;
}

export interface UseResetEggSlotReturn {
  resetEggSlot: () => void;
  isResetting: boolean;
  error: Error | null;
}

/**
 * 이스터에그 슬롯 초기화 Hook
 * POST /api/capsules/slots/reset
 */
export const useResetEggSlot = (): UseResetEggSlotReturn => {
  const mutation = useMutation({
    mutationFn: async (): Promise<ResetEggSlotResponse> => {
      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        throw new Error(
          'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
        );
      }

      const response = await apiClient.post<ResetEggSlotResponse>(
        buildApiUrl(apiBaseUrl, API_ENDPOINTS.CAPSULE.SLOTS_RESET),
      );

      return response.data;
    },
    onSuccess: () => {
      Alert.alert('성공', '이스터에그 슬롯이 초기화되었습니다.');
    },
    onError: (error: unknown) => {
      if (__DEV__) {
        console.error('❌ 이스터에그 슬롯 초기화 실패:', error);
      }
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        '슬롯 초기화에 실패했습니다. 다시 시도해주세요.';
      Alert.alert('오류', errorMessage);
    },
  });

  return {
    resetEggSlot: mutation.mutate,
    isResetting: mutation.isPending,
    error: mutation.error as Error | null,
  };
};
