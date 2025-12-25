/**
 * utils/mediaUpload.ts
 * 미디어 업로드 통합 로직 (순수 함수)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] MIME Type 추론 함수 구현
 * - [x] 검증 가드 함수 구현 (화이트리스트, 용량 제한)
 * - [x] uploadMedia 메인 함수 구현 (4단계)
 * - [x] 에러 핸들링 구현
 * - [x] project-structure.mdc 준수: utils/에 순수 함수로 구현
 */

import { ALLOWED_EXTENSIONS, API_ENDPOINTS, MIME_TYPE_MAP, SIZE_LIMITS } from '@/commons/constants';
import { buildApiUrl, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * 파일 확장자 추출
 */
const getFileExtension = (filename: string): string => {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

/**
 * MIME Type 추론 함수
 * 파일 확장자를 기반으로 정확한 Content-Type을 반환
 */
export const inferMimeType = (filename: string): string => {
  const extension = getFileExtension(filename);
  return MIME_TYPE_MAP[extension] || 'application/octet-stream';
};

/**
 * 검증 가드 함수
 * 화이트리스트 및 용량 제한 검증
 */
export const validateFile = async (
  uri: string,
  type: 'IMAGE' | 'VIDEO' | 'MUSIC',
  filename: string,
): Promise<void> => {
  // 1. 확장자 검증
  const extension = getFileExtension(filename);
  const allowedExtensions = ALLOWED_EXTENSIONS[type] as readonly string[];

  if (!allowedExtensions.includes(extension)) {
    throw new Error(
      `${type} 파일만 업로드 가능합니다.\n허용 형식: ${allowedExtensions.join(', ').toUpperCase()}`,
    );
  }

  // 2. 용량 검증
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists) {
    throw new Error('파일을 찾을 수 없습니다.');
  }

  const sizeInBytes = fileInfo.size || 0;
  const sizeLimit = SIZE_LIMITS[type];

  if (sizeInBytes > sizeLimit) {
    const sizeLimitMB = sizeLimit / (1024 * 1024);
    throw new Error(`파일 크기가 너무 큽니다.\n${type} 파일은 ${sizeLimitMB}MB 이하여야 합니다.`);
  }
};

/**
 * 이미지 압축 함수
 */
const compressImage = async (uri: string): Promise<ImageManipulator.ImageResult> => {
  return await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1080 } }], {
    compress: 0.7,
    format: ImageManipulator.SaveFormat.JPEG,
  });
};

/**
 * Presigned URL 발급
 */
const getPresignedUrl = async (
  type: 'IMAGE' | 'VIDEO' | 'MUSIC',
  filename: string,
  contentType: string,
  size: number,
  token: string,
): Promise<{ upload_url: string; object_key: string }> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error(
      'API Base URL이 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
    );
  }

  try {
    const response = await axios.post<{ upload_url: string; object_key: string }>(
      buildApiUrl(apiBaseUrl, API_ENDPOINTS.MEDIA.PRESIGN),
      {
        type,
        filename,
        content_type: contentType,
        size,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      `Presigned URL 발급 실패: ${axiosError.response?.status} ${axiosError.message}`,
    );
  }
};

/**
 * S3 직접 업로드
 */
const uploadToS3 = async (uri: string, uploadUrl: string, contentType: string): Promise<void> => {
  try {
    // React Native에서는 fetch를 사용하여 파일을 Blob으로 변환
    const response = await fetch(uri);
    const blob = await response.blob();

    await axios.put(uploadUrl, blob, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`S3 업로드 실패: ${axiosError.message}`);
  }
};

/**
 * 업로드 완료 등록
 */
const completeUpload = async (
  objectKey: string,
  contentType: string,
  size: number,
  token: string,
): Promise<string> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error(
      'API Base URL이 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
    );
  }

  try {
    const response = await axios.post<{ media_id: string }>(
      buildApiUrl(apiBaseUrl, API_ENDPOINTS.MEDIA.COMPLETE),
      {
        object_key: objectKey,
        content_type: contentType,
        size,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.media_id;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`업로드 완료 등록 실패: ${axiosError.response?.status} ${axiosError.message}`);
  }
};

/**
 * 미디어 업로드 통합 함수
 * @param uri 파일 URI
 * @param type 미디어 타입 (IMAGE, VIDEO, AUDIO)
 * @param token 인증 토큰
 * @returns 업로드된 미디어 ID
 */
export const uploadMedia = async (
  uri: string,
  type: 'IMAGE' | 'VIDEO' | 'MUSIC',
  token: string,
): Promise<string> => {
  try {
    // 파일명 추출 (URI에서)
    const uriParts = uri.split('/');
    const filename = uriParts[uriParts.length - 1] || `file_${Date.now()}`;

    // Step 1: 전처리 (압축 및 검증)
    let processedUri = uri;
    let processedSize: number;

    if (type === 'IMAGE') {
      // 이미지 압축
      const compressed = await compressImage(uri);
      processedUri = compressed.uri;

      // 압축된 파일 정보 확인
      const fileInfo = await FileSystem.getInfoAsync(processedUri);
      if (!fileInfo.exists) {
        throw new Error('압축된 파일을 찾을 수 없습니다.');
      }
      processedSize = fileInfo.size || 0;
    } else {
      // VIDEO/AUDIO는 원본 사용
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('파일을 찾을 수 없습니다.');
      }
      processedSize = fileInfo.size || 0;
    }

    // 검증 가드 실행
    await validateFile(processedUri, type, filename);

    // MIME Type 추론
    const contentType = inferMimeType(filename);

    // Step 2: Presigned URL 발급
    const { upload_url, object_key } = await getPresignedUrl(
      type,
      filename,
      contentType,
      processedSize,
      token,
    );

    // Step 3: S3 직접 업로드
    await uploadToS3(processedUri, upload_url, contentType);

    // Step 4: 업로드 완료 등록
    const mediaId = await completeUpload(object_key, contentType, processedSize, token);

    return mediaId;
  } catch (error) {
    // 에러 핸들링
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`미디어 업로드 실패: ${String(error)}`);
  }
};
