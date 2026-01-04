/**
 * EggDetailFind Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { MediaItem } from '../shared/types';

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
  /** 이스터에그 발견 데이터 (선택적, 없으면 Mock 데이터 사용) */
  data?: EggDiscoveryData;
}
