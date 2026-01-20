/**
 * components/customer-service/components/image-preview/types.ts
 * 이미지 미리보기 컴포넌트 Props 타입 정의
 */

import { MessageAttachment } from '@/components/customer-service/types';

export interface ImagePreviewProps {
  attachment: MessageAttachment;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}
