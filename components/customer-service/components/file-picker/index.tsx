/**
 * components/customer-service/components/file-picker/index.tsx
 * 파일 선택 컴포넌트 컨테이너
 */

import React from 'react';
import { ActionSheetIOS, Platform, Alert } from 'react-native';
import { FilePickerProps } from './types';
import { pickImage } from './image-picker';
import { pickDocument } from './document-picker';
import { SIZE_LIMITS } from '@/commons/constants';

/**
 * 파일 선택 컴포넌트
 * 
 * @description
 * - 이미지 또는 파일 선택 옵션 제공
 * - iOS: ActionSheet 사용
 * - Android: Alert 사용
 * - 파일 크기 및 형식 검증
 */
export function FilePicker({
  onSelectFile,
  onError,
  maxImageSize = SIZE_LIMITS.IMAGE,
  maxFileSize = 10 * 1024 * 1024, // 기본값: 10MB
}: FilePickerProps): void {
  const handleSelectImage = async () => {
    await pickImage({
      onSelect: onSelectFile,
      onError,
      maxSize: maxImageSize,
    });
  };

  const handleSelectDocument = async () => {
    await pickDocument({
      onSelect: onSelectFile,
      onError,
      maxSize: maxFileSize,
    });
  };

  const showPickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '사진 선택', '파일 선택'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleSelectImage();
          } else if (buttonIndex === 2) {
            handleSelectDocument();
          }
        }
      );
    } else {
      Alert.alert(
        '파일 선택',
        '어떤 파일을 선택하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '사진 선택', onPress: handleSelectImage },
          { text: '파일 선택', onPress: handleSelectDocument },
        ]
      );
    }
  };

  // 컴포넌트가 호출되면 즉시 옵션 표시
  showPickerOptions();
}

/**
 * 파일 선택 함수 (직접 호출 가능)
 */
export async function selectFile(options: FilePickerProps): Promise<void> {
  const { onSelectFile, onError, maxImageSize, maxFileSize } = options;

  const handleSelectImage = async () => {
    await pickImage({
      onSelect: onSelectFile,
      onError,
      maxSize: maxImageSize,
    });
  };

  const handleSelectDocument = async () => {
    await pickDocument({
      onSelect: onSelectFile,
      onError,
      maxSize: maxFileSize,
    });
  };

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['취소', '사진 선택', '파일 선택'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleSelectImage();
        } else if (buttonIndex === 2) {
          handleSelectDocument();
        }
      }
    );
  } else {
    Alert.alert(
      '파일 선택',
      '어떤 파일을 선택하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '사진 선택', onPress: handleSelectImage },
        { text: '파일 선택', onPress: handleSelectDocument },
      ]
    );
  }
}
