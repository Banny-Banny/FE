/**
 * components/customer-service/hooks/useChatMessages.ts
 * 채팅 메시지 송수신 관리 훅 (단순화)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, ChatMessageWithStatus, MessageStatus, MessageAttachment } from '../types';

interface UseChatMessagesOptions {
  roomId: string | null;
  socket: Socket | null;
  isRoomEntered: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

interface UseChatMessagesReturn {
  messages: ChatMessageWithStatus[];
  addMessage: (content: string, attachments?: MessageAttachment[]) => Promise<void>;
  sendReadAlert: () => void;
  isLoading: boolean;
}

const READ_ALERT_DEBOUNCE = 500;

export function useChatMessages({ 
  roomId,
  socket,
  isRoomEntered, 
  connectionStatus 
}: UseChatMessagesOptions): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessageWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const readAlertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMessages([]);
    return () => {
      if (readAlertTimeoutRef.current) {
        clearTimeout(readAlertTimeoutRef.current);
      }
    };
  }, []);

  // 메시지 수신 리스너
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: any) => {
      console.log('[receive_message] 메시지 수신 (원본):', data);

      // 서버는 camelCase로 보내므로 snake_case로 변환
      const message: ChatMessage = {
        id: data.id,
        sender_type: data.senderType,
        sender_user_id: data.senderUserId,
        sender_admin_id: data.senderAdminId,
        content: data.content,
        attachments: data.attachments,
        is_read_by_admin: data.isReadByAdmin || false,
        is_read_by_user: data.isReadByUser || false,
        created_at: data.createdAt,
        updated_at: data.updatedAt || data.createdAt,
      };

      console.log('[receive_message] 변환된 메시지:', message);

      setMessages((prev) => {
        const existingIndex = prev.findIndex((msg) => msg.id === message.id);
        
        if (existingIndex !== -1) {
          // 이미 존재하는 메시지 (내가 보낸 메시지) - 서버 시간으로 업데이트
          console.log('[receive_message] 기존 메시지 업데이트 (서버 시간 반영):', message.id);
          const updated = [...prev];
          updated[existingIndex] = { ...message, status: 'sent' as MessageStatus };
          return updated;
        } else {
          // 새로운 메시지 (관리자가 보낸 메시지)
          console.log('[receive_message] 새 메시지 추가:', message.id);
          return [...prev, { ...message, status: 'sent' as MessageStatus }];
        }
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  // 읽음 알림 수신 리스너
  useEffect(() => {
    if (!socket) return;

    const handleReadAlert = (data: { messageId: string; isRead: boolean }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, is_read_by_admin: data.isRead }
            : msg
        )
      );
    };

    socket.on('read_alert', handleReadAlert);
    return () => {
      socket.off('read_alert', handleReadAlert);
    };
  }, [socket]);

  const addMessage = useCallback(async (content: string, attachments?: MessageAttachment[]) => {
    if (!isRoomEntered) {
      throw new Error('먼저 채팅방에 입장해주세요.');
    }

    if (!socket || !socket.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const newMessage: ChatMessageWithStatus = {
      id: tempId,
      sender_type: 'USER',
      sender_user_id: 'user-1',
      content: content || '',
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'sending',
    };

    console.log('[addMessage] 메시지 전송 시작:', { tempId, content, roomId });
    setMessages((prev) => [...prev, newMessage]);

    return new Promise<void>((resolve, reject) => {
      socket.emit(
        'send_message',
        {
          roomId,
          content: content || '',
          attachments: attachments && attachments.length > 0 ? attachments : undefined,
        },
        (response: any) => {
          console.log('[addMessage] 서버 응답:', response);

          // 서버는 { success: true, messageId: "..." } 형식으로 응답
          if (response?.success && response?.messageId) {
            console.log('[addMessage] 전송 성공, tempId 교체:', tempId, '->', response.messageId);
            // receive_message 이벤트로 실제 메시지가 올 것이므로
            // 여기서는 임시 메시지를 제거만 하고, receive_message에서 실제 메시지를 추가
            // 하지만 USER 메시지는 receive_message에서 무시하므로, 여기서 ID만 업데이트
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempId
                  ? { ...msg, id: response.messageId, status: 'sent' as MessageStatus }
                  : msg
              )
            );
            resolve();
          } else {
            console.error('[addMessage] 전송 실패:', response?.error);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempId ? { ...msg, status: 'failed' as MessageStatus } : msg
              )
            );
            reject(new Error(response?.error || '메시지 전송에 실패했습니다.'));
          }
        }
      );
    });
  }, [isRoomEntered, socket, roomId]);

  const sendReadAlert = useCallback(() => {
    if (!socket || !socket.connected || !isRoomEntered || !roomId) return;

    if (readAlertTimeoutRef.current) {
      clearTimeout(readAlertTimeoutRef.current);
    }

    readAlertTimeoutRef.current = setTimeout(() => {
      socket.emit('read_alert', { roomId });
    }, READ_ALERT_DEBOUNCE) as unknown as NodeJS.Timeout;
  }, [socket, isRoomEntered, roomId]);

  return {
    messages,
    addMessage,
    sendReadAlert,
    isLoading,
  };
}
