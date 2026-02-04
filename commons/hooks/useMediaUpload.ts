/**
 * commons/hooks/useMediaUpload.ts
 * 미디어 업로드 Hook (상태 관리)
 */

import { MediaType } from '@/commons/constants/media';
import { uploadMedia } from '@/utils';
import { useCallback, useState } from 'react';

interface UseMediaUploadReturn {
  upload: (uri: string, type: MediaType, filename?: string) => Promise<string | null>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useMediaUpload = (): UseMediaUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (uri: string, type: MediaType, filename?: string): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        const mediaId = await uploadMedia(uri, type, filename);
        setIsUploading(false);
        return mediaId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '미디어 업로드에 실패했습니다.';
        setError(errorMessage);
        setIsUploading(false);
        return null;
      }
    },
    [],
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
