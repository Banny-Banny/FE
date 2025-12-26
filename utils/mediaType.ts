/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수
 */

/**
 * 파일 타입에 따른 MIME 타입 반환
 * @param fileType 파일 타입 (IMAGE, VIDEO, MUSIC)
 * @returns MIME 타입 문자열
 */
export const getMimeType = (fileType: 'IMAGE' | 'VIDEO' | 'MUSIC'): string => {
  switch (fileType) {
    case 'IMAGE':
      return 'image/jpeg';
    case 'MUSIC':
      return 'audio/mpeg';
    case 'VIDEO':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
};
