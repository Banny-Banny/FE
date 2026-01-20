/**
 * components/customer-service/hooks/useChatHistory.ts
 * 채팅 내역 조회 및 병합 훅 (실제 API)
 * 
 * @description
 * - Phase 5: 실제 API를 사용한 채팅 내역 조회
 * - HTTP API와 WebSocket 메시지 병합 처리 (EC-007)
 * - 메시지 ID 기준 중복 제거 및 타임스탬프 비교
 * - 무한 스크롤 지원
 */

import { useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { apiClient } from '@/utils/apiClient';
import { ChatMessage, ChatMessageWithStatus } from '../types';

// API 응답 형식 (camelCase)
interface ApiChatMessage {
  id: string;
  customerServiceId: string;
  senderType: 'USER' | 'ADMIN';
  senderUserId?: string;
  senderAdminId?: string;
  content: string;
  attachments?: Array<{
    id: string;
    type: 'IMAGE' | 'FILE';
    name: string;
    url: string;
    size?: number;
    mimeType?: string;
  }>;
  isReadByAdmin: boolean;
  isReadByUser: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface ChatHistoryResponse {
  inquiry?: {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    isResolved: boolean;
    title: string;
    createdAt: string;
    lastMessageAt?: string;
    lastMessagePreview?: string;
  };
  messages: ApiChatMessage[]; // API 응답은 messages 필드 사용
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

interface UseChatHistoryOptions {
  inquiryId?: string; // 선택사항: 없으면 쿼리 비활성화
  webSocketMessages?: ChatMessage[]; // WebSocket으로 받은 실시간 메시지
}

interface UseChatHistoryReturn {
  messages: ChatMessageWithStatus[];
  apiMessages: ChatMessage[]; // HTTP API로 조회한 메시지
  webSocketMessages: ChatMessage[]; // WebSocket으로 받은 메시지
  mergeMessages: (newWebSocketMessages: ChatMessage[]) => void;
  isLoading: boolean;
  hasNext: boolean;
  loadMore: () => void;
  isFetchingNextPage: boolean;
}

/**
 * API 응답(camelCase)을 내부 타입(snake_case)로 변환
 */
function transformApiMessageToMessage(apiMessage: ApiChatMessage): ChatMessage {
  return {
    id: apiMessage.id,
    customer_service_id: apiMessage.customerServiceId,
    sender_type: apiMessage.senderType,
    sender_user_id: apiMessage.senderUserId,
    sender_admin_id: apiMessage.senderAdminId,
    content: apiMessage.content,
    attachments: apiMessage.attachments?.map((att) => ({
      id: att.id,
      type: att.type,
      name: att.name,
      url: att.url,
      size: att.size,
      mimeType: att.mimeType,
    })),
    is_read_by_admin: apiMessage.isReadByAdmin,
    is_read_by_user: apiMessage.isReadByUser,
    created_at: apiMessage.createdAt,
    updated_at: apiMessage.updatedAt,
    deleted_at: apiMessage.deletedAt,
  };
}

/**
 * 채팅 내역 조회 및 병합 훅 (실제 API)
 * 
 * @param options - 옵션 객체
 * @param options.inquiryId - 문의 ID
 * @param options.webSocketMessages - WebSocket으로 받은 실시간 메시지
 * @returns 병합된 메시지 목록 및 관련 함수들
 */
export function useChatHistory({ inquiryId, webSocketMessages = [] }: UseChatHistoryOptions): UseChatHistoryReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  // useInfiniteQuery로 채팅 내역 조회
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chatHistory', inquiryId],
    queryFn: async ({ pageParam = 0 }) => {
      // 인증 토큰이 없으면 API 호출하지 않음
      if (!accessToken) {
        return {
          messages: [],
          total: 0,
          limit: 20,
          offset: 0,
          hasNext: false,
        };
      }

      // 쿼리 파라미터 구성
      const queryParams = {
        limit: '20',
        offset: pageParam.toString(),
      };

      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      // inquiryId가 없으면 빈 응답 반환
      if (!inquiryId) {
        return {
          messages: [],
          total: 0,
          limit: 20,
          offset: 0,
          hasNext: false,
        };
      }

      // API 엔드포인트: GET /api/me/inquiries/{id}
      const endpoint = `/api/me/inquiries/${inquiryId}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get<ChatHistoryResponse>(endpoint);
      return response.data;
    },
    enabled: !!accessToken && !authLoading && !!inquiryId, // inquiryId가 없으면 쿼리 비활성화
    getNextPageParam: (lastPage, allPages) => {
      // 다음 페이지가 있으면 다음 offset 반환
      if (lastPage.hasNext) {
        return allPages.length * lastPage.limit;
      }
      return undefined;
    },
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  // HTTP API로 조회한 메시지 (모든 페이지 병합)
  const apiMessages = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    const allMessages: ChatMessage[] = [];
    data.pages.forEach((page) => {
      // page.messages가 존재하고 배열인지 확인 (API 응답은 messages 필드 사용)
      if (page?.messages && Array.isArray(page.messages)) {
        const transformedMessages = page.messages.map(transformApiMessageToMessage);
        allMessages.push(...transformedMessages);
      }
    });

    return allMessages;
  }, [data]);

  /**
   * 메시지 병합 로직 (EC-007)
   * - 메시지 ID 기준 중복 제거
   * - 타임스탬프 비교로 최신 메시지 우선 반영
   * - WebSocket 메시지 우선 반영
   * - 시간순 정렬
   */
  const mergedMessages = useMemo(() => {
    // 1. 메시지 ID 기준 중복 제거를 위한 Map 생성
    const messageMap = new Map<string, ChatMessage>();

    // 2. HTTP API 메시지 추가 (기본 메시지)
    apiMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // 3. WebSocket 메시지 추가/업데이트 (우선순위 높음)
    webSocketMessages.forEach((wsMsg) => {
      const existingMsg = messageMap.get(wsMsg.id);
      
      if (existingMsg) {
        // 중복 메시지 발견: 타임스탬프 비교
        const existingTime = new Date(existingMsg.updated_at || existingMsg.created_at).getTime();
        const wsTime = new Date(wsMsg.updated_at || wsMsg.created_at).getTime();
        
        // WebSocket 메시지가 더 최신이면 업데이트
        if (wsTime >= existingTime) {
          messageMap.set(wsMsg.id, wsMsg);
        }
      } else {
        // 새로운 메시지 추가
        messageMap.set(wsMsg.id, wsMsg);
      }
    });

    // 4. Map을 배열로 변환
    const merged = Array.from(messageMap.values());

    // 5. 시간순 정렬 (오름차순: 오래된 것부터)
    merged.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    });

    // 6. ChatMessageWithStatus로 변환 (status 추가)
    return merged.map((msg) => ({
      ...msg,
      status: 'sent' as const,
    }));
  }, [apiMessages, webSocketMessages]);

  /**
   * WebSocket 메시지 병합 (외부에서 호출 가능하도록 유지)
   * 실제로는 webSocketMessages prop을 통해 자동으로 병합됨
   */
  const mergeMessages = useCallback((newWebSocketMessages: ChatMessage[]) => {
    // 이 함수는 webSocketMessages prop이 변경되면 자동으로 병합되므로
    // 실제로는 아무 작업도 하지 않음 (하위 호환성을 위해 유지)
    console.log('mergeMessages called:', newWebSocketMessages);
  }, []);

  /**
   * 과거 메시지 로드 (무한 스크롤)
   */
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    messages: mergedMessages,
    apiMessages,
    webSocketMessages,
    mergeMessages,
    isLoading: isLoading || authLoading,
    hasNext: hasNextPage || false,
    loadMore,
    isFetchingNextPage,
  };
}
