/**
 * MapView Component Types
 * Version: 1.0.0
 * Created: 2025-12-17
 */

import type { EggSlotDataResponse } from '../egg-slot/hooks/useEggSlotData';

export interface MapViewProps {
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
  onMapClick?: (coord: { lat: number; lng: number }) => void;
  onMarkerClick?: (id: string) => void;
  onCapsuleClick?: (capsule: CapsuleItem) => void;
  onEggSlotPress?: (slotData: EggSlotDataResponse | null) => void;
}

/**
 * Capsule Type
 */
export type CapsuleType = 'EASTER_EGG' | 'TIME_CAPSULE';

/**
 * Capsule API Response Types
 */
export interface CapsuleItem {
  id: string;
  title: string;
  content?: string;
  open_at: string;
  is_locked: boolean;
  view_limit: number;
  view_count: number;
  can_open: boolean;
  latitude: number;
  longitude: number;
  distance_m?: number;
  media_types: string[];
  media_urls: string[];
  product?: {
    id: string;
    name: string;
    price: number;
  };
  is_mine?: boolean;
  type?: CapsuleType;
}

export interface CapsulesResponse {
  items: CapsuleItem[];
  page_info: null;
}

export interface CapsuleMarker {
  id: string;
  lat: number;
  lng: number;
  data: CapsuleItem; // 마커에 포함될 전체 데이터
}
