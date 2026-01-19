/**
 * components/customer-service/components/chat-input/index.tsx
 * 채팅 입력창 컨테이너 컴포넌트
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { ChatInputProps } from './types';
import { ChatTextInput } from './text-input';
import { SendButton } from './send-button';
import { AttachmentButton } from './attachment-button';
import { styles } from './styles';

/**
 * 채팅 입력창 컴포넌트
 * 
 * @description
 * - 텍스트 입력 및 전송 기능
 * - 파일 첨부 기능 (선택사항)
 * - 네이버 톡톡 스타일 구현
 */
export function ChatInput({
  onSendMessage,
  onAttachFile,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) return;

    onSendMessage(trimmedMessage);
    setMessage(''); // 입력창 초기화
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  return (
    <View style={styles.inputContainer}>
      {/* 첨부 파일 버튼 (선택사항) */}
      {onAttachFile && <AttachmentButton onPress={onAttachFile} />}

      {/* 텍스트 입력 필드 */}
      <ChatTextInput
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요"
        onSubmitEditing={handleSubmitEditing}
      />

      {/* 전송 버튼 */}
      <SendButton
        onPress={handleSend}
        disabled={message.trim().length === 0}
        isLoading={isLoading}
      />
    </View>
  );
}
