/**
 * components/customer-service/components/file-preview/image-preview.tsx
 * 이미지 미리보기 컴포넌트
 */

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-remix-icon';
import { ImagePreviewProps } from './types';
import { styles } from './styles';
import { Colors } from '@/commons/constants';

/**
 * 이미지 미리보기 컴포넌트
 * 
 * @description
 * - 선택된 이미지의 썸네일 표시
 * - 제거 버튼 제공 (선택사항)
 * - 터치 시 확대 가능 (선택사항)
 */
export function ImagePreview({
  attachment,
  onPress,
  onRemove,
  showRemoveButton = true,
}: ImagePreviewProps) {
  return (
    <View style={styles.imagePreviewWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.imagePreviewContainer}
        disabled={!onPress}>
        <Image
          source={{ uri: attachment.url }}
          style={styles.imagePreview}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>

      {showRemoveButton && onRemove && (
        <View style={styles.imageRemoveButtonContainer}>
          <TouchableOpacity
            style={styles.imageRemoveButton}
            onPress={onRemove}
            activeOpacity={0.7}>
            <Icon name="close-line" size={16} color={Colors.white[50]} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
