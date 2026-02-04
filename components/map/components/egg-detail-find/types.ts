/**
 * EggDetailFind Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { MediaType } from '@/utils/mediaType';

export interface MediaItem {
  /** 미디어 고유 식별자 (렌더링용) */
  id: string;
  /** 미디어 타입 */
  type: MediaType;
  /**
   * 미디어 URL 또는 ID
   * - IMAGE/VIDEO: 변환된 URL
   * - AUDIO: 미디어 ID (AudioPlayer에서 URL로 변환)
   */
  url: string;
  /** 썸네일 URL (비디오용) */
  thumbnailUrl?: string;
}

export type DiscoveryOrder = 'first' | 'second' | 'last';

export interface EggDiscoveryData {
  /** 이스터에그 ID */
  eggId: string;
  /** 발견 순서 */
  discoveryOrder: DiscoveryOrder;
  /** 작성자 정보 */
  author: {
    /** 작성자 이름 */
    name: string;
    /** 작성자 이모지 */
    emoji: string;
  };
  /** 작성 날짜 (MM.DD 형식) */
  createdAt: string;
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 미디어 목록 */
  media: MediaItem[];
  /** 열람 횟수 (현재/최대) */
  viewCount: {
    current: number;
    max: number;
  };
  /** 소멸 예정 여부 (마지막 발견자일 때만 true) */
  isExpiring?: boolean;
}

export interface EggDetailFindProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 발견 데이터 (선택적, 없으면 API 데이터 사용) */
  data?: EggDiscoveryData;
  /** 캡슐 ID (API 호출용) */
  capsuleId?: string | null;
  /** 현재 위치 (API 호출용) */
  currentLocation?: { lat: number; lng: number } | null;
}
