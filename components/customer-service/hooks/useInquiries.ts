/**
 * components/customer-service/hooks/useInquiries.ts
 * 문의 내역 조회 훅 (실제 API)
 * 
 * @description
 * - Phase 5: 실제 API를 사용한 문의 내역 조회
 * - 페이지네이션, 필터링, 정렬 지원
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { apiClient } from '@/utils/apiClient';
import { Inquiry } from '../types';

// API 응답 형식 (camelCase)
interface ApiInquiry {
  id: string;
  userId: string;
  title: string;
  content: string;
  adminReply?: string;
  isResolved: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface InquiriesResponse {
  items: ApiInquiry[]; // camelCase 형식 (API 응답)
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

/**
 * API 응답(camelCase)을 내부 타입(snake_case)로 변환
 */
function transformApiInquiryToInquiry(apiInquiry: ApiInquiry): Inquiry {
  return {
    id: apiInquiry.id,
    user_id: apiInquiry.userId,
    title: apiInquiry.title,
    content: apiInquiry.content,
    admin_reply: apiInquiry.adminReply,
    is_resolved: apiInquiry.isResolved,
    status: apiInquiry.status,
    last_message_at: apiInquiry.lastMessageAt,
    last_message_preview: apiInquiry.lastMessagePreview,
    created_at: apiInquiry.createdAt,
    updated_at: apiInquiry.updatedAt,
    deleted_at: apiInquiry.deletedAt,
  };
}

interface UseInquiriesOptions {
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'; // 문의 상태 필터
  sortBy?: 'latest' | 'oldest'; // 정렬 방식
  limit?: number; // 페이지 크기
  offset?: number; // 오프셋
}

interface UseInquiriesReturn {
  inquiries: Inquiry[]; // snake_case 형식 (내부 타입)
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 문의 내역 조회 훅 (실제 API)
 * 
 * @param options - 옵션 객체
 * @param options.status - 문의 상태 필터
 * @param options.sortBy - 정렬 방식 (latest: 최신순, oldest: 오래된순)
 * @param options.limit - 페이지 크기
 * @param options.offset - 오프셋
 * @returns 문의 내역 목록 및 관련 정보
 */
export function useInquiries(options: UseInquiriesOptions = {}): UseInquiriesReturn {
  const { accessToken, isLoading: authLoading } = useAuth();
  const { status, sortBy = 'latest', limit = 20, offset = 0 } = options;

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['inquiries', status, sortBy, limit, offset],
    queryFn: async () => {
      // 인증 토큰이 없으면 API 호출하지 않음
      if (!accessToken) {
        return {
          items: [],
          total: 0,
          limit,
          offset,
          hasNext: false,
        };
      }

      // 쿼리 파라미터 구성
      const queryParams: Record<string, string> = {
        limit: limit.toString(),
        offset: offset.toString(),
      };

      if (status) {
        queryParams.status = status;
      }

      if (sortBy === 'latest') {
        queryParams.sort = 'created_at:desc';
      } else {
        queryParams.sort = 'created_at:asc';
      }

      // 쿼리 파라미터를 URL에 추가
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      // API 엔드포인트: GET /api/me/inquiries
      const endpoint = `/api/me/inquiries${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get<InquiriesResponse>(endpoint);
      return response.data;
    },
    enabled: !!accessToken && !authLoading,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  const refetch = async () => {
    if (accessToken) {
      await refetchQuery();
    }
  };

  // API 응답(camelCase)을 내부 타입(snake_case)로 변환
  const inquiries = data
    ? data.items.map(transformApiInquiryToInquiry)
    : [];

  return {
    inquiries,
    total: data?.total || 0,
    limit: data?.limit || limit,
    offset: data?.offset || offset,
    hasNext: data?.hasNext || false,
    isLoading: isLoading || authLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '문의 내역을 불러오는 중 오류가 발생했습니다.'
      : null,
    refetch,
  };
}
