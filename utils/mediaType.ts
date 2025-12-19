/**
 * utils/mediaType.ts
 * 미디어 타입 변환 유틸리티 함수
 */

/**
 * 첨부파일 타입을 API 미디어 타입으로 변환
 * @param type 첨부파일 타입 (photo, music, video)
 * @returns API 미디어 타입 (IMAGE, MUSIC, VIDEO)
 */
export const convertToMediaType = (
  type: 'photo' | 'music' | 'video',
): 'IMAGE' | 'VIDEO' | 'MUSIC' => {
  switch (type) {
    case 'photo':
      return 'IMAGE';
    case 'music':
      return 'MUSIC';
    case 'video':
      return 'VIDEO';
  }
};

/**
 * 파일 타입에 따른 MIME 타입 반환
 * @param fileType 파일 타입 (photo, music, video)
 * @returns MIME 타입 문자열
 */
export const getMimeType = (fileType: 'photo' | 'music' | 'video'): string => {
  switch (fileType) {
    case 'photo':
      return 'image/jpeg';
    case 'music':
      return 'audio/mpeg';
    case 'video':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
};
