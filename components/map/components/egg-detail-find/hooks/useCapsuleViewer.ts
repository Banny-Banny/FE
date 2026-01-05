/**
 * Capsule Viewer API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 캡슐 뷰어 등록 API 통신
 * - POST /api/capsules/:id/viewers 엔드포인트 호출
 * - 현재 위치를 Body에 포함하여 전송
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface PostCapsuleViewerRequest {
  latitude: number;
  longitude: number;
}

export interface PostCapsuleViewerResponse {
  is_first_view: boolean;
}

export interface UseCapsuleViewerReturn {
  /** API 호출 함수 */
  postViewer: (
    capsuleId: string,
    location: { lat: number; lng: number },
  ) => Promise<PostCapsuleViewerResponse | null>;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: string | null;
}

/**
 * 캡슐 뷰어를 등록하는 Hook
 */
export function useCapsuleViewer(): UseCapsuleViewerReturn {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({
      capsuleId,
      location,
    }: {
      capsuleId: string;
      location: { lat: number; lng: number };
    }): Promise<PostCapsuleViewerResponse> => {
      const endpoint = `${API_ENDPOINTS.CAPSULE.LIST}/${capsuleId}/viewers`;

      const requestBody: PostCapsuleViewerRequest = {
        latitude: location.lat,
        longitude: location.lng,
      };

      const response = await apiClient.post<PostCapsuleViewerResponse>(endpoint, requestBody);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // POST /viewers 성공 후 해당 캡슐의 detail query를 invalidate하여 최신 데이터 가져오기
      queryClient.invalidateQueries({
        queryKey: ['capsuleDetail', variables.capsuleId],
      });
    },
  });

  const postViewer = async (
    capsuleId: string,
    location: { lat: number; lng: number },
  ): Promise<PostCapsuleViewerResponse | null> => {
    try {
      const result = await mutateAsync({ capsuleId, location });
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '뷰어 등록 중 오류가 발생했습니다.';
      console.error('[useCapsuleViewer] Error:', errorMessage);
      return null;
    }
  };

  return {
    postViewer,
    isLoading: isPending,
    error: error
      ? error instanceof Error
        ? error.message
        : '뷰어 등록 중 오류가 발생했습니다.'
      : null,
  };
}
