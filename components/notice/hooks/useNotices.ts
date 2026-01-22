/**
 * components/notice/hooks/useNotices.ts
 * 공지사항 목록 조회 훅 (React Query)
 *
 * @description
 * - React Query useInfiniteQuery를 사용하여 무한 스크롤 지원
 * - 실제 API 호출로 Mock Data 제거
 */

import { queryKeys } from '@/commons/constants';
import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { apiClient } from '@/utils/apiClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { NoticeItem, NoticeListParams, NoticeListResponse } from '../types';

/**
 * 공지사항 목록 조회 훅 반환 타입
 */
export interface UseNoticesReturn {
  /** 공지사항 목록 (모든 페이지 병합) */
  notices: NoticeItem[];
  /** 전체 개수 */
  total: number;
  /** 페이지 크기 */
  limit: number;
  /** 현재 오프셋 */
  offset: number;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 다음 페이지 로딩 상태 */
  isFetchingNextPage: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 다음 페이지 로드 함수 */
  fetchNextPage: () => void;
  /** 재시도 함수 */
  refetch: () => void;
}

/**
 * 공지사항 목록 조회 훅
 *
 * @param params 조회 파라미터 (search, limit)
 * @returns 공지사항 목록 상태
 */
export function useNotices(params?: NoticeListParams): UseNoticesReturn {
  const search = params?.search?.trim();
  const limit = params?.limit ?? 10;

  // React Query useInfiniteQuery 사용
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.notices({ search, limit }),
    queryFn: async ({ pageParam = 0 }) => {
      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      if (search) {
        queryParams.append('search', search);
      }
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', pageParam.toString());

      // API 호출
      const response = await apiClient.get<NoticeListResponse>(
        `${API_ENDPOINTS.NOTICES.LIST}?${queryParams.toString()}`,
      );

      if (!response.data.success) {
        throw new Error('공지사항 목록을 불러오는데 실패했습니다.');
      }

      return response.data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.reduce((sum, page) => sum + page.items.length, 0);
      // 다음 페이지가 있는지 확인
      if (currentOffset < lastPage.total) {
        return currentOffset;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
  });

  // 모든 페이지의 공지사항을 병합하고 고정 공지사항을 상단에 정렬
  const notices = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    // 모든 페이지의 items를 병합
    const allItems = data.pages.flatMap((page) => page.items);

    // 고정 공지사항(isPinned: true)을 먼저 정렬하고, 그 다음 일반 공지사항을 정렬
    const sortedItems = [...allItems].sort((a, b) => {
      // 고정 공지사항 우선
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 둘 다 고정이거나 둘 다 일반인 경우, createdAt 기준 내림차순 (최신순)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sortedItems;
  }, [data?.pages]);

  // 전체 개수는 첫 번째 페이지의 total 사용
  const total = data?.pages[0]?.total ?? 0;
  // 현재 오프셋은 모든 페이지의 items 길이 합계
  const offset = notices.length;
  // 다음 페이지 존재 여부
  const hasNext = hasNextPage ?? false;

  // 에러 메시지 변환
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : '공지사항 목록을 불러오는데 실패했습니다.'
    : null;

  return {
    notices,
    total,
    limit,
    offset,
    hasNext,
    isLoading,
    isFetchingNextPage,
    error: errorMessage,
    fetchNextPage,
    refetch,
  };
}
