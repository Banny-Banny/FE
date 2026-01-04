/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수 및 타입 정의
 */

/**
 * 미디어 타입 정의
 */
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

/**
 * 파일 타입에 따른 MIME 타입 반환
 * @param fileType 파일 타입 (IMAGE, VIDEO, AUDIO)
 * @returns MIME 타입 문자열
 */
export const getMimeType = (fileType: MediaType): string => {
  switch (fileType) {
    case 'IMAGE':
      return 'image/jpeg';
    case 'AUDIO':
      return 'audio/mpeg';
    case 'VIDEO':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
};
