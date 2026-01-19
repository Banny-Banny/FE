/**
 * components/customer-service/components/file-preview/file-preview.tsx
 * 파일 미리보기 컴포넌트 (파일명, 크기 표시)
 */

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-remix-icon';
import { FilePreviewProps } from './types';
import { styles } from './styles';
import { Colors } from '@/commons/constants';

/**
 * 파일 크기 포맷팅 함수
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * 파일 아이콘 이름 가져오기
 */
function getFileIconName(mimeType?: string): string {
  if (!mimeType) return 'file-line';

  if (mimeType.startsWith('image/')) {
    return 'image-line';
  } else if (mimeType.startsWith('video/')) {
    return 'video-line';
  } else if (mimeType.startsWith('audio/')) {
    return 'music-line';
  } else if (mimeType.includes('pdf')) {
    return 'file-pdf-line';
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'file-word-line';
  } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'file-excel-line';
  } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
    return 'file-zip-line';
  }

  return 'file-line';
}

/**
 * 파일 미리보기 컴포넌트
 * 
 * @description
 * - 파일명 및 크기 표시
 * - 파일 타입에 따른 아이콘 표시
 * - 제거 버튼 제공 (선택사항)
 */
export function FilePreview({
  attachment,
  onPress,
  onRemove,
  showRemoveButton = true,
}: FilePreviewProps) {
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
