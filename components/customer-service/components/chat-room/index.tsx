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
  inquiryTitle?: string;
  onBack?: () => void;
}

/**
 * 채팅방 컴포넌트 (단순화)
 * - 한 유저당 채팅방 1개만 존재
 */
export function ChatRoom({ inquiryTitle, onBack }: ChatRoomProps) {
  const { uploadFile, uploadProgress, resetProgress } = useMockFileUpload();
  
  const { 
    connectionStatus, 
    roomId,
    isRoomEntered, 
    joinRoom,
    socket
  } = useSocket({ 
    onRoomIdReceived: (roomId) => {
      console.log('roomId 수신:', roomId);
    },
    onError: (message) => {
      showToast(message);
    },
  });

  const { 
    messages: wsMessages, 
    addMessage, 
    sendReadAlert,
    isLoading: messagesLoading 
  } = useChatMessages({ 
    roomId,
    socket,
    isRoomEntered,
    connectionStatus 
  });

  const {
    messages: allMessages,
    isLoading: historyLoading,
    hasNext,
    loadMore,
  } = useChatHistory({
    webSocketMessages: wsMessages,
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
      if (!isRoomEntered) {
        setErrorMessage('먼저 채팅방에 입장해주세요.');
        return;
      }

      const finalAttachments = messageAttachments && messageAttachments.length > 0 
        ? messageAttachments 
        : attachments.length > 0 
          ? attachments 
          : undefined;
      
      await addMessage(message, finalAttachments);
      setErrorMessage('');
      setAttachments([]);
      resetProgress();
      Keyboard.dismiss();
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
    loadMore();
  };

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

      <View style={styles.messageListContainer}>
        <ChatMessageList
          ref={messageListRef}
          messages={allMessages}
          onLoadMore={handleLoadMore}
          isLoading={messagesLoading || historyLoading}
        />
      </View>

      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        isLoading={messagesLoading || uploadProgress.status === 'uploading'}
        isRoomEntered={isRoomEntered}
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
