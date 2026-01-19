/**
 * components/customer-service/components/file-picker/image-picker.tsx
 * 이미지 선택 컴포넌트 (expo-image-picker 사용)
 */

import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';
import { ImagePickerProps, FilePickerResult } from './types';
import { SIZE_LIMITS } from '@/commons/constants';

/**
 * 이미지 선택 컴포넌트
 * 
 * @description
 * - expo-image-picker를 사용하여 이미지 선택
 * - 파일 크기 및 형식 검증
 * - 권한 요청 처리
 */
export async function pickImage({
  onSelect,
  onError,
  maxSize = SIZE_LIMITS.IMAGE,
  allowsEditing = false,
  quality = 0.8,
}: ImagePickerProps): Promise<void> {
  try {
    // 권한 요청
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const errorMessage = '이미지 선택을 위해 갤러리 접근 권한이 필요합니다.';
        onError?.(errorMessage);
        Alert.alert('권한 필요', errorMessage);
        return;
      }
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      quality,
      allowsMultipleSelection: false,
    });

    if (result.canceled) {
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    // 파일 크기 검증
    if (asset.fileSize && asset.fileSize > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const errorMessage = `이미지 크기는 ${maxSizeMB}MB 이하여야 합니다.`;
      onError?.(errorMessage);
      Alert.alert('파일 크기 초과', errorMessage);
      return;
    }

    // 파일명 추출
    const fileName = asset.fileName || `image_${Date.now()}.jpg`;
    const uri = asset.uri;

    // MIME 타입 추출
    let mimeType = 'image/jpeg';
    if (uri.endsWith('.png')) {
      mimeType = 'image/png';
    } else if (uri.endsWith('.webp')) {
      mimeType = 'image/webp';
    } else if (asset.mimeType) {
      mimeType = asset.mimeType;
    }

    const fileResult: FilePickerResult = {
      uri,
      name: fileName,
      size: asset.fileSize || 0,
      type: 'IMAGE',
      mimeType,
    };

    onSelect(fileResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '이미지 선택 중 오류가 발생했습니다.';
    onError?.(errorMessage);
    Alert.alert('오류', errorMessage);
  }
}
