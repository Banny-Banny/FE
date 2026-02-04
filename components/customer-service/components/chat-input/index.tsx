/**
 * components/customer-service/components/chat-input/index.tsx
 * 채팅 입력창 컨테이너 컴포넌트
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ChatInputProps } from './types';
import { ChatTextInput } from './text-input';
import { SendButton } from './send-button';
import { AttachmentButton } from './attachment-button';
import { FilePreviewContainer } from '../file-preview';
import { MessageAttachment } from '@/components/customer-service/types';
import { Colors, Typography } from '@/commons/constants';
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
  isRoomEntered = true, // EC-004: 기본값은 입장됨
  errorMessage, // EC-004: 에러 메시지
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // EC-004: 방 입장 전 메시지 전송 차단
    if (!isRoomEntered) {
      return;
    }

    const trimmedMessage = message.trim();
    const hasAttachments = attachments && attachments.length > 0;
    
    // 메시지나 첨부파일이 있어야 전송 가능
    if (trimmedMessage.length === 0 && !hasAttachments) return;

    try {
      onSendMessage(trimmedMessage, attachments);
      setMessage(''); // 입력창 초기화
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
      console.error('메시지 전송 실패:', error);
    }
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  // EC-004: 방 입장 전 메시지 전송 차단
  const isDisabled = !isRoomEntered || (message.trim().length === 0 && (!attachments || attachments.length === 0));

  return (
    <View>
      {/* 파일 미리보기 */}
      {attachments && attachments.length > 0 ? (
        <FilePreviewContainer
          attachments={attachments}
          onRemove={onRemoveAttachment}
          showRemoveButton={true}
        />
      ) : null}

      {/* EC-004: 에러 메시지 표시 */}
      {errorMessage && typeof errorMessage === 'string' && errorMessage.trim().length > 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage.trim()}</Text>
        </View>
      ) : null}

      {/* 입력창 */}
      <View style={styles.inputContainer}>
        {/* 첨부 파일 버튼 (선택사항) */}
        {onAttachFile ? <AttachmentButton onPress={onAttachFile} /> : null}

        {/* 텍스트 입력 필드 */}
        <ChatTextInput
          value={message}
          onChangeText={setMessage}
          placeholder={isRoomEntered ? "메시지를 입력하세요" : "먼저 채팅방에 입장해주세요"}
          onSubmitEditing={handleSubmitEditing}
          editable={isRoomEntered}
        />

        {/* 전송 버튼 */}
        <SendButton
          onPress={handleSend}
          disabled={isDisabled}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
