/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수
 */

import { MediaType } from '@/commons/constants/media';

import { MIME_TYPE_MAP } from '@/commons/constants/media';

/**
 * 파일 타입에 따른 MIME 타입 반환
 * @param fileType 파일 타입 (IMAGE, VIDEO, AUDIO)
 * @param extension 파일 확장자 (선택적, 세분화된 MIME 타입 반환을 위해 사용)
 * @returns MIME 타입 문자열
 */
export const getMimeType = (fileType: MediaType, extension: string = ''): string => {
  // 확장자가 제공된 경우 MIME_TYPE_MAP에서 조회
  if (extension) {
    const ext = extension.toLowerCase();
    const mimeType = MIME_TYPE_MAP[ext];
    if (mimeType) return mimeType;
  }

  // 확장자가 없거나 매핑되지 않은 경우 기본값 반환
  switch (fileType) {
    case 'IMAGE':
      return 'image/jpeg';
    case 'VIDEO':
      return 'video/mp4';
    case 'AUDIO':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
};
