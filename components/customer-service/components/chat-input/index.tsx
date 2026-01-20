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
import { FilePreviewContainer } from '../file-preview';
import { MessageAttachment } from '@/components/customer-service/types';
import { styles } from './styles';

/**
 * 채팅 입력창 컴포넌트
 * 
 * @description
 * - 텍스트 입력 및 전송 기능
 * - 파일 첨부 기능 (선택사항)
 * - 파일 미리보기 표시
 * - 네이버 톡톡 스타일 구현
 */
export function ChatInput({
  onSendMessage,
  onAttachFile,
  attachments = [],
  onRemoveAttachment,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    const hasAttachments = attachments && attachments.length > 0;
    
    // 메시지나 첨부파일이 있어야 전송 가능
    if (trimmedMessage.length === 0 && !hasAttachments) return;

    onSendMessage(trimmedMessage, attachments);
    setMessage(''); // 입력창 초기화
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  return (
    <View>
      {/* 파일 미리보기 */}
      {attachments && attachments.length > 0 && (
        <FilePreviewContainer
          attachments={attachments}
          onRemove={onRemoveAttachment}
          showRemoveButton={true}
        />
      )}

      {/* 입력창 */}
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
          disabled={message.trim().length === 0 && (!attachments || attachments.length === 0)}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
