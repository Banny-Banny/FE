/**
 * components/map/components/egg-form/hooks/useFileUpload.ts
 * 파일 선택 및 서버 업로드 Hook
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] 파일 확장자 제한 로직 구현
 * - [x] 이미지: jpg, jpeg, png, gif, webp, heic, svg
 * - [x] 오디오: mp3, m4a, aac, wav
 * - [x] 비디오: mp4, mov, m4v
 * - [x] 실제 파일 선택 기능 구현 (expo-image-picker, expo-document-picker)
 * - [x] 서버 파일 업로드 기능 구현
 */

import { ALLOWED_EXTENSIONS, MediaType } from '@/commons/constants';
import { useMediaUpload } from '@/commons/hooks';
import { getMimeTypes, validateFileExtension } from '@/utils';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * 파일 업로드 Hook
 */
export const useFileUpload = () => {
  const { upload: uploadMedia, isUploading, error } = useMediaUpload();

  /**
   * 이미지 선택 핸들러
   * @returns 선택된 이미지 정보 또는 null
   */
  const handleImageSelect = async (): Promise<{ name: string; uri: string } | null> => {
    try {
      // 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return null;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const fileName = asset.fileName || `image_${Date.now()}.jpg`;
      const uri = asset.uri;

      // 파일 확장자 검증
      if (!validateFileExtension(fileName, 'IMAGE')) {
        Alert.alert(
          '파일 형식 오류',
          `이미지 파일만 업로드 가능합니다.\n허용 형식: ${ALLOWED_EXTENSIONS.IMAGE.join(
            ', ',
          ).toUpperCase()}`,
        );
        return null;
      }

      return {
        name: fileName,
        uri,
      };
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      return null;
    }
  };

  /**
   * 문서 선택 핸들러 (음악/동영상)
   * @param type 파일 타입 (AUDIO, VIDEO)
   * @returns 선택된 파일 정보 또는 null
   */
  const handleDocumentSelect = async (
    type: Exclude<MediaType, 'IMAGE'>,
  ): Promise<{ name: string; uri: string } | null> => {
    try {
      // MIME 타입 설정 (ALLOWED_EXTENSIONS 기반)
      const mimeTypes = getMimeTypes(type);

      // 문서 선택
      const result = await DocumentPicker.getDocumentAsync({
        type: mimeTypes,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const fileName = asset.name;
      const uri = asset.uri;

      // 파일 확장자 검증
      if (!validateFileExtension(fileName, type)) {
        const allowedExtensions = ALLOWED_EXTENSIONS[type];
        Alert.alert(
          '파일 형식 오류',
          `${
            type === 'AUDIO' ? '오디오' : '비디오'
          } 파일만 업로드 가능합니다.\n허용 형식: ${allowedExtensions.join(', ').toUpperCase()}`,
        );
        return null;
      }

      return {
        name: fileName,
        uri,
      };
    } catch (error) {
      console.error('문서 선택 오류:', error);
      return null;
    }
  };

  /**
   * 파일 선택 핸들러
   * @param type 파일 타입 (IMAGE, VIDEO, AUDIO)
   * @returns 선택된 파일 정보 또는 null
   */
  const handleFileSelect = async (
    type: MediaType,
  ): Promise<{ name: string; uri: string } | null> => {
    if (type === 'IMAGE') {
      return handleImageSelect();
    }
    if (type === 'AUDIO') {
      // AUDIO 타입일 때는 오디오 파일만 선택 가능
      return handleDocumentSelect('AUDIO');
    }
    if (type === 'VIDEO') {
      // VIDEO 타입일 때는 비디오 파일만 선택 가능
      return handleDocumentSelect('VIDEO');
    }
    return null;
  };

  /**
   * 서버에 파일 업로드 (useMediaUpload 사용)
   * @param fileUri 파일 URI
   * @param fileType 파일 타입 (IMAGE, VIDEO, AUDIO)
   * @param token 인증 토큰 (사용하지 않음, useMediaUpload 내부에서 처리)
   * @returns 업로드된 미디어 ID 또는 null
   */
  const uploadFileToServer = async (
    fileUri: string,
    fileType: MediaType,
    token?: string | null,
  ): Promise<string | null> => {
    try {
      const mediaId = await uploadMedia(fileUri, fileType);
      return mediaId;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      if (error) {
        Alert.alert(
          '업로드 오류',
          error instanceof Error ? error.message : '파일 업로드에 실패했습니다.',
        );
      }
      return null;
    }
  };

  return {
    handleFileSelect,
    validateFileExtension,
    uploadFileToServer,
    isUploading,
    uploadError: error,
    ALLOWED_EXTENSIONS,
  };
};
