/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수
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
 * DocumentPicker용 MIME 타입 배열 생성 (ALLOWED_EXTENSIONS 기반)
 * @param type 파일 타입 (IMAGE, AUDIO, VIDEO)
 * @returns MIME 타입 배열 (와일드카드 포함)
 */
export const getMimeTypes = (type: MediaType): string[] => {
  const allowedExtensions = ALLOWED_EXTENSIONS[type];
  const mimeTypes: string[] = [];

  // ALLOWED_EXTENSIONS의 각 확장자에 대해 MIME 타입 조회
  allowedExtensions.forEach((ext) => {
    const mimeType = MIME_TYPE_MAP[ext];
    if (mimeType && !mimeTypes.includes(mimeType)) {
      mimeTypes.push(mimeType);
    }
  });

  // 와일드카드 추가 (DocumentPicker가 모든 해당 타입의 파일을 선택할 수 있도록)
  switch (type) {
    case 'IMAGE':
      mimeTypes.push('image/*');
      break;
    case 'AUDIO':
      mimeTypes.push('audio/*');
      break;
    case 'VIDEO':
      mimeTypes.push('video/*');
      break;
  }

  return mimeTypes;
};
