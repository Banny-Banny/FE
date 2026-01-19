/**
 * components/customer-service/components/chat-room/index.tsx
 * 채팅방 전체 레이아웃 컴포넌트
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { ChatHeader } from '../chat-header';
import { ChatMessageList } from '../chat-message-list';
import { ChatInput } from '../chat-input';
import { selectFile } from '../file-picker';
import { useMockMessages } from '../../hooks/useMockMessages';
import { useMockFileUpload } from '../../hooks/useMockFileUpload';
import { MessageAttachment } from '../../types';
import { FilePickerResult } from '../file-picker/types';
import { styles } from './styles';
import { ConnectionStatus } from '../../types';

interface ChatRoomProps {
  inquiryId: string;
  inquiryTitle?: string;
  onBack?: () => void;
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
export function ChatRoom({ inquiryId, inquiryTitle, onBack }: ChatRoomProps) {
  const { messages, addMessage, isLoading } = useMockMessages({ inquiryId });
  const { uploadFile, uploadProgress, resetProgress } = useMockFileUpload();
  const [connectionStatus] = useState<ConnectionStatus>('connected'); // Mock: 연결 상태
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const messageListRef = useRef<any>(null);

  const handleSendMessage = (message: string, messageAttachments?: MessageAttachment[]) => {
    // 첨부파일이 있으면 함께 전송
    const finalAttachments = messageAttachments && messageAttachments.length > 0 
      ? messageAttachments 
      : attachments.length > 0 
        ? attachments 
        : undefined;
    
    addMessage(message, finalAttachments);
    
    // 첨부파일 초기화
    setAttachments([]);
    resetProgress();
    
    // 메시지 전송 후 키보드 닫기
    Keyboard.dismiss();
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
    // Mock: 과거 메시지 로드 (Phase 4에서 구현)
  };

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

      {/* 메시지 리스트 */}
      <View style={styles.messageListContainer}>
        <ChatMessageList
          ref={messageListRef}
          messages={messages}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </View>

      {/* 입력창 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        isLoading={isLoading || uploadProgress.status === 'uploading'}
      />
    </KeyboardAvoidingView>
  );
}
