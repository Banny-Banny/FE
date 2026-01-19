/**
 * components/customer-service/components/file-preview/index.tsx
 * 파일 미리보기 컨테이너 컴포넌트
 */

import React from 'react';
import { View } from 'react-native';
import { FilePreviewContainerProps } from './types';
import { ImagePreview } from './image-preview';
import { FilePreview } from './file-preview';
import { styles } from './styles';

/**
 * 파일 미리보기 컨테이너 컴포넌트
 * 
 * @description
 * - 선택된 파일들의 미리보기 표시
 * - 이미지와 일반 파일을 구분하여 표시
 * - 제거 기능 제공
 */
export function FilePreviewContainer({
  attachments,
  onRemove,
  showRemoveButton = true,
}: FilePreviewContainerProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {attachments.map((attachment) => {
        if (attachment.type === 'IMAGE') {
          return (
            <ImagePreview
              key={attachment.id}
              attachment={attachment}
              onRemove={onRemove ? () => onRemove(attachment.id) : undefined}
              showRemoveButton={showRemoveButton}
            />
          );
        } else {
          return (
            <FilePreview
              key={attachment.id}
              attachment={attachment}
              onRemove={onRemove ? () => onRemove(attachment.id) : undefined}
              showRemoveButton={showRemoveButton}
            />
          );
        }
      })}
    </View>
  );
}
