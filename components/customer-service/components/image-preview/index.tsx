/**
 * components/customer-service/components/image-preview/index.tsx
 * 이미지 미리보기 컴포넌트
 */

import { Colors } from '@/commons/constants';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import { ImagePreviewProps } from './types';

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
          cachePolicy="memory-disk" // 메모리 및 디스크 캐싱
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }} // 블러 플레이스홀더
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
