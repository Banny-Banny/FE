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
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { buildApiUrl, normalizeApiBaseUrl } from './api';
import { apiClient } from './apiClient';

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
 * 웹 환경에서 파일 크기 가져오기
 */
const getFileSizeWeb = async (uri: string): Promise<number> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch (error) {
    console.error('웹에서 파일 크기 가져오기 실패:', error);
    throw new Error('파일 크기를 확인할 수 없습니다.');
  }
};

/**
 * 파일 크기 가져오기 (플랫폼별 처리)
 */
const getFileSize = async (uri: string): Promise<{ exists: boolean; size: number }> => {
  if (Platform.OS === 'web') {
    // 웹 환경: fetch를 사용하여 파일 크기 확인
    try {
      const size = await getFileSizeWeb(uri);
      return { exists: true, size };
    } catch (error) {
      return { exists: false, size: 0 };
    }
  } else {
    // 네이티브 환경: expo-file-system 사용
    const fileInfo = await FileSystem.getInfoAsync(uri);
    // FileInfo 타입에서 size는 선택적이므로 타입 가드 필요
    const size = 'size' in fileInfo && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
    return {
      exists: fileInfo.exists,
      size,
    };
  }
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
  const fileInfo = await getFileSize(uri);
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
 * 웹 환경에서는 압축을 건너뛰고 원본 URI 반환
 */
const compressImage = async (uri: string): Promise<ImageManipulator.ImageResult> => {
  // 웹 환경에서는 expo-image-manipulator가 작동하지 않으므로 원본 반환
  if (Platform.OS === 'web') {
    // 웹에서는 압축 없이 원본 사용
    // 나중에 웹용 이미지 압축 라이브러리로 대체 가능
    return {
      uri,
      width: 0,
      height: 0,
    };
  }

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
): Promise<{ upload_url: string; object_key: string }> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error('API Base URL이 설정되지 않았습니다.');
  }

  const response = await apiClient.post<{ upload_url: string; object_key: string }>(
    buildApiUrl(apiBaseUrl, API_ENDPOINTS.MEDIA.PRESIGN),
    {
      type,
      filename,
      content_type: contentType,
      size,
    },
  );

  return response.data;
};

/**
 * S3 직접 업로드
 */
