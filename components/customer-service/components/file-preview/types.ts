/**
 * components/customer-service/components/file-preview/types.ts
 * 파일 미리보기 컴포넌트 Props 타입 정의
 */

import { MessageAttachment } from '@/components/customer-service/types';

/**
 * 이미지 미리보기 Props
 */
export interface ImagePreviewProps {
  attachment: MessageAttachment;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

/**
 * 파일 미리보기 Props
 */
export interface FilePreviewProps {
  attachment: MessageAttachment;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

/**
 * 파일 미리보기 컨테이너 Props
 */
export interface FilePreviewContainerProps {
  attachments: MessageAttachment[];
  onRemove?: (attachmentId: string) => void;
  showRemoveButton?: boolean;
}
