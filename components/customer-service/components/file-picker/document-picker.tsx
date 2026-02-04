/**
 * components/customer-service/components/file-picker/document-picker.tsx
 * 문서/파일 선택 컴포넌트 (expo-document-picker 사용)
 */

import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { DocumentPickerProps, FilePickerResult } from './types';

/**
 * 문서 선택 컴포넌트
 * 
 * @description
 * - expo-document-picker를 사용하여 파일 선택
 * - 파일 크기 및 형식 검증
 * - 다양한 파일 형식 지원
 */
export async function pickDocument({
  onSelect,
  onError,
  maxSize = 10 * 1024 * 1024, // 기본값: 10MB
  allowedTypes,
}: DocumentPickerProps): Promise<void> {
  try {
    // 문서 선택
    const result = await DocumentPicker.getDocumentAsync({
      type: allowedTypes || '*/*', // 모든 파일 형식 허용 (필요시 제한 가능)
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    // 파일 크기 검증
    if (asset.size && asset.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const errorMessage = `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`;
      onError?.(errorMessage);
      Alert.alert('파일 크기 초과', errorMessage);
      return;
    }

    // 파일명 및 URI 추출
    const fileName = asset.name || `file_${Date.now()}`;
    const uri = asset.uri;
    const mimeType = asset.mimeType || 'application/octet-stream';

    const fileResult: FilePickerResult = {
      uri,
      name: fileName,
      size: asset.size || 0,
      type: 'FILE',
      mimeType,
    };

    onSelect(fileResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '파일 선택 중 오류가 발생했습니다.';
    onError?.(errorMessage);
    Alert.alert('오류', errorMessage);
  }
}
