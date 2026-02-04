/**
 * commons/constants/media.ts
 * 미디어 업로드 관련 상수 정의
 */

// 미디어 타입 정의
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

// 화이트리스트 정의 (백엔드 허용 형식에 맞춤)
// 백엔드 허용 MIME 타입:
// - IMAGE: image/jpeg, image/jpg, image/png, image/webp (최대 5MB)
// - VIDEO: video/mp4, video/webm (최대 200MB)
// - AUDIO: audio/mpeg, audio/mp3, audio/mp4, audio/x-m4a, audio/aac, audio/m4a, audio/x-aac (최대 20MB)
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['jpeg', 'jpg', 'png', 'webp'],
  VIDEO: ['mp4', 'webm'],
  AUDIO: ['mpeg', 'mp3', 'mp4', 'x-m4a', 'aac', 'm4a', 'x-aac'],
} as const;

// 용량 제한 (바이트 단위)
export const SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 200 * 1024 * 1024, // 200MB
  AUDIO: 20 * 1024 * 1024, // 20MB
} as const;

// MIME Type 매핑 (백엔드 허용 형식에 맞춤)
export const MIME_TYPE_MAP: Record<string, string> = {
  // IMAGE
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  // VIDEO
  mp4: 'video/mp4',
  webm: 'video/webm',
  // AUDIO
  mpeg: 'audio/mpeg',
  mp3: 'audio/mpeg',
  'mp4': 'audio/mp4',
  'x-m4a': 'audio/x-m4a',
  aac: 'audio/aac',
  m4a: 'audio/m4a',
  'x-aac': 'audio/x-aac',
};

// MIME Type에서 확장자 역매핑 (검증용)
export const MIME_TO_EXTENSION: Record<string, string[]> = {
  // IMAGE
  'image/jpeg': ['jpeg', 'jpg'],
  'image/jpg': ['jpeg', 'jpg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  // VIDEO
  'video/mp4': ['mp4'],
  'video/webm': ['webm'],
  // AUDIO
  'audio/mpeg': ['mpeg', 'mp3'],
  'audio/mp3': ['mp3'],
  'audio/mp4': ['mp4'],
  'audio/x-m4a': ['m4a', 'x-m4a'],
  'audio/aac': ['aac'],
  'audio/m4a': ['m4a'],
  'audio/x-aac': ['aac', 'x-aac'],
};
