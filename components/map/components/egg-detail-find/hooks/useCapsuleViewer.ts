/**
 * Capsule Viewer API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 캡슐 뷰어 등록 API 통신
 * - POST /api/capsules/:id/viewers 엔드포인트 호출
 * - 현재 위치를 Body에 포함하여 전송
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { useUserInfo } from '@/components/mypage/hooks/useUserInfo';
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
  const { data: userInfo } = useUserInfo();
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
    // Optimistic Update: 사용자 경험 향상을 위해 즉시 UI 업데이트
    onMutate: async ({ capsuleId, location }) => {
      const queryKey = queryKeys.capsuleDetail({
        capsuleId,
        lat: location.lat,
        lng: location.lng,
      });

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistic Update: 캡슐 상세의 viewers 배열에 임시 뷰어 추가
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const newViewer = {
          id: `temp-${Date.now()}`,
          nickname: userInfo?.nickname || '익명',
          viewed_at: new Date().toISOString(),
        };

        return {
          ...old,
          viewers: [...(old.viewers || []), newViewer],
          view_count: (old.view_count || 0) + 1,
        };
      });

      // 캡슐 목록도 Optimistic Update
      queryClient.setQueriesData({ queryKey: queryKeys.capsulesAll() }, (old: any) => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: any) =>
            item.id === capsuleId
              ? {
                  ...item,
                  view_count: (item.view_count || 0) + 1,
                }
              : item,
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 실패 시 롤백
      if (context?.previousData) {
        const queryKey = queryKeys.capsuleDetail({
          capsuleId: variables.capsuleId,
          lat: variables.location.lat,
          lng: variables.location.lng,
        });
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSuccess: (_, variables) => {
      // 성공 시 실제 데이터로 교체 (Optimistic Update가 이미 적용되었지만, 서버 데이터로 확정)
      queryClient.invalidateQueries({
        queryKey: queryKeys.capsuleDetail({
          capsuleId: variables.capsuleId,
          lat: variables.location.lat,
          lng: variables.location.lng,
        }),
      });
      // 모든 캡슐 목록 쿼리 무효화 (queryKey의 첫 번째 요소만 매칭)
      queryClient.invalidateQueries({
        queryKey: queryKeys.capsulesAll(),
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
      if (__DEV__) {
      }
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
