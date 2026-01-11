/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useSubmitContent.ts
 * 타임캡슐 콘텐츠 제출 Hook
 *
 * 체크리스트:
 * - [✓] validateContent 함수 구현
 * - [✓] React Native FormData 형식으로 파일 추가 ({ uri, type, name })
 * - [✓] 실제 API 연동 submitContent 함수 구현
 * - [✓] 로딩 상태 관리 (isSubmitting)
 * - [✓] 에러 상태 관리 (error)
 * - [✓] 업로드 진행 상태 관리 (uploadProgress)
 * - [✓] capsuleId 파라미터 추가
 * - [✓] text_message 필수 검증
 */

import { useState } from 'react';
import { Platform } from 'react-native';
import { submitMyContent } from '../api/content';
import type { UserContentFormData, UseSubmitContentReturn, ValidationResult } from '../types';

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
 * URI가 로컬 파일인지 확인 (HTTP/HTTPS URL이 아닌지)
 * @param uri 파일 URI
 * @returns 로컬 파일이면 true, HTTP URL이면 false
 */
function isLocalFile(uri: string): boolean {
  return !uri.startsWith('http://') && !uri.startsWith('https://');
}

/**
 * 웹 환경에서 URI를 Blob으로 변환
 * @param uri 파일 URI
 * @returns Blob 객체
 */
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  return await response.blob();
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

      setUploadProgress('파일 준비 중...');
      console.log('📤 [useSubmitContent] FormData 생성 시작');

      // 2. FormData 생성
      const formData = new FormData();

      // text_message 추가 (필수!)
      formData.append('text_message', data.textContent.trim());

      // invite_code 추가 (선택사항)
      if (data.inviteCode && data.inviteCode.trim().length > 0) {
        formData.append('invite_code', data.inviteCode.trim());
        console.log('📤 [useSubmitContent] 초대 코드 추가:', data.inviteCode.trim());
      }

      // 이미지 파일 추가
      if (data.photos.length > 0) {
        setUploadProgress(`이미지 ${data.photos.length}개 추가 중...`);
        console.log(`📤 [useSubmitContent] 이미지 ${data.photos.length}개 추가 중...`);
        for (let i = 0; i < data.photos.length; i++) {
          const photoUri = data.photos[i];

          // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
          if (!isLocalFile(photoUri)) {
            console.log(`  ⏭️  이미지 ${i + 1}: 이미 업로드된 파일이므로 건너뜀 - ${photoUri}`);
            continue;
          }

          const fileName = generateFileName(photoUri, 'photo', 'jpg');

          // ⭐ 플랫폼별 분기 처리
          if (Platform.OS === 'web') {
            // 웹: URI를 Blob으로 변환 후 추가
            const blob = await uriToBlob(photoUri);
            formData.append('images', blob, fileName);
            console.log(
              `✅ [useSubmitContent] [웹] 이미지 ${i + 1}/${
                data.photos.length
              } 추가 완료: ${fileName}`,
            );
          } else {
            // React Native: { uri, type, name } 형태로 추가
            formData.append('images', {
              uri: photoUri,
              type: 'image/jpeg',
              name: fileName,
            } as any);
            console.log(
              `✅ [useSubmitContent] [앱] 이미지 ${i + 1}/${
                data.photos.length
              } 추가 완료: ${fileName}`,
            );
          }
        }
      }

      // 음악 파일 추가
      if (data.music) {
        // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
        if (isLocalFile(data.music)) {
          setUploadProgress('음악 파일 추가 중...');
          console.log('📤 [useSubmitContent] 음악 파일 추가 중...');
          
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
            'm4a': 'audio/m4a',
            'mp3': 'audio/mpeg',
            'mpeg': 'audio/mpeg',
            'mp4': 'audio/mp4',
            'aac': 'audio/aac',
          };
          const mimeType = mimeTypeMap[extension] || 'audio/m4a';

          // ⭐ 플랫폼별 분기 처리
          if (Platform.OS === 'web') {
            // 웹: URI를 Blob으로 변환 후 추가
            const blob = await uriToBlob(data.music);
            formData.append('music', blob, fileName);
            console.log(`✅ [useSubmitContent] [웹] 음악 파일 추가 완료: ${fileName} (${mimeType})`);
          } else {
            // React Native: { uri, type, name } 형태로 추가
            formData.append('music', {
              uri: data.music,
              type: mimeType,
              name: fileName,
            } as any);
            console.log(`✅ [useSubmitContent] [앱] 음악 파일 추가 완료: ${fileName} (${mimeType})`);
          }
        } else {
          console.log('  ⏭️  음악: 이미 업로드된 파일이므로 건너뜀 - ', data.music);
        }
      }

      // 비디오 파일 추가
      if (data.video) {
        // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
        if (isLocalFile(data.video)) {
          setUploadProgress('비디오 파일 추가 중...');
          console.log('📤 [useSubmitContent] 비디오 파일 추가 중...');
          const fileName = generateFileName(data.video, 'video', 'mp4');

          // ⭐ 플랫폼별 분기 처리
          if (Platform.OS === 'web') {
            // 웹: URI를 Blob으로 변환 후 추가
            const blob = await uriToBlob(data.video);
            formData.append('video', blob, fileName);
            console.log(`✅ [useSubmitContent] [웹] 비디오 파일 추가 완료: ${fileName}`);
          } else {
            // React Native: { uri, type, name } 형태로 추가
            formData.append('video', {
              uri: data.video,
              type: 'video/mp4',
              name: fileName,
            } as any);
            console.log(`✅ [useSubmitContent] [앱] 비디오 파일 추가 완료: ${fileName}`);
          }
        } else {
          console.log('  ⏭️  비디오: 이미 업로드된 파일이므로 건너뜀 - ', data.video);
        }
      }

      setUploadProgress('저장 중...');
      console.log('📤 [useSubmitContent] API 제출 시작');

      // 3. API 호출
      const result = await submitMyContent(capsuleId, formData);

      setUploadProgress('');
      console.log('✅ [useSubmitContent] 제출 완료:', result);
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
