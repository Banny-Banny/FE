/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useSubmitContent.ts
 * 타임캡슐 콘텐츠 제출 Hook
 *
 * 체크리스트:
 * - [✓] validateContent 함수 구현
 * - [✓] uriToFile 헬퍼 함수 구현
 * - [✓] createFormData 함수 구현
 * - [✓] 실제 API 연동 submitContent 함수 구현
 * - [✓] 로딩 상태 관리 (isSubmitting)
 * - [✓] 에러 상태 관리 (error)
 * - [✓] capsuleId 파라미터 추가
 * - [✓] text_message 필수 검증
 */

import { ALLOWED_EXTENSIONS, MediaType, SIZE_LIMITS } from '@/commons/constants/media';
import { getFileExtension, validateFileExtension } from '@/utils/mediaType';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Platform } from 'react-native';
import { submitMyContent } from '../api/content';
import type { UserContentFormData, UseSubmitContentReturn, ValidationResult } from '../types';

/**
 * URI가 로컬 파일인지 확인 (HTTP/HTTPS URL이 아닌지)
 * @param uri 파일 URI
 * @returns 로컬 파일이면 true, HTTP URL이면 false
 */
function isLocalFile(uri: string): boolean {
  return !uri.startsWith('http://') && !uri.startsWith('https://');
}

/**
 * 파일 크기 확인 (플랫폼별)
 */
async function getFileSize(uri: string): Promise<number> {
  if (Platform.OS === 'web') {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
    } catch (error) {
      console.error('웹에서 파일 크기 가져오기 실패:', error);
      throw new Error('파일 크기를 확인할 수 없습니다.');
    }
  } else {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('파일을 찾을 수 없습니다.');
    }
    return 'size' in fileInfo && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
  }
}

/**
 * 파일 검증 (타입 및 크기)
 */
