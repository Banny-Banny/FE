/**
 * components/customer-service/hooks/useMockMessages.ts
 * 채팅 메시지 Mock 데이터 훅
 */

import { useState, useMemo } from 'react';
import { ChatMessage, ChatMessageWithStatus, MessageStatus, MessageAttachment } from '../types';
import { getMockMessagesByInquiryId } from '../mocks/messages';

interface UseMockMessagesOptions {
  inquiryId: string;
}

interface UseMockMessagesReturn {
  messages: ChatMessageWithStatus[];
  addMessage: (content: string, attachments?: MessageAttachment[]) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  isLoading: boolean;
}

/**
 * Mock 데이터를 사용한 채팅 메시지 훅
 * 
 * @param options - 옵션 객체
 * @param options.inquiryId - 문의 ID
 * @returns 메시지 목록 및 관련 함수들
 */
export function useMockMessages({ inquiryId }: UseMockMessagesOptions): UseMockMessagesReturn {
  // Mock 데이터에서 초기 메시지 로드
  const initialMessages = useMemo(() => {
    return getMockMessagesByInquiryId(inquiryId);
  }, [inquiryId]);

  // 메시지 상태 관리 (전송 상태 포함)
  const [messages, setMessages] = useState<ChatMessageWithStatus[]>(
    initialMessages.map((msg) => ({ ...msg, status: 'sent' as MessageStatus }))
  );

  /**
   * 새 메시지 추가 (Mock)
   */
  const addMessage = (content: string, attachments?: MessageAttachment[]) => {
    const newMessage: ChatMessageWithStatus = {
      id: `msg-${Date.now()}`,
      customer_service_id: inquiryId,
      sender_type: 'USER',
      sender_user_id: 'user-1', // Mock user ID
      content: content || '', // 빈 문자열도 허용 (파일만 첨부하는 경우)
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'sending', // 초기 상태는 전송 중
    };

    setMessages((prev) => [...prev, newMessage]);

    // Mock: 전송 중 상태를 전송 완료로 변경 (시뮬레이션)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' as MessageStatus } : msg
        )
      );
    }, 500);
  };

  /**
   * 메시지 상태 업데이트
   */
  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
    );
  };

  // 시간순으로 정렬된 메시지 반환
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB; // 오름차순 (오래된 것부터)
    });
  }, [messages]);

  return {
    messages: sortedMessages,
    addMessage,
    updateMessageStatus,
    isLoading: false, // Mock 데이터는 즉시 로드
  };
}
