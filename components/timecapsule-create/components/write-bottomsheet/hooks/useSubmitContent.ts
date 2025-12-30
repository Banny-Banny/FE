/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useSubmitContent.ts
 * 타임캡슐 콘텐츠 제출 Hook
 *
 * 체크리스트:
 * - [✓] validateContent 함수 구현
 * - [✓] uriToFile 헬퍼 함수 구현
 * - [✓] createFormData 함수 구현
 * - [✓] Mock submitContent 함수 구현
 * - [✓] 로딩 상태 관리 (isSubmitting)
 * - [✓] 에러 상태 관리 (error)
 */

import { Alert } from 'react-native';
import { useState } from 'react';
import type {
  UserContentFormData,
  ValidationResult,
  UseSubmitContentReturn,
} from '../types';

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
export function useSubmitContent(participantId: string): UseSubmitContentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 콘텐츠 검증 함수
   * 최소 하나의 콘텐츠가 입력되었는지 확인하고 각종 제한사항 검증
   */
  const validateContent = (data: UserContentFormData): ValidationResult => {
    // 빈 콘텐츠 검증
    const hasTextContent = data.textContent.trim().length > 0;
    const hasPhotos = data.photos.length > 0;
    const hasMusic = !!data.music;
    const hasVideo = !!data.video;

    if (!hasTextContent && !hasPhotos && !hasMusic && !hasVideo) {
      return {
        isValid: false,
        message: '콘텐츠를 하나 이상 입력해주세요',
      };
    }

    // 텍스트 길이 검증 (최대 500자)
    if (data.textContent.length > 500) {
      return {
        isValid: false,
        message: '텍스트는 최대 500자까지 입력 가능합니다',
      };
    }

    // 사진 개수 검증 (최대 5개)
    if (data.photos.length > 5) {
      return {
        isValid: false,
        message: '사진은 최대 5개까지 추가할 수 있습니다',
      };
    }

    return {
      isValid: true,
    };
  };

  /**
   * FormData 생성 함수
   * URI를 File 객체로 변환하여 FormData에 추가
   */
  const createFormData = async (data: UserContentFormData): Promise<FormData> => {
    const formData = new FormData();

    // 참여자 ID 추가
    formData.append('participantId', participantId);

    // 텍스트 내용 추가
    formData.append('textContent', data.textContent);

    // 사진 파일 추가
    if (data.photos.length > 0) {
      for (let i = 0; i < data.photos.length; i++) {
        const photoUri = data.photos[i];
        const fileName = generateFileName(photoUri, 'photo', 'jpg');
        const photoFile = await uriToFile(photoUri, fileName, 'image/jpeg');
        formData.append('photos[]', photoFile);
      }
    }

    // 동영상 파일 추가
    if (data.video) {
      const fileName = generateFileName(data.video, 'video', 'mp4');
      const videoFile = await uriToFile(data.video, fileName, 'video/mp4');
      formData.append('video', videoFile);
    }

    // 음악 파일 추가
    if (data.music) {
      const fileName = generateFileName(data.music, 'music', 'mp3');
      const musicFile = await uriToFile(data.music, fileName, 'audio/mpeg');
      formData.append('music', musicFile);
    }

    return formData;
  };

  /**
   * 콘텐츠 제출 함수 (Mock)
   * TODO: 실제 API 연동 시 이 함수를 수정하여 백엔드 API 호출
   */
  const submitContent = async (data: UserContentFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 1. 검증 실행
      const validation = validateContent(data);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      // 2. FormData 생성
      console.log('=== FormData 생성 중 ===');
      const formData = await createFormData(data);

      // 3. Mock API 호출 시뮬레이션 (네트워크 지연 1-2초)
      console.log('=== Mock API 제출 시작 ===');
      console.log('참여자 ID:', participantId);
      console.log('텍스트 내용:', data.textContent || '(없음)');
      console.log('사진 개수:', data.photos.length);

      // 사진 파일 정보 출력
      if (data.photos.length > 0) {
        for (let i = 0; i < data.photos.length; i++) {
          console.log(`  - 사진 ${i + 1}:`, {
            uri: data.photos[i],
            name: generateFileName(data.photos[i], 'photo', 'jpg'),
          });
        }
      }

      // 동영상 파일 정보 출력
      if (data.video) {
        console.log('동영상:', {
          uri: data.video,
          name: generateFileName(data.video, 'video', 'mp4'),
        });
      }

      // 음악 파일 정보 출력
      if (data.music) {
        console.log('음악:', {
          uri: data.music,
          name: generateFileName(data.music, 'music', 'mp3'),
        });
      }

      console.log('=== FormData 구조 확인 ===');
      // FormData는 직접 로그할 수 없으므로 entries로 순회
      for (const pair of formData.entries()) {
        const [key, value] = pair;
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      // 네트워크 지연 시뮬레이션 (1.5초)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: 실제 API 엔드포인트 호출
      // const response = await fetch('/api/timecapsule/content', {
      //   method: 'POST',
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error('제출에 실패했습니다');
      // }

      console.log('=== Mock API 제출 완료 ===');

      // 4. 제출 성공
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      console.error('제출 실패:', errorMessage);
      setError(errorMessage);

      // 에러 알림 표시
      Alert.alert('저장 실패', errorMessage);

      // 에러를 다시 throw하여 호출자가 처리할 수 있도록 함
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
