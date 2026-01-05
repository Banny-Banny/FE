/**
 * Shared Components Types
 * map feature 내부에서 공유되는 타입 정의
 */

import type { MediaType } from '@/utils/mediaType';

export interface MediaItem {
  /** 미디어 ID */
  id: string;
  /** 미디어 타입 */
  type: MediaType;
  /** 미디어 URL */
  url: string;
  /** 썸네일 URL (비디오용) */
  thumbnailUrl?: string;
}

