/**
 * components/customer-service/hooks/useChatMessages.ts
 * 채팅 메시지 송수신 관리 훅 (실제 WebSocket)
 * 
 * @description
 * - Phase 5: 실제 Socket.IO WebSocket 이벤트를 사용한 메시지 송수신 관리
 * - 네트워크 불안정 처리, 방 입장 전 메시지 전송 차단, 읽음 처리 중복 방지 등
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, ChatMessageWithStatus, MessageStatus, MessageAttachment } from '../types';

interface UseChatMessagesOptions {
  inquiryId?: string; // 선택사항: 없으면 새 문의 생성 중
  socket: Socket | null; // Socket 인스턴스
  isRoomEntered: boolean; // 방 입장 여부 (EC-004)
  connectionStatus: 'connected' | 'disconnected' | 'error'; // 연결 상태
}

interface FailedMessage {
  id: string;
  content: string;
  attachments?: MessageAttachment[];
  timestamp: number;
  retryCount: number;
}

interface UseChatMessagesReturn {
  messages: ChatMessageWithStatus[];
  addMessage: (content: string, attachments?: MessageAttachment[]) => Promise<void>;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  retryMessage: (messageId: string) => Promise<void>;
  markMessagesAsRead: () => void;
  sendReadAlert: () => void; // 읽음 처리 알림 (EC-006)
  unreadCount: number; // Phase 4: 읽지 않은 메시지 개수
  failedMessages: FailedMessage[];
  isOffline: boolean;
  isLoading: boolean;
}

const NETWORK_RETRY_DELAY = 3000; // 3초 후 재시도 (EC-002)
const READ_ALERT_DEBOUNCE = 500; // 500ms debounce (EC-006)

/**
 * 채팅 메시지 송수신 관리 훅 (실제 WebSocket)
 * 
 * @param options - 옵션 객체
 * @param options.inquiryId - 문의 ID
 * @param options.socket - Socket.IO 인스턴스
 * @param options.isRoomEntered - 방 입장 여부
 * @param options.connectionStatus - 연결 상태
 * @returns 메시지 목록 및 관련 함수들
 */
