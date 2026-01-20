/**
 * components/customer-service/components/file-picker/types.ts
 * 파일 선택 컴포넌트 Props 타입 정의
 */

import { MessageAttachment } from '@/components/customer-service/types';

/**
 * 파일 선택 결과 타입
 */
export interface FilePickerResult {
  uri: string;
  name: string;
  size: number;
  type: 'IMAGE' | 'FILE';
  mimeType?: string;
}

/**
 * 이미지 피커 Props
 */
export interface ImagePickerProps {
  onSelect: (result: FilePickerResult) => void;
  onError?: (error: string) => void;
  maxSize?: number; // 바이트 단위, 기본값: 5MB
  allowsEditing?: boolean;
  quality?: number; // 0-1 사이 값
}

/**
 * 문서 피커 Props
 */
export interface DocumentPickerProps {
  onSelect: (result: FilePickerResult) => void;
  onError?: (error: string) => void;
  maxSize?: number; // 바이트 단위, 기본값: 10MB
  allowedTypes?: string[]; // MIME 타입 배열
}

/**
 * 파일 피커 컨테이너 Props
 */
export interface FilePickerProps {
  onSelectFile: (result: FilePickerResult) => void;
  onError?: (error: string) => void;
  maxImageSize?: number; // 바이트 단위
  maxFileSize?: number; // 바이트 단위
}
