/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수
 */

import { MediaType } from '@/commons/constants/media';

/**
 * 파일 타입에 따른 MIME 타입 반환
 * @param fileType 파일 타입 (IMAGE, VIDEO, AUDIO)
 * @param extension 파일 확장자 (선택적, AUDIO의 경우 세분화된 MIME 타입 반환을 위해 사용)
 * @returns MIME 타입 문자열
 */
export const getMimeType = (fileType: MediaType, extension: string = ''): string => {
  switch (fileType) {
    case 'IMAGE':
      return 'image/jpeg';
    case 'VIDEO':
      return 'video/mp4';
    case 'AUDIO':
      // 확장자에 따라 세분화된 MIME 타입 반환 (백엔드 화이트리스트: mpeg, aac)
      const ext = extension.toLowerCase();
      if (ext === 'aac') return 'audio/aac';
      if (ext === 'mpeg') return 'audio/mpeg';
      return 'audio/mpeg'; // 기본값 (mpeg)
    default:
      return 'application/octet-stream';
  }
};
