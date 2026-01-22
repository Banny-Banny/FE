/**
 * components/notice/hooks/useNotices.ts
 * 공지사항 목록 조회 훅 (Mock Data)
 *
 * @description
 * - UI 우선 접근 방식으로 Mock Data를 사용
 * - 이후 실제 API로 교체 예정
 */

import { useMemo, useState } from 'react';
import type { NoticeItem, NoticeListParams, NoticeListResponse, NoticeListState } from '../types';

/**
 * Mock Data: 공지사항 목록 응답
 */
const mockNoticeListResponse: NoticeListResponse = {
  success: true,
  data: {
    items: [
      {
        id: 'b6803a41-08be-40d5-95c7-68d54c4daf24',
        title: '고정 공지사항',
        imageUrl: null,
        isPinned: true,
        createdAt: '2026-01-21T15:33:13.226Z',
      },
      {
        id: 'a2782d8f-4834-4e88-ae48-7e9da25ad150',
        title: '테스트 제목',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-21T15:30:23.803Z',
      },
      {
        id: 'c3893e9f-5945-5f99-bf59-8f0eb36be261',
        title: '새로운 기능 업데이트 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-20T10:15:00.000Z',
      },
      {
        id: 'd4904f0a-6a56-6g00-cg60-9g1fc47cf372',
        title: '서비스 점검 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-19T14:20:00.000Z',
      },
      {
        id: 'e5a15g1b-7b67-7h11-dh71-ah2gd58dg483',
        title: '이벤트 공지사항',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-18T09:30:00.000Z',
      },
      {
        id: 'f6b26h2c-8c78-8i22-ei82-bi3he69eh594',
        title: '버그 수정 완료 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-17T16:45:00.000Z',
      },
      {
        id: 'g7c37i3d-9d89-9j33-fj93-cj4if70fi6a5',
        title: '정책 변경 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-16T11:00:00.000Z',
      },
      {
        id: 'h8d48j4e-0e90-0k44-gk04-dk5jg81gj7b6',
        title: '시스템 업그레이드 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-15T13:15:00.000Z',
      },
      {
        id: 'i9e59k5f-1f01-1l55-hl15-el6kh92hk8c7',
        title: '새로운 업데이트',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-14T08:20:00.000Z',
      },
      {
        id: 'j0f60l6g-2g12-2m66-im26-fm7li03il9d8',
        title: '앱 업데이트 안내',
        imageUrl: null,
        isPinned: false,
        createdAt: '2026-01-13T15:30:00.000Z',
      },
    ],
    total: 21,
    limit: 10,
    offset: 0,
  },
};

/**
 * 빈 목록 Mock Data
 */
const emptyNoticeListResponse: NoticeListResponse = {
  success: true,
  data: {
    items: [],
    total: 0,
    limit: 10,
    offset: 0,
  },
};

/**
 * 공지사항 목록 조회 훅 반환 타입
 */
export interface UseNoticesReturn {
  /** 공지사항 목록 */
  notices: NoticeItem[];
  /** 전체 개수 */
  total: number;
  /** 페이지 크기 */
  limit: number;
  /** 오프셋 */
  offset: number;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 공지사항 목록 조회 훅
 *
 * @param params 조회 파라미터 (search, limit, offset)
 * @returns 공지사항 목록 상태
 */
export function useNotices(params?: NoticeListParams): UseNoticesReturn {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock Data 필터링 및 페이지네이션 로직
  const result = useMemo(() => {
    const search = params?.search?.trim();
    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    // 검색어가 있는 경우 필터링
    let filteredItems = mockNoticeListResponse.data.items;
    if (search) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 빈 목록인 경우
    if (filteredItems.length === 0) {
      return {
        items: [],
        total: 0,
        limit,
        offset,
        hasNext: false,
      };
    }

    // 페이지네이션 적용
    const paginatedItems = filteredItems.slice(offset, offset + limit);
    const total = filteredItems.length;
    const hasNext = offset + limit < total;

    return {
      items: paginatedItems,
      total,
      limit,
      offset,
      hasNext,
    };
  }, [params?.search, params?.limit, params?.offset]);

  return {
    notices: result.items,
    total: result.total,
    limit: result.limit,
    offset: result.offset,
    hasNext: result.hasNext,
    isLoading,
    error,
  };
}
