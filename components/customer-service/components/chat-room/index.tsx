/**
 * components/customer-service/components/chat-room/index.tsx
 * 채팅방 전체 레이아웃 컴포넌트
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard, Text } from 'react-native';
import { ChatHeader } from '../chat-header';
import { ChatMessageList } from '../chat-message-list';
import { ChatInput } from '../chat-input';
import { selectFile } from '../file-picker';
import { useMockFileUpload } from '../../hooks/useMockFileUpload';
import { useSocket } from '../../hooks/useSocket';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useChatHistory } from '../../hooks/useChatHistory';
import { MessageAttachment } from '../../types';
import { FilePickerResult } from '../file-picker/types';
import { Colors, Spacing, Typography } from '@/commons/constants';
import { Toast } from '@/commons/components/toast';
import { styles } from './styles';

interface ChatRoomProps {
  inquiryId?: string; // 선택사항: 없으면 join_room이 새 문의 생성
  inquiryTitle?: string;
  onBack?: () => void;
  onInquiryIdReceived?: (inquiryId: string) => void; // 새 문의 생성 시 inquiryId 콜백
}

/**
 * 채팅방 컴포넌트
 * 
 * @description
 * - 메시지 리스트, 입력창, 헤더 통합
 * - KeyboardAvoidingView로 키보드 처리
 * - 키보드가 올라올 때 자동 스크롤
 * - 파일 첨부 기능 통합
 * - 네이버 톡톡 스타일 구현
 */
export function ChatRoom({ inquiryId, inquiryTitle, onBack, onInquiryIdReceived }: ChatRoomProps) {
  const { uploadFile, uploadProgress, resetProgress } = useMockFileUpload();
  
  // WebSocket 연결 관리 (EC-001, EC-003, EC-005)
  const { 
    connectionStatus, 
    isRoomEntered, 
    isActiveDevice, 
    joinRoom,
    socket // Phase 5: Socket 인스턴스
  } = useSocket({ 
    inquiryId,
    onRoomIdReceived: (roomId) => {
      console.log('roomId 수신:', roomId);
    },
    onInquiryIdReceived: (newInquiryId) => {
      // 새 문의 생성 시 inquiryId 콜백 호출
      onInquiryIdReceived?.(newInquiryId);
    },
    onError: (message) => {
      showToast(message);
    },
  });

  // 채팅 메시지 송수신 관리 (EC-002, EC-004, EC-006, Phase 4, Phase 5)
  const { 
    messages: wsMessages, 
    addMessage, 
    retryMessage,
    markMessagesAsRead,
    sendReadAlert,
    unreadCount, // Phase 4: 읽지 않은 메시지 개수
    isOffline,
    isLoading: messagesLoading 
  } = useChatMessages({ 
    inquiryId, 
    socket, // Phase 5: Socket 인스턴스 전달
    isRoomEntered,
    connectionStatus 
  });

  // 채팅 내역 조회 (HTTP API + WebSocket 병합) (Phase 5)
  const {
    messages: allMessages,
    isLoading: historyLoading,
    hasNext,
    loadMore,
  } = useChatHistory({
    inquiryId,
    webSocketMessages: wsMessages, // useChatMessages에서 받은 실시간 메시지 전달
  });

  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const messageListRef = useRef<any>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // 방 입장 시도
  useEffect(() => {
    if (connectionStatus === 'connected' && !isRoomEntered) {
      joinRoom().catch((error) => {
        console.error('방 입장 실패:', error);
        setErrorMessage('채팅방 입장에 실패했습니다.');
      });
    }
  }, [connectionStatus, isRoomEntered, joinRoom]);

  const handleSendMessage = async (message: string, messageAttachments?: MessageAttachment[]) => {
    try {
      // EC-004: 방 입장 전 메시지 전송 차단
      if (!isRoomEntered) {
        setErrorMessage('먼저 채팅방에 입장해주세요.');
        return;
      }

      // EC-003: 비활성 기기에서 메시지 전송 차단
      if (!isActiveDevice) {
        setErrorMessage('다른 기기에서 채팅 중입니다.');
        return;
      }

      // 첨부파일이 있으면 함께 전송
      const finalAttachments = messageAttachments && messageAttachments.length > 0 
        ? messageAttachments 
        : attachments.length > 0 
          ? attachments 
          : undefined;
      
      // Phase 5: 실제 WebSocket으로 메시지 전송 (async)
      await addMessage(message, finalAttachments);
      
      // 에러 메시지 초기화
      setErrorMessage('');
      
      // 첨부파일 초기화
      setAttachments([]);
      resetProgress();
      
      // 메시지 전송 후 키보드 닫기
      Keyboard.dismiss();

      // EC-006: 읽음 처리 알림 전송 (debounce 처리됨)
      sendReadAlert();
    } catch (error: any) {
      setErrorMessage(error.message || '메시지 전송에 실패했습니다.');
    }
  };

  const handleAttachFile = async () => {
    await selectFile({
      onSelectFile: async (file: FilePickerResult) => {
        // 파일 업로드 시작
        const attachment = await uploadFile(file);
        if (attachment) {
          setAttachments((prev) => [...prev, attachment]);
        }
      },
      onError: (error) => {
        console.error('파일 선택 오류:', error);
      },
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const handleLoadMore = () => {
    // Phase 5: 실제 API로 과거 메시지 로드
    loadMore();
  };

  // EC-006: 메시지 읽음 처리 (스크롤 시 자동 호출)
  useEffect(() => {
    if (allMessages.length > 0 && isRoomEntered) {
      sendReadAlert();
    }
  }, [allMessages.length, isRoomEntered, sendReadAlert]);

  // 키보드가 올라올 때 자동 스크롤
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        // 키보드가 올라올 때 메시지 리스트를 맨 아래로 스크롤
        setTimeout(() => {
          messageListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      {/* 헤더 */}
      <ChatHeader
        title={inquiryTitle || '고객센터'}
        connectionStatus={connectionStatus}
        onBack={onBack}
      />

      {/* EC-003: 여러 기기 동시 접속 안내 메시지 */}
      {!isActiveDevice && (
        <View style={styles.deviceWarningContainer}>
          <Text style={styles.deviceWarningText}>
            다른 기기에서 채팅 중입니다. 이 기기는 읽기 전용 모드입니다.
          </Text>
        </View>
      )}

      {/* 메시지 리스트 */}
      <View style={styles.messageListContainer}>
        <ChatMessageList
          ref={messageListRef}
          messages={allMessages}
          onLoadMore={handleLoadMore}
          isLoading={messagesLoading || historyLoading}
        />
      </View>

      {/* 입력창 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        isLoading={messagesLoading || uploadProgress.status === 'uploading'}
        isRoomEntered={isRoomEntered && isActiveDevice}
        errorMessage={errorMessage && errorMessage.trim() !== '' ? errorMessage : undefined}
      />

      {/* Toast 메시지 */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
