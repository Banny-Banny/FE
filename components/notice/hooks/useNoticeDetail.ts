/**
 * components/notice/hooks/useNoticeDetail.ts
 * 공지사항 상세 조회 훅 (React Query)
 *
 * @description
 * - React Query useQuery를 사용하여 실제 API 호출
 * - Mock Data 제거
 */

import { queryKeys } from '@/commons/constants';
import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';
import type { NoticeDetail, NoticeDetailResponse } from '../types';

/**
 * 공지사항 상세 조회 훅 반환 타입
 */
export interface UseNoticeDetailReturn {
  /** 공지사항 상세 정보 */
  notice: NoticeDetail | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 재시도 함수 */
  refetch: () => void;
}

/**
 * 공지사항 상세 조회 훅
 *
 * @param noticeId 공지사항 ID
 * @returns 공지사항 상세 상태
 */
export function useNoticeDetail(noticeId: string): UseNoticeDetailReturn {
  // React Query useQuery 사용
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.noticeDetail(noticeId),
    queryFn: async () => {
      // API 호출
      const response = await apiClient.get<NoticeDetailResponse>(
        API_ENDPOINTS.NOTICES.DETAIL.replace('{id}', noticeId),
      );

      if (!response.data.success) {
        throw new Error('공지사항을 불러오는데 실패했습니다.');
      }

      return response.data.data;
    },
    enabled: !!noticeId, // noticeId가 있을 때만 쿼리 실행
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
  });

  // 에러 메시지 변환
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : '공지사항을 불러오는데 실패했습니다.'
    : null;

  return {
    notice: data ?? null,
    isLoading,
    error: errorMessage,
    refetch,
  };
}
