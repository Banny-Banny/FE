/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useSubmitContent.ts
 * 타임캡슐 콘텐츠 제출 Hook
 *
 * 체크리스트:
 * - [✓] validateContent 함수 구현
 * - [✓] ⭐ FormData로 파일 직접 전송 (multipart/form-data)
 * - [✓] ⭐ 이미지 파일 FormData에 추가
 * - [✓] ⭐ 음악 파일 FormData에 추가
 * - [✓] ⭐ 비디오 파일 FormData에 추가
 * - [✓] ⭐ uploadProgress 상태 추가
 * - [✓] 실제 API 연동 submitContent 함수 구현
 * - [✓] 로딩 상태 관리 (isSubmitting)
 * - [✓] 에러 상태 관리 (error)
 * - [✓] capsuleId 파라미터 추가
 * - [✓] text_message 필수 검증
 */

import { useState } from 'react';
import { submitMyContent } from '../api/content';
import type { UserContentFormData, UseSubmitContentReturn, ValidationResult } from '../types';

/**
 * 타임캡슐 콘텐츠 제출 Hook
 */
/**
 * URI에서 파일 확장자를 추출하여 MIME 타입 반환
 */
const getMimeType = (uri: string, mediaType: 'image' | 'audio' | 'video'): string => {
  const extension = uri.split('.').pop()?.toLowerCase() || '';

  if (mediaType === 'image') {
    if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
    if (extension === 'png') return 'image/png';
    if (extension === 'gif') return 'image/gif';
    return 'image/jpeg'; // 기본값
  }

  if (mediaType === 'audio') {
    if (extension === 'mp3') return 'audio/mpeg';
    if (extension === 'm4a') return 'audio/mp4';
    if (extension === 'wav') return 'audio/wav';
    return 'audio/mpeg'; // 기본값
  }

  if (mediaType === 'video') {
    if (extension === 'mp4') return 'video/mp4';
    if (extension === 'mov') return 'video/quicktime';
    if (extension === 'avi') return 'video/x-msvideo';
    return 'video/mp4'; // 기본값
  }

  return 'application/octet-stream';
};

/**
 * URI에서 파일명 추출
 */
const getFileName = (uri: string, defaultName: string): string => {
  const fileName = uri.split('/').pop() || defaultName;
  // 파일명에 확장자가 없으면 기본 확장자 추가
  if (!fileName.includes('.')) {
    return defaultName;
  }
  return fileName;
};

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
      setUploadProgress('');

      // 1. 검증 실행
      const validation = validateContent(data);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      console.log('📤 [useSubmitContent] FormData 생성 시작');

      // 2. ⭐ FormData 생성 및 파일 추가 (React Native 내장 FormData 사용)
      const formData = new FormData();

      // 텍스트 메시지 추가 (필수)
      formData.append('text_message', data.textContent.trim());

      // 초대 코드 추가 (처음 참여 시만)
      if (data.inviteCode) {
        formData.append('invite_code', data.inviteCode.trim());
        console.log('📤 [useSubmitContent] 초대 코드 FormData에 추가:', data.inviteCode);
      }

      // 이미지 파일 추가 (배열로 여러 개 추가)
      if (data.photos.length > 0) {
        console.log(`📤 [useSubmitContent] 이미지 ${data.photos.length}개 FormData에 추가 중...`);
        for (let i = 0; i < data.photos.length; i++) {
          setUploadProgress(`파일 준비 중... ${i + 1}/${data.photos.length}`);
          const photoUri = data.photos[i];
          const fileName = getFileName(photoUri, `photo_${Date.now()}_${i}.jpg`);
          const mimeType = getMimeType(photoUri, 'image');

          formData.append('images', {
            uri: photoUri,
            type: mimeType,
            name: fileName,
          } as any);

          console.log(
            `✅ [useSubmitContent] 이미지 ${i + 1}/${data.photos.length} FormData에 추가 완료`,
          );
        }
      }

      // 음악 파일 추가
      if (data.music) {
        setUploadProgress('파일 준비 중...');
        console.log('📤 [useSubmitContent] 음악 파일 FormData에 추가 중...');
        const fileName = getFileName(data.music, `music_${Date.now()}.mp3`);
        const mimeType = getMimeType(data.music, 'audio');

        formData.append('music', {
          uri: data.music,
          type: mimeType,
          name: fileName,
        } as any);

        console.log('✅ [useSubmitContent] 음악 파일 FormData에 추가 완료');
      }

      // 비디오 파일 추가
      if (data.video) {
        setUploadProgress('파일 준비 중...');
        console.log('📤 [useSubmitContent] 비디오 파일 FormData에 추가 중...');
        const fileName = getFileName(data.video, `video_${Date.now()}.mp4`);
        const mimeType = getMimeType(data.video, 'video');

        formData.append('video', {
          uri: data.video,
          type: mimeType,
          name: fileName,
        } as any);

        console.log('✅ [useSubmitContent] 비디오 파일 FormData에 추가 완료');
      }

      console.log('📤 [useSubmitContent] API 제출 시작 (multipart/form-data)');
      setUploadProgress('저장 중...');

      // 3. API 호출 (⭐ multipart/form-data 전송)
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
    isSubmitting, // ⭐ 제출 중 상태
    error, // ⭐ 에러 메시지
    validateContent,
    uploadProgress, // ⭐ 업로드 진행 상태
  };
}
