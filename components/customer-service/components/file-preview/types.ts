/**
 * components/customer-service/components/file-preview/types.ts
 * 파일 미리보기 컨테이너 Props 타입 정의
 */

import { MessageAttachment } from '@/components/customer-service/types';

export interface FilePreviewContainerProps {
  attachments: MessageAttachment[];
  onRemove?: (attachmentId: string) => void;
  showRemoveButton?: boolean;
}
