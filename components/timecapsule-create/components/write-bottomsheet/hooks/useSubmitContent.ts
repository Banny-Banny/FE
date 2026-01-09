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

import { useState } from 'react';
import { submitMyContent } from '../api/content';
import type { UserContentFormData, ValidationResult, UseSubmitContentReturn } from '../types';

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
 *
 * @param uri - 파일 URI
 * @param name - 파일명
 * @param type - MIME 타입
 * @returns File 객체
 */
async function uriToFile(uri: string, name: string, type: string): Promise<File> {
  try {
    const blob = await uriToBlob(uri);
    return new File([blob], name, { type });
  } catch (error) {
    console.error('URI to File 변환 실패:', error);
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

      // 2. FormData 생성
      const formData = new FormData();

      // text_message 추가 (필수!)
      formData.append('text_message', data.textContent.trim());

      // 이미지 파일 추가
      if (data.photos.length > 0) {
        console.log(`📤 [useSubmitContent] 이미지 ${data.photos.length}개 변환 중...`);
        for (let i = 0; i < data.photos.length; i++) {
          const photoUri = data.photos[i];
          const fileName = generateFileName(photoUri, 'photo', 'jpg');
          const photoFile = await uriToFile(photoUri, fileName, 'image/jpeg');
          formData.append('images', photoFile);
          console.log(
            `✅ [useSubmitContent] 이미지 ${i + 1}/${data.photos.length} 변환 완료: ${fileName}`,
          );
        }
      }

      // 음악 파일 추가
      if (data.music) {
        console.log('📤 [useSubmitContent] 음악 파일 변환 중...');
        const fileName = generateFileName(data.music, 'music', 'mp3');
        const musicFile = await uriToFile(data.music, fileName, 'audio/mpeg');
        formData.append('music', musicFile);
        console.log(`✅ [useSubmitContent] 음악 파일 변환 완료: ${fileName}`);
      }

      // 비디오 파일 추가
      if (data.video) {
        console.log('📤 [useSubmitContent] 비디오 파일 변환 중...');
        const fileName = generateFileName(data.video, 'video', 'mp4');
        const videoFile = await uriToFile(data.video, fileName, 'video/mp4');
        formData.append('video', videoFile);
        console.log(`✅ [useSubmitContent] 비디오 파일 변환 완료: ${fileName}`);
      }

      console.log('📤 [useSubmitContent] API 제출 시작');

      // 3. API 호출
      const result = await submitMyContent(capsuleId, formData);

      console.log('✅ [useSubmitContent] 제출 완료:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '제출에 실패했습니다.';
      console.error('❌ [useSubmitContent] 제출 실패:', errorMessage);
      setError(errorMessage);
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
  };
}
