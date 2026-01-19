/**
 * components/customer-service/hooks/useMockFileUpload.ts
 * 파일 업로드 Hook (Mock 데이터 사용)
 */

import { useState, useCallback } from 'react';
import { FilePickerResult } from '@/components/customer-service/components/file-picker/types';
import { MessageAttachment } from '@/components/customer-service/types';
import { SIZE_LIMITS, ALLOWED_EXTENSIONS } from '@/commons/constants';

/**
 * 업로드 진행 상태
 */
export type UploadProgress = {
  progress: number; // 0-100
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
};

/**
 * 파일 업로드 Hook 반환 타입
 */
export interface UseMockFileUploadReturn {
  uploadFile: (file: FilePickerResult) => Promise<MessageAttachment | null>;
  uploadProgress: UploadProgress;
  resetProgress: () => void;
}

/**
 * 파일 크기 검증
 */
function validateFileSize(file: FilePickerResult, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * 파일 형식 검증
 */
function validateFileType(file: FilePickerResult): boolean {
  if (file.type === 'IMAGE') {
    // 이미지 파일 형식 검증
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    return ALLOWED_EXTENSIONS.IMAGE.includes(extension as any);
  } else {
    // 일반 파일은 모든 형식 허용 (필요시 제한 가능)
    return true;
  }
}

/**
 * Mock 파일 업로드 시뮬레이션
 */
async function simulateUpload(
  file: FilePickerResult,
  onProgress: (progress: number) => void
): Promise<string> {
  // Mock 업로드 시뮬레이션 (1-3초 소요)
  const duration = 1000 + Math.random() * 2000;
  const steps = 20;
  const stepDuration = duration / steps;

  return new Promise((resolve) => {
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      onProgress(progress);

      if (currentStep >= steps) {
        clearInterval(interval);
        // Mock URL 생성 (실제로 작동하는 이미지/파일 URL 사용)
        // 이미지의 경우 picsum.photos 사용, 파일의 경우 더미 URL 사용
        const mockUrl =
          file.type === 'IMAGE'
            ? `https://picsum.photos/400/300?random=${Date.now()}`
            : `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
        resolve(mockUrl);
      }
    }, stepDuration);
  });
}

/**
 * 파일 업로드 Hook (Mock)
 * 
 * @description
 * - 파일 크기 및 형식 검증
 * - 업로드 진행 상태 관리 (Mock)
 * - 업로드 완료 후 MessageAttachment 반환
 */
export function useMockFileUpload(): UseMockFileUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
  });

  const uploadFile = useCallback(
    async (file: FilePickerResult): Promise<MessageAttachment | null> => {
      try {
        // 파일 크기 검증
        const maxSize = file.type === 'IMAGE' ? SIZE_LIMITS.IMAGE : 10 * 1024 * 1024; // 10MB
        if (!validateFileSize(file, maxSize)) {
          const maxSizeMB = Math.round(maxSize / (1024 * 1024));
          setUploadProgress({
            progress: 0,
            status: 'error',
            error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`,
          });
          return null;
        }

        // 파일 형식 검증
        if (!validateFileType(file)) {
          setUploadProgress({
            progress: 0,
            status: 'error',
            error: '지원하지 않는 파일 형식입니다.',
          });
          return null;
        }

        // 업로드 시작
        setUploadProgress({
          progress: 0,
          status: 'uploading',
        });

        // Mock 업로드 시뮬레이션
        const url = await simulateUpload(file, (progress) => {
          setUploadProgress({
            progress,
            status: 'uploading',
          });
        });

        // 업로드 완료
        const attachment: MessageAttachment = {
          id: `attachment_${Date.now()}`,
          type: file.type,
          name: file.name,
          url,
          size: file.size,
          mimeType: file.mimeType,
        };

        setUploadProgress({
          progress: 100,
          status: 'success',
        });

        return attachment;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '파일 업로드에 실패했습니다.';
        setUploadProgress({
          progress: 0,
          status: 'error',
          error: errorMessage,
        });
        return null;
      }
    },
    []
  );

  const resetProgress = useCallback(() => {
    setUploadProgress({
      progress: 0,
      status: 'idle',
    });
  }, []);

  return {
    uploadFile,
    uploadProgress,
    resetProgress,
  };
}
