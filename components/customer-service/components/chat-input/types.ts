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

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachFile?: () => void;
  isLoading?: boolean;
}
