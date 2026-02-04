/**
 * components/customer-service/hooks/useChatHistory.ts
 * 채팅 내역 조회 및 병합 훅 (단순화)
 * - 한 유저당 채팅방 1개만 존재
 */

import { useMemo, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { apiClient } from '@/utils/apiClient';
import { ChatMessage, ChatMessageWithStatus } from '../types';

interface ApiChatMessage {
  id: string;
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
  messages: ApiChatMessage[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

interface UseChatHistoryOptions {
  webSocketMessages?: ChatMessage[];
}

interface UseChatHistoryReturn {
  messages: ChatMessageWithStatus[];
  isLoading: boolean;
  hasNext: boolean;
  loadMore: () => void;
  isFetchingNextPage: boolean;
}

function transformApiMessageToMessage(apiMessage: ApiChatMessage): ChatMessage {
  return {
    id: apiMessage.id,
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
  };
}

export function useChatHistory({ webSocketMessages = [] }: UseChatHistoryOptions): UseChatHistoryReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  // 먼저 유저의 문의 목록을 조회해서 inquiryId를 가져옴
  const { data: inquiriesData } = useQuery({
    queryKey: ['inquiries', 'first'],
    queryFn: async () => {
      if (!accessToken) return { items: [], total: 0, limit: 1, offset: 0, hasNext: false };
      const response = await apiClient.get<{ items: Array<{ id: string }> }>('/api/me/inquiries?limit=1&offset=0');
      return response.data;
    },
    enabled: !!accessToken && !authLoading,
  });

  const inquiryId = inquiriesData?.items?.[0]?.id;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chatHistory', inquiryId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken || !inquiryId) {
        return {
          messages: [],
          total: 0,
          limit: 20,
          offset: 0,
          hasNext: false,
        };
      }

      const queryParams = {
        limit: '20',
        offset: pageParam.toString(),
      };

      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const endpoint = `/api/me/inquiries/${inquiryId}${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<ChatHistoryResponse>(endpoint);
      return response.data;
    },
    enabled: !!accessToken && !authLoading && !!inquiryId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNext) {
        return allPages.length * lastPage.limit;
      }
      return undefined;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const apiMessages = useMemo(() => {
    if (!data?.pages) return [];
    const allMessages: ChatMessage[] = [];
    data.pages.forEach((page) => {
      if (page?.messages && Array.isArray(page.messages)) {
        const transformedMessages = page.messages.map(transformApiMessageToMessage);
        allMessages.push(...transformedMessages);
      }
    });
    return allMessages;
  }, [data]);

  const mergedMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>();

    apiMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    webSocketMessages.forEach((wsMsg) => {
      const existingMsg = messageMap.get(wsMsg.id);
      if (existingMsg) {
        const existingTime = new Date(existingMsg.updated_at || existingMsg.created_at).getTime();
        const wsTime = new Date(wsMsg.updated_at || wsMsg.created_at).getTime();
        if (wsTime >= existingTime) {
          messageMap.set(wsMsg.id, wsMsg);
        }
      } else {
        messageMap.set(wsMsg.id, wsMsg);
      }
    });

    const merged = Array.from(messageMap.values());
    merged.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    });

    return merged.map((msg) => ({
      ...msg,
      status: 'sent' as const,
    }));
  }, [apiMessages, webSocketMessages]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    messages: mergedMessages,
    isLoading: isLoading || authLoading,
    hasNext: hasNextPage || false,
    loadMore,
    isFetchingNextPage,
  };
}
