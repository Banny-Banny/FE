/**
 * commons/constants/media.ts
 * 미디어 업로드 관련 상수 정의
 */

// 화이트리스트 정의
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['jpeg', 'png', 'webp'],
  VIDEO: ['mp4'],
  MUSIC: ['mpeg', 'mp4', 'aac'],
} as const;

// 용량 제한 (바이트 단위)
export const SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 200 * 1024 * 1024, // 200MB
  MUSIC: 20 * 1024 * 1024, // 20MB
} as const;

// MIME Type 매핑
export const MIME_TYPE_MAP: Record<string, string> = {
  // IMAGE
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  // VIDEO
  mp4: 'video/mp4',
  // MUSIC
  mpeg: 'audio/mpeg',
  aac: 'audio/aac',
};