export function useChatMessages({ 
  inquiryId, 
  socket,
  isRoomEntered, 
  connectionStatus 
}: UseChatMessagesOptions): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessageWithStatus[]>([]);
  const [failedMessages, setFailedMessages] = useState<FailedMessage[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  
  const readAlertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastReadAlertTimeRef = useRef<number>(0);
  const processedReadAlertIdsRef = useRef<Set<string>>(new Set());
  const pendingMessagesRef = useRef<Map<string, ChatMessageWithStatus>>(new Map()); // 전송 중인 메시지 추적

  /**
   * 네트워크 불안정 감지 (EC-002)
   */
  const detectNetworkInstability = useCallback(() => {
    if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      setIsOffline(true);
      return true;
    }
    setIsOffline(false);
    return false;
  }, [connectionStatus]);

  /**
   * 네트워크 복구 후 자동 재시도 (EC-002)
   */
  const retryFailedMessages = useCallback(async () => {
    if (failedMessages.length === 0 || !isRoomEntered || !socket?.connected) {
      return;
    }

    // 네트워크 복구 확인
    if (connectionStatus === 'connected' && isOffline) {
      setIsOffline(false);
      
      // 3초 후 자동 재시도
      setTimeout(async () => {
        for (const failedMsg of failedMessages) {
          if (failedMsg.retryCount < 3) {
            try {
              await addMessage(failedMsg.content, failedMsg.attachments);
              setFailedMessages((prev) => 
                prev.filter((msg) => msg.id !== failedMsg.id)
              );
            } catch (error) {
              console.error('메시지 재시도 실패:', error);
            }
          }
        }
      }, NETWORK_RETRY_DELAY);
    }
  }, [failedMessages, connectionStatus, isOffline, isRoomEntered, socket]);

  // 네트워크 상태 변경 감지
  useEffect(() => {
    detectNetworkInstability();
    retryFailedMessages();
  }, [connectionStatus, detectNetworkInstability, retryFailedMessages]);

  /**
   * receive_message 이벤트 핸들러 (T119)
   * 실시간 메시지 수신
   */
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      console.log('메시지 수신:', message);
      
      // 메시지 추가 (중복 체크)
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) {
          return prev;
        }
        return [...prev, { ...message, status: 'sent' as MessageStatus }];
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  /**
   * read_alert 이벤트 핸들러 (T121)
   * 상대방의 읽음 상태 수신
   */
  useEffect(() => {
    if (!socket) return;

    const handleReadAlert = (data: { messageId: string; isRead: boolean }) => {
      console.log('읽음 처리 알림 수신:', data);
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? {
                ...msg,
                is_read_by_admin: data.isRead,
              }
            : msg
        )
      );
    };

    socket.on('read_alert', handleReadAlert);

    return () => {
      socket.off('read_alert', handleReadAlert);
    };
  }, [socket]);

  /**
   * 새 메시지 추가 및 전송 (실제 WebSocket)
   * EC-004: 방 입장 전 메시지 전송 차단
   */
  const addMessage = useCallback(async (content: string, attachments?: MessageAttachment[]) => {
    // 방 입장 전 메시지 전송 차단
    if (!isRoomEntered) {
      throw new Error('먼저 채팅방에 입장해주세요.');
    }

    if (!socket || !socket.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const newMessage: ChatMessageWithStatus = {
      id: tempId,
      customer_service_id: inquiryId,
      sender_type: 'USER',
      sender_user_id: 'user-1', // 실제로는 인증된 사용자 ID 사용
      content: content || '',
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'sending',
    };

    // 임시 메시지 추가 (낙관적 업데이트)
    setMessages((prev) => [...prev, newMessage]);
    pendingMessagesRef.current.set(tempId, newMessage);

    // 네트워크 불안정 시 실패 처리 (EC-002)
    if (isOffline || connectionStatus !== 'connected') {
      setFailedMessages((prev) => [
        ...prev,
        {
          id: tempId,
          content,
          attachments,
          timestamp: Date.now(),
          retryCount: 0,
        },
      ]);
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' as MessageStatus } : msg
        )
      );
      return;
    }

    try {
      // send_message 이벤트 전송 (T118)
      socket.emit('send_message', {
        inquiryId,
        content,
        attachments,
      }, (response: { message?: ChatMessage; error?: string }) => {
        if (response.error) {
          // 전송 실패
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, status: 'failed' as MessageStatus } : msg
            )
          );
          
          setFailedMessages((prev) => [
            ...prev,
            {
              id: tempId,
              content,
              attachments,
              timestamp: Date.now(),
              retryCount: 0,
            },
          ]);
        } else if (response.message) {
          // 전송 성공 - 서버에서 받은 실제 메시지로 교체
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? { ...response.message!, status: 'sent' as MessageStatus }
                : msg
            )
          );
          pendingMessagesRef.current.delete(tempId);
        }
      });

      // 타임아웃 처리 (10초)
      setTimeout(() => {
        if (pendingMessagesRef.current.has(tempId)) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, status: 'failed' as MessageStatus } : msg
            )
          );
          pendingMessagesRef.current.delete(tempId);
        }
      }, 10000);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' as MessageStatus } : msg
        )
      );
      
      setFailedMessages((prev) => [
        ...prev,
        {
          id: tempId,
          content,
          attachments,
          timestamp: Date.now(),
          retryCount: 0,
        },
      ]);
    }
  }, [inquiryId, isRoomEntered, isOffline, connectionStatus, socket]);

  /**
   * 메시지 상태 업데이트
   */
  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
    );
  }, []);

  /**
   * 전송 실패한 메시지 재시도
   */
  const retryMessage = useCallback(async (messageId: string) => {
    const failedMsg = failedMessages.find((msg) => msg.id === messageId);
    if (!failedMsg) {
      return;
    }

    if (failedMsg.retryCount >= 3) {
      // 최대 재시도 횟수 초과
      return;
    }

    // 재시도
    failedMsg.retryCount += 1;
    try {
      await addMessage(failedMsg.content, failedMsg.attachments);
      setFailedMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error('메시지 재시도 실패:', error);
    }
  }, [failedMessages, addMessage]);

  /**
   * 메시지를 읽음 처리
   */
  const markMessagesAsRead = useCallback(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender_type === 'ADMIN' && !msg.is_read_by_user
          ? { ...msg, is_read_by_user: true }
          : msg
      )
    );
  }, []);

  /**
   * 읽음 처리 알림 전송 (EC-006)
   * 500ms debounce 처리 및 중복 방지
   */
  const sendReadAlert = useCallback(() => {
    if (!socket || !socket.connected) {
      return;
    }

    const now = Date.now();
    const timeSinceLastAlert = now - lastReadAlertTimeRef.current;

    // Debounce 처리
    if (timeSinceLastAlert < READ_ALERT_DEBOUNCE) {
      if (readAlertTimeoutRef.current) {
        clearTimeout(readAlertTimeoutRef.current);
      }
      
      readAlertTimeoutRef.current = setTimeout(() => {
        sendReadAlert();
      }, READ_ALERT_DEBOUNCE - timeSinceLastAlert);
      return;
    }

    // 이미 읽음 처리된 메시지 확인 (중복 방지)
    const unreadAdminMessages = messages.filter(
      (msg) => msg.sender_type === 'ADMIN' && !msg.is_read_by_user
    );

    if (unreadAdminMessages.length === 0) {
      // 읽을 메시지가 없으면 전송하지 않음
      return;
    }

    // 중복 방지: 이미 처리된 메시지 ID 확인
    const newUnreadIds = unreadAdminMessages
      .map((msg) => msg.id)
      .filter((id) => !processedReadAlertIdsRef.current.has(id));

    if (newUnreadIds.length === 0) {
      // 이미 처리된 메시지만 있으면 전송하지 않음
      return;
    }

    // read_alert 이벤트 전송 (T120)
    socket.emit('read_alert', {
      inquiryId,
      messageIds: newUnreadIds,
    });
    
    console.log('read_alert 이벤트 전송:', newUnreadIds);
    
    // 처리된 메시지 ID 기록
    newUnreadIds.forEach((id) => processedReadAlertIdsRef.current.add(id));
    lastReadAlertTimeRef.current = now;

    // 읽음 처리
    markMessagesAsRead();
  }, [messages, inquiryId, socket, markMessagesAsRead]);

  // 시간순으로 정렬된 메시지 반환
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB; // 오름차순 (오래된 것부터)
    });
  }, [messages]);

  // Phase 4: 읽지 않은 메시지 개수 계산 (관리자 메시지 중 읽지 않은 것)
  const unreadCount = useMemo(() => {
    return messages.filter((msg) => msg.sender_type === 'ADMIN' && !msg.is_read_by_user).length;
  }, [messages]);

  return {
    messages: sortedMessages,
    addMessage,
    updateMessageStatus,
    retryMessage,
    markMessagesAsRead,
    sendReadAlert,
    unreadCount,
    failedMessages,
    isOffline,
    isLoading: false,
  };
}
