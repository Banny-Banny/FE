/**
 * components/customer-service/components/file-preview-item/index.tsx
 * 파일 미리보기 컴포넌트 (파일명, 크기 표시)
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { formatFileSize, getFileIconName } from '../shared/message-utils';
import { styles } from './styles';
import { FilePreviewItemProps } from './types';

/**
 * 파일 미리보기 컴포넌트
 * 
 * @description
 * - 파일명 및 크기 표시
 * - 파일 타입에 따른 아이콘 표시
 * - 제거 버튼 제공 (선택사항)
 */
export function FilePreviewItem({
  attachment,
  onPress,
  onRemove,
  showRemoveButton = true,
}: FilePreviewItemProps) {
  const fileSize = attachment.size ? formatFileSize(attachment.size) : '';
  const iconName = getFileIconName(attachment.mimeType);

  return (
    <TouchableOpacity
      style={styles.filePreviewContainer}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      {/* 파일 아이콘 */}
      <View style={styles.filePreviewIcon}>
        <Icon name={iconName} size={20} color={Colors.blue[500]} />
      </View>

      {/* 파일 정보 */}
      <View style={styles.filePreviewContent}>
        <Text style={styles.filePreviewName} numberOfLines={1}>
          {attachment.name}
        </Text>
        {fileSize && <Text style={styles.filePreviewSize}>{fileSize}</Text>}
      </View>

      {/* 제거 버튼 */}
      {showRemoveButton && onRemove && (
        <TouchableOpacity
          style={styles.fileRemoveButton}
          onPress={onRemove}
          activeOpacity={0.7}>
          <Icon name="close-line" size={18} color={Colors.grey[500]} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
