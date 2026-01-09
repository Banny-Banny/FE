/**
 * components/my-egg-list/types.ts
 * 이스터에그 목록 Feature 타입 정의
 *
 * @description
 * - Feature-wide 타입 정의
 * - 컴포넌트 간 공유되는 타입
 * - 백엔드 API 응답 타입 포함
 */

// ============================================
// 백엔드 API 응답 타입
// ============================================

/**
 * 심은 알 - 활성/만료 알 아이템
 */
export interface PlantedEggItem {
  eggId: string; // UUID 문자열
  title: string;
  content: string | null;
  viewCount: number;
  location: string | { lat: number; lng: number } | null;
  latitude?: number;
  longitude?: number;
  createdDate: string;
  hasImage: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  status: 'ACTIVE' | 'EXPIRED';
}

/**
 * 심은 알 API 응답
 */
export interface PlantedEggsResponse {
  summary: {
    totalPlantedCount: number;
    activeCount: number;
  };
  data: {
    activeEggs: PlantedEggItem[];
    expiredEggs: PlantedEggItem[];
  };
}

/**
 * 발견한 알 아이템
 */
export interface FoundEggItem {
  eggId: string; // UUID 문자열
  title: string;
  content: string | null;
  viewCount: number;
  location: string | { lat: number; lng: number } | null;
  latitude?: number;
  longitude?: number;
  foundDate: string; // ISO 8601 형식 (정렬 기준)
  createdDate: string; // ISO 8601 형식 (원래는 plantedDate였지만 실제 API는 createdDate)
  hasImage: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
}

/**
 * 발견한 알 API 응답
 */
export interface FoundEggsResponse {
  summary: {
    totalFoundCount: number;
  };
  data: FoundEggItem[];
}

// ============================================
// 내부 사용 타입 (UI 컴포넌트용)
// ============================================

/**
 * UI에서 사용하는 이스터에그 아이템 타입
 */
export interface EasterEggItem {
  id: string;
  title: string;
  description: string;
  location?: string; // latitude/longitude 기반으로 계산되며, 없을 수 있음
  date: string;
  eggIcon?: string | number;
  hasImage?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  viewCount?: number; // 조회수 (심은 알에서 사용)
  status?: 'ACTIVE' | 'EXPIRED'; // 활성/소멸 상태 (심은 알에서 사용)
}

export type TabType = 'discovered' | 'planted';
export type FilterOption = 'latest' | 'oldest';
