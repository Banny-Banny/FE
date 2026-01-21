/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useUpdateContent.ts
 * 타임캡슐 콘텐츠 부분 수정 Hook (PATCH)
 *
 * 체크리스트:
 * - [✓] hasChanges 함수 구현 (변경 사항 확인)
 * - [✓] updateContent 함수 구현 (PATCH API 호출)
 * - [✓] 변경된 필드만 FormData에 추가
 * - [✓] 로딩 상태 관리 (isUpdating)
 * - [✓] 에러 상태 관리 (error)
 * - [✓] 업로드 진행 상태 (uploadProgress)
 */

import { ALLOWED_EXTENSIONS, MediaType, SIZE_LIMITS } from '@/commons/constants/media';
import { getFileExtension, validateFileExtension } from '@/utils/mediaType';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Platform } from 'react-native';
import { patchMyContent } from '../api/content';
import type { UserContentFormData, UseUpdateContentReturn } from '../types';

/**
 * URI가 로컬 파일인지 확인 (HTTP/HTTPS URL이 아닌지)
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
  const extractedFilename = filename || uri.split('/').pop() || '';
  const extension = getFileExtension(extractedFilename);

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
    if (Platform.OS === 'web') {
      return;
    }
    throw new Error('파일 크기를 확인할 수 없습니다.');
  }
}

/**
 * URI를 Blob으로 변환
 */
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
}

/**
 * URI를 File 객체로 변환
 */
