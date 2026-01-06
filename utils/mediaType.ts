/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수 및 타입 정의
 */

import { ALLOWED_EXTENSIONS, MediaType, MIME_TYPE_MAP } from '@/commons/constants/media';

/**
 * 파일 확장자 추출
 * @param filename 파일명
 * @returns 확장자 (소문자)
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

/**
 * 파일 확장자 검증
 * @param filename 파일명
 * @param type 미디어 타입
 * @returns 허용된 확장자인지 여부
 */
export const validateFileExtension = (filename: string, type: MediaType): boolean => {
  const extension = getFileExtension(filename);
  const allowedExtensions = ALLOWED_EXTENSIONS[type] as readonly string[];
  return allowedExtensions.includes(extension);
};

/**
 * 파일 타입에 따른 MIME 타입 배열 반환 (DocumentPicker용)
 * @param fileType 파일 타입 (IMAGE, VIDEO, AUDIO)
 * @returns MIME 타입 문자열 배열
 */
export const getMimeTypes = (fileType: MediaType): string[] => {
  const allowedExtensions = ALLOWED_EXTENSIONS[fileType] as readonly string[];
  return allowedExtensions.map((ext) => MIME_TYPE_MAP[ext]).filter(Boolean);
};
