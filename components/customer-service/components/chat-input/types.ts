/**
 * components/customer-service/components/chat-input/types.ts
 * 채팅 입력창 컴포넌트 Props 타입 정의
 */

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
}

export interface SendButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface AttachmentButtonProps {
  onPress: () => void;
}

import { MessageAttachment } from '@/components/customer-service/types';

export interface ChatInputProps {
  onSendMessage: (message: string, attachments?: MessageAttachment[]) => void;
  onAttachFile?: () => void;
  attachments?: MessageAttachment[];
  onRemoveAttachment?: (attachmentId: string) => void;
  isLoading?: boolean;
  isRoomEntered?: boolean; // EC-004: 방 입장 여부
  errorMessage?: string; // EC-004: 에러 메시지
}