const uploadToS3 = async (uri: string, uploadUrl: string, contentType: string): Promise<void> => {
  try {
    console.log('📤 S3 업로드 시작...');
    console.log('📤 업로드 URL:', uploadUrl.substring(0, 100) + '...');
    console.log('📤 Content-Type:', contentType);

    // 파일을 Blob으로 변환
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`파일을 가져올 수 없습니다: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log('✅ Blob 생성 완료, 크기:', blob.size, 'bytes');

    // Presigned URL 분석: 서명된 헤더 확인
    const signedHeadersMatch = uploadUrl.match(/X-Amz-SignedHeaders=([^&]+)/);
    const signedHeaders = signedHeadersMatch ? decodeURIComponent(signedHeadersMatch[1]) : '';
    const needsContentType = signedHeaders.includes('content-type');

    console.log('📊 업로드 정보:');
    console.log('  - 실제 파일 크기:', blob.size, 'bytes');
    console.log('  - Content-Type:', contentType);
    console.log('  - 서명된 헤더:', signedHeaders);
    console.log('  - Content-Type 헤더 필요:', needsContentType ? '✅ 예' : '❌ 아니오');

    // 웹 환경에서는 fetch를 직접 사용하는 것이 더 안정적
    if (Platform.OS === 'web') {
      console.log('🌐 웹 환경: fetch로 S3 업로드');

      // 중요: X-Amz-SignedHeaders에 content-type이 포함되어 있으면
      // 반드시 Content-Type 헤더를 보내야 합니다.
      // 포함되어 있지 않으면 헤더를 보내면 403 에러가 발생할 수 있습니다.

      const uploadOptions: RequestInit = {
        method: 'PUT',
        body: blob,
      };

      // 서명된 헤더에 content-type이 포함되어 있으면 헤더 추가
      if (needsContentType) {
        uploadOptions.headers = {
          'Content-Type': contentType,
        };
        console.log('📤 Content-Type 헤더 포함하여 업로드');
      } else {
        console.log('📤 헤더 없이 업로드 (서명에 Content-Type 미포함)');
      }

      const uploadResponse = await fetch(uploadUrl, uploadOptions);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ S3 업로드 실패:', uploadResponse.status);
        console.error('❌ 에러 응답:', errorText);
        console.error('❌ 업로드 URL (일부):', uploadUrl.substring(0, 150));
        console.error('❌ 서명된 헤더:', signedHeaders);
        console.error('❌ Content-Type 헤더 사용 여부:', needsContentType);

        // 403 에러이고 Content-Type 헤더를 사용하지 않았다면 재시도
        if (uploadResponse.status === 403 && !needsContentType) {
          console.log('⚠️ 403 발생, Content-Type 헤더 포함하여 재시도...');
          const retryResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: {
              'Content-Type': contentType,
            },
          });

          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text();
            throw new Error(
              `S3 업로드 실패: ${retryResponse.status} ${retryResponse.statusText}\n에러: ${retryErrorText}\n\n가능한 원인:\n1. Presigned URL 만료\n2. 파일 크기 불일치\n3. CORS 설정 문제\n4. 백엔드 presigned URL 생성 오류`,
            );
          }
          console.log('✅ S3 업로드 성공 (재시도):', retryResponse.status);
          return;
        }

        throw new Error(
          `S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}\n에러: ${errorText}\n\n가능한 원인:\n1. Presigned URL 만료\n2. Content-Type 불일치\n3. 파일 크기 불일치\n4. CORS 설정 문제`,
        );
      }
      console.log('✅ S3 업로드 성공:', uploadResponse.status);
    } else {
      // 네이티브 환경에서도 fetch 사용
      console.log('📱 네이티브 환경: fetch로 S3 업로드');
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          `S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}\n에러: ${errorText}`,
        );
      }
      console.log('✅ S3 업로드 성공');
    }
  } catch (error) {
    console.error('❌ S3 업로드 에러:', error);
    if (error instanceof Error) {
      throw new Error(`S3 업로드 실패: ${error.message}`);
    }
    throw new Error(`S3 업로드 실패: ${String(error)}`);
  }
};

/**
 * 업로드 완료 등록
 */
const completeUpload = async (
  objectKey: string,
  contentType: string,
  size: number,
): Promise<string> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error('API Base URL이 설정되지 않았습니다.');
  }

  const response = await apiClient.post<{ media_id: string }>(
    buildApiUrl(apiBaseUrl, API_ENDPOINTS.MEDIA.COMPLETE),
    {
      object_key: objectKey,
      content_type: contentType,
      size,
    },
  );

  return response.data.media_id;
};

/**
 * 미디어 업로드 통합 함수
 * @param uri 파일 URI
 * @param type 미디어 타입 (IMAGE, VIDEO, MUSIC)
 * @param filename 파일명 (선택적, 없으면 URI에서 추출 시도)
 * @returns 업로드된 미디어 ID
 */
export const uploadMedia = async (
  uri: string,
  type: 'IMAGE' | 'VIDEO' | 'MUSIC',
  filename?: string,
): Promise<string> => {
  try {
    // 파일명 추출 (파라미터가 있으면 사용, 없으면 URI에서 추출)
    let extractedFilename: string;
    if (filename) {
      extractedFilename = filename;
    } else {
      const uriParts = uri.split('/');
      extractedFilename = uriParts[uriParts.length - 1] || `file_${Date.now()}`;

      // blob URL인 경우 확장자 추가 시도
      if (uri.startsWith('blob:')) {
        // blob URL에서는 파일명이 없으므로 타입에 따라 기본 확장자 추가
        const defaultExt = type === 'IMAGE' ? 'jpg' : type === 'VIDEO' ? 'mp4' : 'mp3';
        if (!extractedFilename.includes('.')) {
          extractedFilename = `${extractedFilename}.${defaultExt}`;
        }
      }
    }

    console.log(`📝 파일명: ${extractedFilename} (원본: ${filename || 'URI에서 추출'})`);

    // Step 1: 전처리 (압축 및 검증)
    let processedUri = uri;
    let processedSize: number;

    if (type === 'IMAGE') {
      // 이미지 압축
      const compressed = await compressImage(uri);
      processedUri = compressed.uri;

      // 압축된 파일 정보 확인
      const fileInfo = await getFileSize(processedUri);
      if (!fileInfo.exists) {
        throw new Error('압축된 파일을 찾을 수 없습니다.');
      }
      processedSize = fileInfo.size || 0;
    } else {
      // VIDEO/AUDIO는 원본 사용
      const fileInfo = await getFileSize(uri);
      if (!fileInfo.exists) {
        throw new Error('파일을 찾을 수 없습니다.');
      }
      processedSize = fileInfo.size || 0;
    }

    // 검증 가드 실행
    await validateFile(processedUri, type, extractedFilename);

    // MIME Type 추론
    const contentType = inferMimeType(extractedFilename);

    // Step 2: Presigned URL 발급
    console.log('📡 Presigned URL 발급 요청...');
    console.log('📋 Presigned URL 요청 파라미터:');
    console.log('  - type:', type);
    console.log('  - filename:', extractedFilename);
    console.log('  - content_type:', contentType);
    console.log('  - size:', processedSize, 'bytes');

    const { upload_url, object_key } = await getPresignedUrl(
      type,
      extractedFilename,
      contentType,
      processedSize,
    );
    console.log('✅ Presigned URL 발급 성공');
    console.log('📦 Object Key:', object_key);

    // Step 3: S3 직접 업로드
    console.log('📤 S3 업로드 시작...');
    await uploadToS3(processedUri, upload_url, contentType);
    console.log('✅ S3 업로드 완료');

    // Step 4: 업로드 완료 등록
    const mediaId = await completeUpload(object_key, contentType, processedSize);

    return mediaId;
  } catch (error) {
    // 에러 핸들링
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`미디어 업로드 실패: ${String(error)}`);
  }
};