async function uriToFile(uri: string, name: string, type: string): Promise<File> {
  try {
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`파일을 가져올 수 없습니다: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const finalType = blob.type || type;
      return new File([blob], name, { type: finalType });
    } else {
      const blob = await uriToBlob(uri);
      return new File([blob], name, { type });
    }
  } catch (error) {
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
 * 배열 비교 함수 (순서 무시)
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

/**
 * 타임캡슐 콘텐츠 부분 수정 Hook
 */
export function useUpdateContent(): UseUpdateContentReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  /**
   * 변경 사항 확인 함수
   * originalData와 비교하여 변경된 필드가 있는지 확인
   */
  const hasChanges = (data: UserContentFormData, originalData?: UserContentFormData): boolean => {
    if (!originalData) return true;

    // 텍스트 변경 확인
    if (data.textContent.trim() !== originalData.textContent.trim()) {
      return true;
    }

    // 이미지 변경 확인
    if (!arraysEqual(data.photos, originalData.photos)) {
      return true;
    }

    // 음성 변경 확인
    if (data.music !== originalData.music) {
      return true;
    }

    // 비디오 변경 확인
    if (data.video !== originalData.video) {
      return true;
    }

    return false;
  };

  /**
   * 콘텐츠 수정 함수
   * @param data 현재 폼 데이터
   * @param capsuleId 캡슐 ID
   * @param originalData 원본 데이터 (변경 감지용)
   */
  const updateContent = async (
    data: UserContentFormData,
    capsuleId: string,
    originalData?: UserContentFormData,
  ): Promise<void> => {
    try {
      setIsUpdating(true);
      setError(null);

      // ⭐ 변경 사항이 없으면 early return
      if (!hasChanges(data, originalData)) {
        setUploadProgress('');
        return;
      }

      // 텍스트 길이 검증 (수정 시에도 최대 500자)
      if (data.textContent && data.textContent.length > 500) {
        throw new Error('텍스트는 최대 500자까지 입력 가능합니다');
      }

      setUploadProgress('변경 사항 확인 중...');

      const formData = new FormData();
      const debugAppendedKeys: string[] = [];
      const debugAppend = (key: string) => {
        debugAppendedKeys.push(key);
      };
      let hasAnyChange = false;

      // 1. 텍스트 변경 확인 및 추가
      if (!originalData || data.textContent.trim() !== originalData.textContent.trim()) {
        if (data.textContent.trim()) {
          formData.append('text_message', data.textContent.trim());
          debugAppend('text_message');
          hasAnyChange = true;
        }
      }

      // 2. 이미지 변경 확인 및 추가
      // ⭐ 이미지가 변경된 경우에만 전체 교체
      const imagesChanged = !originalData || !arraysEqual(data.photos, originalData.photos);
      if (imagesChanged && data.photos.length > 0) {
        setUploadProgress(`이미지 ${data.photos.length}개 처리 중...`);

        // 기존 이미지(HTTP URL)와 새 이미지(로컬 파일) 분리
        const existingImageUrls: string[] = [];
        const newImageUris: string[] = [];

        for (let i = 0; i < data.photos.length; i++) {
          const photoUri = data.photos[i];
          if (isLocalFile(photoUri)) {
            newImageUris.push(photoUri);
          } else {
            existingImageUrls.push(photoUri);
          }
        }

        // 이미지 개수 검증 (기존 + 새 합쳐서 최대 5개)
        if (existingImageUrls.length + newImageUris.length > 5) {
          throw new Error('이미지는 최대 5개까지 추가 가능합니다');
        }

        // 기존 이미지 URL 전달 (인덱스는 0부터 시작)
        if (existingImageUrls.length > 0) {
          existingImageUrls.forEach((url, index) => {
            formData.append(`existing_image_urls[${index}]`, url);
            debugAppend(`existing_image_urls[${index}]`);
          });
        }

        // 새 이미지 파일 업로드
        if (newImageUris.length > 0) {
          for (let i = 0; i < newImageUris.length; i++) {
            const photoUri = newImageUris[i];
            const originalFilename = photoUri.split('/').pop() || '';
            const hasExtension = !!getFileExtension(originalFilename);
            const filenameForUpload = hasExtension
              ? originalFilename
              : generateFileName(photoUri, 'photo', 'jpg');

            try {
              await validateMediaFile(photoUri, 'IMAGE', filenameForUpload);
            } catch (validationError) {
              const errorMessage =
                validationError instanceof Error ? validationError.message : '파일 검증 실패';
              throw new Error(`이미지 ${i + 1} 검증 실패: ${errorMessage}`);
            }

            const extension = getFileExtension(filenameForUpload) || 'jpg';
            const mimeType =
              extension === 'jpg' || extension === 'jpeg'
                ? 'image/jpeg'
                : extension === 'png'
                ? 'image/png'
                : extension === 'webp'
                ? 'image/webp'
                : 'image/jpeg';

            const photoFile = await uriToFile(photoUri, filenameForUpload, mimeType);
            formData.append('images', photoFile);
            debugAppend('images');
          }
        }

        hasAnyChange = true;
      } else if (imagesChanged && data.photos.length === 0 && originalData && originalData.photos.length > 0) {
        // ⭐ 이미지를 모두 삭제한 경우
        // existing_image_urls 필드를 전송하지 않으면 백엔드가 빈 배열로 처리할 수 있음
        // 또는 백엔드가 clear_images 필드를 지원한다면 사용 가능
        // 일단 existing_image_urls 필드를 보내지 않음 (백엔드가 빈 배열로 처리하도록)
        hasAnyChange = true;
      } else if (!imagesChanged && originalData?.photos.length) {
        // ⭐ 이미지 변경이 없더라도 서버가 Null로 초기화하지 않도록 기존 URL 명시 전달
        originalData.photos.forEach((url, index) => {
          formData.append(`existing_image_urls[${index}]`, url);
          debugAppend(`existing_image_urls[${index}]`);
        });
      }

      // 3. 음성 변경 확인 및 추가
      if (!originalData || data.music !== originalData.music) {
        if (data.music) {
          if (isLocalFile(data.music)) {
            setUploadProgress('음성 파일 처리 중...');

            let extension = 'm4a';
            const uriParts = data.music.split('.');
            if (uriParts.length > 1) {
              const extractedExt = uriParts[uriParts.length - 1].split('?')[0].toLowerCase();
              if (['m4a', 'mp3', 'aac', 'mpeg', 'mp4'].includes(extractedExt)) {
                extension = extractedExt;
              }
            }

            const fileName = generateFileName(data.music, 'music', extension);
            const mimeTypeMap: Record<string, string> = {
              m4a: 'audio/m4a',
              mp3: 'audio/mpeg',
              mpeg: 'audio/mpeg',
              mp4: 'audio/mp4',
              aac: 'audio/aac',
            };
            const mimeType = mimeTypeMap[extension] || 'audio/m4a';

            if (Platform.OS === 'web') {
              const blob = await uriToBlob(data.music);
              formData.append('music', blob, fileName);
              debugAppend('music');
            } else {
              formData.append('music', {
                uri: data.music,
                type: mimeType,
                name: fileName,
              } as any);
              debugAppend('music');
            }
          } else {
            formData.append('existing_music_url', data.music);
            debugAppend('existing_music_url');
          }
          hasAnyChange = true;
        } else if (originalData?.music) {
          // ⭐ 음성을 삭제한 경우
          formData.append('clear_music', 'true');
          debugAppend('clear_music');
          hasAnyChange = true;
        }
      } else if (originalData?.music) {
        // ⭐ 변경이 없더라도 서버가 Null로 초기화하지 않도록 기존 URL 명시
        formData.append('existing_music_url', originalData.music);
        debugAppend('existing_music_url');
      }

      // 4. 비디오 변경 확인 및 추가
      if (!originalData || data.video !== originalData.video) {
        if (data.video) {
          if (isLocalFile(data.video)) {
            setUploadProgress('비디오 파일 처리 중...');

            const filename =
              data.video.split('/').pop() || generateFileName(data.video, 'video', 'mp4');

            try {
              await validateMediaFile(data.video, 'VIDEO', filename);
            } catch (validationError) {
              const errorMessage =
                validationError instanceof Error ? validationError.message : '파일 검증 실패';
              throw new Error(`비디오 파일 검증 실패: ${errorMessage}`);
            }

            const extension = getFileExtension(filename);
            const mimeType =
              extension === 'mp4' ? 'video/mp4' : extension === 'webm' ? 'video/webm' : 'video/mp4';

            const fileName = generateFileName(data.video, 'video', extension || 'mp4');
            const videoFile = await uriToFile(data.video, fileName, mimeType);
            formData.append('video', videoFile);
            debugAppend('video');
          } else {
            formData.append('existing_video_url', data.video);
            debugAppend('existing_video_url');
          }
          hasAnyChange = true;
        } else if (originalData?.video) {
          // ⭐ 비디오를 삭제한 경우
          formData.append('clear_video', 'true');
          debugAppend('clear_video');
          hasAnyChange = true;
        }
      } else if (originalData?.video) {
        // ⭐ 변경이 없더라도 서버가 Null로 초기화하지 않도록 기존 URL 명시
        formData.append('existing_video_url', originalData.video);
        debugAppend('existing_video_url');
      }

      /**
       * ⭐ API 스펙: "전달되지 않은 필드는 기존 값 유지"
       * 따라서 변경되지 않은 필드는 아예 보내지 않음.
       * (이전에 변경 안 된 미디어를 재전송하려 했으나,
       *  HTTP URL을 fetch해서 File로 변환 시 CORS 에러 발생)
       */

      // ⭐ 변경된 필드가 없으면 호출하지 않음
      if (!hasAnyChange) {
        setUploadProgress('');
        return;
      }

      // ⭐ FormData 내용 확인 (디버깅용)
      if (__DEV__) {
        // web: FormData entries를 직접 순회 가능
        if (Platform.OS === 'web') {
          try {
            const keys: string[] = [];
            for (const pair of (formData as any).entries()) {
              const [key, value] = pair;
              if (value instanceof File) {
                keys.push(`${key}(File:${value.name})`);
              } else if (value instanceof Blob) {
                keys.push(`${key}(Blob)`);
              } else {
                keys.push(`${key}=${String(value)}`);
              }
            }
            // eslint-disable-next-line no-console
            console.log('[useUpdateContent] PATCH FormData entries:', keys);
          } catch {
            // ignore
          }
        } else {
          // native: entries 순회가 안 되는 경우가 많아서, append한 key 목록만 출력
          // (위에서 추적한 debugAppendedKeys)
          // eslint-disable-next-line no-console
          console.log('[useUpdateContent] PATCH appended keys:', debugAppendedKeys);
        }
      }

      setUploadProgress('서버에 전송 중...');

      // API 호출
      await patchMyContent(capsuleId, formData);

      setUploadProgress('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      setError(errorMessage);
      setUploadProgress('');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateContent,
    isUpdating,
    error,
    uploadProgress,
    hasChanges,
  };
}
