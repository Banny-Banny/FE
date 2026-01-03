/**
 * utils/mediaType.ts
 * 미디어 타입 관련 유틸리티 함수
 */

import { ALLOWED_EXTENSIONS, MediaType, MIME_TYPE_MAP } from '@/commons/constants/media';

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
