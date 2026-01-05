/**
 * Egg Detail Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { CapsuleItem } from '../map-view/types';

export interface EggDetailProps {
  isVisible: boolean;
  onClose: () => void;
  capsule: CapsuleItem | null;
  currentLocation: { lat: number; lng: number } | null;
}

/**
 * Capsule Detail API Response Types
 */
export interface CapsuleDetailResponse {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  latitude: number;
  longitude: number;
  author: {
    nickname: string;
  };
  viewers: ViewerItem[];
  view_count: number;
  view_limit: number;
}

export interface ViewerItem {
  id: string;
  nickname: string;
  viewed_at: string;
}
