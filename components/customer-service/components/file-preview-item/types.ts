/**
 * components/customer-service/components/file-preview-item/types.ts
 * 파일 미리보기 아이템 컴포넌트 Props 타입 정의
 */

import { MessageAttachment } from '@/components/customer-service/types';

export interface FilePreviewItemProps {
  attachment: MessageAttachment;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}
