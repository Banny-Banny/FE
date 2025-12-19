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

import { getMimeType, normalizeApiBaseUrl } from '@/utils';
import axios from 'axios';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// 허용된 파일 확장자 정의
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'svg'];
const ALLOWED_AUDIO_EXTENSIONS = ['mp3', 'm4a', 'aac', 'wav'];
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'm4v'];

// 파일 타입별 허용 확장자 매핑
const ALLOWED_EXTENSIONS: Record<'photo' | 'music' | 'video', string[]> = {
  photo: ALLOWED_IMAGE_EXTENSIONS,
  music: ALLOWED_AUDIO_EXTENSIONS,
  video: ALLOWED_VIDEO_EXTENSIONS,
};

// 파일 타입별 오류 메시지
const ERROR_MESSAGES: Record<'photo' | 'music' | 'video', string> = {
  photo: `이미지 파일만 업로드 가능합니다.\n허용 형식: ${ALLOWED_IMAGE_EXTENSIONS.join(
    ', ',
  ).toUpperCase()}`,
  music: `오디오 파일만 업로드 가능합니다.\n허용 형식: ${ALLOWED_AUDIO_EXTENSIONS.join(
    ', ',
  ).toUpperCase()}`,
  video: `비디오 파일만 업로드 가능합니다.\n허용 형식: ${ALLOWED_VIDEO_EXTENSIONS.join(
    ', ',
  ).toUpperCase()}`,
};

/**
 * 파일 확장자 추출
 */
const getFileExtension = (filename: string): string => {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

/**
 * 파일 확장자 검증
 */
const validateFileExtension = (filename: string, type: 'photo' | 'music' | 'video'): boolean => {
  const extension = getFileExtension(filename);
  const allowedExtensions = ALLOWED_EXTENSIONS[type];
  return allowedExtensions.includes(extension);
};

/**
 * 파일 업로드 Hook
 */
export const useFileUpload = () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      if (!validateFileExtension(fileName, 'photo')) {
        Alert.alert('파일 형식 오류', ERROR_MESSAGES.photo);
        return null;
      }

      return {
        name: fileName,
        uri,
      };
    } catch (error) {
      console.log('이미지 선택 오류:', error);
      return null;
    }
  };

  /**
   * 문서 선택 핸들러 (음악/동영상)
   * @param type 파일 타입 (music, video)
   * @returns 선택된 파일 정보 또는 null
   */
  const handleDocumentSelect = async (
    type: 'music' | 'video',
  ): Promise<{ name: string; uri: string } | null> => {
    try {
      // MIME 타입 설정
      const mimeTypes =
        type === 'music'
          ? ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/*']
          : ['video/mp4', 'video/quicktime', 'video/m4v', 'video/*'];

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
        Alert.alert('파일 형식 오류', ERROR_MESSAGES[type]);
        return null;
      }

      return {
        name: fileName,
        uri,
      };
    } catch (error) {
      console.log('문서 선택 오류:', error);
      return null;
    }
  };

  /**
   * 파일 선택 핸들러
   * @param type 파일 타입 (photo, music, video)
   * @returns 선택된 파일 정보 또는 null
   */
  const handleFileSelect = async (
    type: 'photo' | 'music' | 'video',
  ): Promise<{ name: string; uri: string } | null> => {
    if (type === 'photo') {
      return handleImageSelect();
    } else {
      return handleDocumentSelect(type);
    }
  };

  /**
   * 서버에 파일 업로드
   * @param fileUri 파일 URI
   * @param fileType 파일 타입
   * @param token 인증 토큰 (선택적)
   * @returns 업로드된 파일의 URL 또는 null
   */
  const uploadFileToServer = async (
    fileUri: string,
    fileType: 'photo' | 'music' | 'video',
    token?: string | null,
  ): Promise<string | null> => {
    try {
      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        throw new Error(
          'API Base URL이 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.\n예: http://172.16.2.94:3000',
        );
      }

      // FormData 생성
      const formData = new FormData();
      const fileExtension = fileUri.split('.').pop() || '';
      const fileName = `file_${Date.now()}.${fileExtension}`;

      // React Native에서는 파일을 객체 형태로 추가
      formData.append('file', {
        uri: fileUri,
        type: getMimeType(fileType),
        name: fileName,
      } as any);

      // 파일 업로드 API 호출
      const uploadResponse = await axios.post(`${apiBaseUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return uploadResponse.data.url || uploadResponse.data.media_url || null;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      return null;
    }
  };

  return {
    handleFileSelect,
    validateFileExtension,
    uploadFileToServer,
    ALLOWED_EXTENSIONS,
  };
};
