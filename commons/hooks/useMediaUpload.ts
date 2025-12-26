/**
 * commons/hooks/useMediaUpload.ts
 * 미디어 업로드 Hook (상태 관리 포함)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] React hook으로 구현 (useState 사용)
 * - [x] 업로드 상태 관리 (isUploading, error)
 * - [x] utils/mediaUpload.ts의 순수 함수 활용
 * - [x] project-structure.mdc 준수: commons/hooks/에 hook으로 구현
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { uploadMedia } from '@/utils';
import { useCallback, useState } from 'react';

interface UseMediaUploadReturn {
  /**
   * 미디어 업로드 실행
   * @param uri 파일 URI
   * @param type 미디어 타입 (IMAGE, VIDEO, MUSIC)
   * @param filename 파일명 (선택적)
   * @returns 업로드된 미디어 ID
   */
  upload: (
    uri: string,
    type: 'IMAGE' | 'VIDEO' | 'MUSIC',
    filename?: string,
  ) => Promise<string | null>;
  /**
   * 업로드 진행 중 여부
   */
  isUploading: boolean;
  /**
   * 업로드 에러 메시지
   */
  error: string | null;
  /**
   * 에러 초기화
   */
  clearError: () => void;
}

/**
 * 미디어 업로드 Hook
 * @returns 업로드 함수 및 상태
 */
export const useMediaUpload = (): UseMediaUploadReturn => {
  const { accessToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      uri: string,
      type: 'IMAGE' | 'VIDEO' | 'MUSIC',
      filename?: string,
    ): Promise<string | null> => {
      if (!accessToken) {
        const errorMsg = '로그인이 필요합니다.';
        console.error('❌ 업로드 실패: 토큰 없음');
        setError(errorMsg);
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        console.log(
          `📤 useMediaUpload: 업로드 시작 (${type})${filename ? `, 파일명: ${filename}` : ''}`,
        );
        const mediaId = await uploadMedia(uri, type, accessToken, filename);
        console.log(`✅ useMediaUpload: 업로드 성공, mediaId: ${mediaId}`);
        setIsUploading(false);
        return mediaId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '미디어 업로드에 실패했습니다.';
        console.error('❌ useMediaUpload: 업로드 실패', err);
        console.error('❌ 에러 메시지:', errorMessage);
        setError(errorMessage);
        setIsUploading(false);
        return null;
      }
    },
    [accessToken],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    error,
    clearError,
  };
};