async function validateMediaFile(uri: string, type: MediaType, filename?: string): Promise<void> {
  // 파일명 추출
  const extractedFilename = filename || uri.split('/').pop() || '';
  const extension = getFileExtension(extractedFilename);

  // 확장자 검증
  if (!validateFileExtension(extractedFilename, type)) {
    const allowedExtensions = ALLOWED_EXTENSIONS[type];
    const allowedFormats = allowedExtensions.join(', ').toUpperCase();
    throw new Error(
      `${
        type === 'IMAGE' ? '이미지' : type === 'VIDEO' ? '동영상' : '음성'
      } 파일은 ${allowedFormats} 형식만 업로드 가능합니다.\n선택한 파일: ${
        extractedFilename || '알 수 없음'
      }`,
    );
  }

  // 파일 크기 검증
  try {
    const fileSize = await getFileSize(uri);
    const sizeLimit = SIZE_LIMITS[type];
    const sizeLimitMB = sizeLimit / (1024 * 1024);

    if (fileSize > sizeLimit) {
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      throw new Error(
        `파일 크기가 너무 큽니다.\n${
          type === 'IMAGE' ? '이미지' : type === 'VIDEO' ? '동영상' : '음성'
        } 파일은 ${sizeLimitMB}MB 이하여야 합니다.\n현재 파일 크기: ${fileSizeMB}MB`,
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('크기가 너무 큽니다')) {
      throw error;
    }
    // ⭐ 웹 환경에서 파일 크기 확인 실패 시 경고만 하고 계속 진행
    if (Platform.OS === 'web') {
      console.warn(
        `⚠️ [validateMediaFile] 웹에서 파일 크기 검증 실패, 계속 진행: ${extractedFilename}`,
      );
      return; // 검증 실패해도 계속 진행
    }
    throw new Error('파일 크기를 확인할 수 없습니다.');
  }
}

/**
 * URI를 Blob으로 변환하는 헬퍼 함수
 */
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

/**
 * URI를 File 객체로 변환하는 헬퍼 함수
 * React Native 환경에서 URI를 File/Blob 객체로 변환
 * 웹 환경에서는 File API를 직접 사용
 *
 * @param uri - 파일 URI
 * @param name - 파일명
 * @param type - MIME 타입
 * @returns File 객체
 */
async function uriToFile(uri: string, name: string, type: string): Promise<File> {
  try {
    if (Platform.OS === 'web') {
      // 웹 환경: fetch를 사용하여 Blob으로 변환
      console.log(`🔄 [uriToFile] 웹 환경에서 파일 변환 시작: ${uri.substring(0, 50)}...`);

      try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`파일을 가져올 수 없습니다: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log(
          `✅ [uriToFile] Blob 생성 완료: ${blob.size} bytes, type: ${blob.type || type}`,
        );

        // Blob의 타입이 비어있으면 전달받은 타입 사용
        const finalType = blob.type || type;
        const file = new File([blob], name, { type: finalType });
        console.log(`✅ [uriToFile] File 객체 생성 완료: ${file.name}, ${file.size} bytes`);
        return file;
      } catch (fetchError) {
        console.error('❌ [uriToFile] fetch 실패, 원인:', fetchError);
        // fetch 실패 시 추가 정보 로깅
        if (fetchError instanceof TypeError) {
          console.error('  TypeError 발생 - CORS 또는 네트워크 문제일 수 있습니다');
        }
        throw fetchError;
      }
    } else {
      // 네이티브 환경: 기존 방식 사용
      const blob = await uriToBlob(uri);
      return new File([blob], name, { type });
    }
  } catch (error) {
    console.error('❌ [uriToFile] URI to File 변환 실패:', error);
    console.error('  URI:', uri);
    console.error('  파일명:', name);
    console.error('  타입:', type);
    if (error instanceof Error) {
      throw new Error(`파일 변환에 실패했습니다: ${error.message}`);
    }
    throw new Error('파일 변환에 실패했습니다');
  }
}

/**
 * 파일명 생성 헬퍼 함수
 */
function generateFileName(uri: string, prefix: string, extension: string): string {
  const timestamp = Date.now();
  const originalName = uri.split('/').pop();

  if (originalName && originalName.includes('.')) {
    return originalName;
  }

  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * 타임캡슐 콘텐츠 제출 Hook
 */
export function useSubmitContent(): UseSubmitContentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  /**
   * 콘텐츠 검증 함수
   * ⭐ text_message는 필수!
   */
  const validateContent = (data: UserContentFormData): ValidationResult => {
    // ⭐ 텍스트 필수 검증
    if (!data.textContent || data.textContent.trim().length === 0) {
      return {
        isValid: false,
        message: '텍스트 메시지는 필수입니다.',
      };
    }

    // 텍스트 길이 검증 (최대 500자)
    if (data.textContent.length > 500) {
      return {
        isValid: false,
        message: '텍스트는 최대 500자까지 입력 가능합니다',
      };
    }

    return {
      isValid: true,
    };
  };

  /**
   * 콘텐츠 제출 함수
   * @param data 폼 데이터
   * @param capsuleId 캡슐 ID
   */
  const submitContent = async (data: UserContentFormData, capsuleId: string): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 1. 검증 실행
      const validation = validateContent(data);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      console.log('📤 [useSubmitContent] FormData 생성 시작');
      setUploadProgress('FormData 생성 중...');

      // 2. FormData 생성
      // React Native FormData는 웹과 네이티브 모두에서 작동합니다
      const formData = new FormData();

      // text_message 추가 (필수!)
      formData.append('text_message', data.textContent.trim());

      // ⭐ 이미 업로드된 파일 URL 분리
      const existingImageUrls: string[] = [];
      const newImageUris: string[] = [];

      if (data.photos.length > 0) {
        console.log(`📤 [useSubmitContent] 이미지 ${data.photos.length}개 처리 중...`);
        for (let i = 0; i < data.photos.length; i++) {
          const photoUri = data.photos[i];

          if (isLocalFile(photoUri)) {
            // 로컬 파일: 새로 업로드
            newImageUris.push(photoUri);
          } else {
            // HTTP/HTTPS URL: 이미 업로드된 파일
            existingImageUrls.push(photoUri);
            console.log(`  ⏭️  이미지 ${i + 1}: 이미 업로드된 파일 URL 저장 - ${photoUri}`);
          }
        }
      }

      // ⭐ 이미 업로드된 이미지 URL을 별도 필드로 전송 (백엔드가 기존 파일 유지)
      if (existingImageUrls.length > 0) {
        console.log(`📤 [useSubmitContent] 기존 이미지 URL ${existingImageUrls.length}개 전송`);
        existingImageUrls.forEach((url, index) => {
          formData.append(`existing_image_urls[${index}]`, url);
        });
      }

      // 새 이미지 파일 추가
      if (newImageUris.length > 0) {
        setUploadProgress(`이미지 ${newImageUris.length}개 업로드 중...`);
        console.log(`📤 [useSubmitContent] 새 이미지 ${newImageUris.length}개 업로드 준비`);
        for (let i = 0; i < newImageUris.length; i++) {
          const photoUri = newImageUris[i];
          console.log(`  🔄 이미지 ${i + 1}: 로컬 파일 검증 및 변환 중...`);
          console.log(`    URI: ${photoUri.substring(0, 80)}...`);

          // 파일명 추출
          const filename = photoUri.split('/').pop() || generateFileName(photoUri, 'photo', 'jpg');
          console.log(`    파일명: ${filename}`);

          // 파일 검증 (타입 및 크기)
          try {
            await validateMediaFile(photoUri, 'IMAGE', filename);
            console.log(`    ✅ 파일 검증 성공`);
          } catch (validationError) {
            const errorMessage =
              validationError instanceof Error ? validationError.message : '파일 검증 실패';
            console.error(`  ❌ 이미지 ${i + 1} 검증 실패:`, errorMessage);
            throw new Error(`이미지 ${i + 1} 검증 실패: ${errorMessage}`);
          }

          // MIME 타입 추론
          const extension = getFileExtension(filename);
          const mimeType =
            extension === 'jpg' || extension === 'jpeg'
              ? 'image/jpeg'
              : extension === 'png'
              ? 'image/png'
              : extension === 'webp'
              ? 'image/webp'
              : 'image/jpeg';

          console.log(`    MIME 타입: ${mimeType}, 확장자: ${extension}`);

          const fileName = generateFileName(photoUri, 'photo', extension || 'jpg');
          console.log(`    생성된 파일명: ${fileName}`);

          const photoFile = await uriToFile(photoUri, fileName, mimeType);
          console.log(`    File 객체 생성 완료: ${photoFile.size} bytes`);

          formData.append('images', photoFile);
          console.log(
            `✅ [useSubmitContent] 이미지 ${i + 1}/${newImageUris.length} 변환 완료: ${fileName}`,
          );
        }
      }

      // 음성 파일 처리
      if (data.music) {
        if (isLocalFile(data.music)) {
          setUploadProgress('음성 파일 추가 중...');
          console.log('📤 [useSubmitContent] 음성 파일 추가 중...');

          // URI에서 확장자 추출
          let extension = 'm4a'; // 기본값 (모든 플랫폼에서 m4a로 녹음)
          const uriParts = data.music.split('.');
          if (uriParts.length > 1) {
            const extractedExt = uriParts[uriParts.length - 1].split('?')[0].toLowerCase();
            // 백엔드 허용 형식만 체크
            if (['m4a', 'mp3', 'aac', 'mpeg', 'mp4'].includes(extractedExt)) {
              extension = extractedExt;
            }
          }

          const fileName = generateFileName(data.music, 'music', extension);

          // 확장자에 따른 MIME 타입 결정 (백엔드 허용 형식만)
          const mimeTypeMap: Record<string, string> = {
            m4a: 'audio/m4a',
            mp3: 'audio/mpeg',
            mpeg: 'audio/mpeg',
            mp4: 'audio/mp4',
            aac: 'audio/aac',
          };
          const mimeType = mimeTypeMap[extension] || 'audio/m4a';

          // ⭐ 플랫폼별 분기 처리
          if (Platform.OS === 'web') {
            // 웹: URI를 Blob으로 변환 후 추가
            const blob = await uriToBlob(data.music);
            formData.append('music', blob, fileName);
            console.log(
              `✅ [useSubmitContent] [웹] 음성 파일 추가 완료: ${fileName} (${mimeType})`,
            );
          } else {
            // React Native: { uri, type, name } 형태로 추가
            formData.append('music', {
              uri: data.music,
              type: mimeType,
              name: fileName,
            } as any);
            console.log(
              `✅ [useSubmitContent] [앱] 음성 파일 추가 완료: ${fileName} (${mimeType})`,
            );
          }
        } else {
          // HTTP/HTTPS URL: 이미 업로드된 파일
          console.log('  ⏭️  음성: 이미 업로드된 파일 URL 전송 - ', data.music);
          formData.append('existing_music_url', data.music);
        }
      }

      // 비디오 파일 처리
      if (data.video) {
        if (isLocalFile(data.video)) {
          // 로컬 파일: 새로 업로드
          setUploadProgress('비디오 파일 업로드 중...');
          console.log('📤 [useSubmitContent] 비디오 파일 검증 및 변환 중...');
          console.log(`  URI: ${data.video.substring(0, 80)}...`);

          // 파일명 추출
          const filename =
            data.video.split('/').pop() || generateFileName(data.video, 'video', 'mp4');
          console.log(`  파일명: ${filename}`);

          // 파일 검증 (타입 및 크기)
          try {
            await validateMediaFile(data.video, 'VIDEO', filename);
          } catch (validationError) {
            const errorMessage =
              validationError instanceof Error ? validationError.message : '파일 검증 실패';
            console.error('  ❌ 비디오 파일 검증 실패:', errorMessage);
            throw new Error(`비디오 파일 검증 실패: ${errorMessage}`);
          }

          // MIME 타입 추론
          const extension = getFileExtension(filename);
          const mimeType =
            extension === 'mp4' ? 'video/mp4' : extension === 'webm' ? 'video/webm' : 'video/mp4';

          console.log(`  MIME 타입: ${mimeType}, 확장자: ${extension}`);

          const fileName = generateFileName(data.video, 'video', extension || 'mp4');
          console.log(`  생성된 파일명: ${fileName}`);

          const videoFile = await uriToFile(data.video, fileName, mimeType);
          console.log(`  File 객체 생성 완료: ${videoFile.size} bytes`);

          formData.append('video', videoFile);
          console.log(`✅ [useSubmitContent] 비디오 파일 변환 완료: ${fileName}`);
        } else {
          // HTTP/HTTPS URL: 이미 업로드된 파일
          console.log('  ⏭️  비디오: 이미 업로드된 파일 URL 전송 - ', data.video);
          formData.append('existing_video_url', data.video);
        }
      }

      console.log('📤 [useSubmitContent] API 제출 시작');
      setUploadProgress('서버에 전송 중...');

      // ⭐ FormData 내용 확인 (디버깅용)
      if (Platform.OS === 'web') {
        console.log('📋 [useSubmitContent] FormData 내용 확인:');
        for (const pair of (formData as any).entries()) {
          const [key, value] = pair;
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else if (value instanceof Blob) {
            console.log(`  ${key}: Blob(${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${typeof value === 'string' ? value.substring(0, 50) : value}`);
          }
        }
      }

      // 3. API 호출
      const result = await submitMyContent(capsuleId, formData);

      console.log('✅ [useSubmitContent] 제출 완료:', result);
      setUploadProgress('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '제출에 실패했습니다.';
      console.error('❌ [useSubmitContent] 제출 실패:', errorMessage);
      setError(errorMessage);
      setUploadProgress('');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContent,
    isSubmitting,
    error,
    validateContent,
    uploadProgress,
  };
}
