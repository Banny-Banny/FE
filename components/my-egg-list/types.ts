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
  eggId: number;
  title: string;
  content: string;
  viewCount: number;
  location: string | { lat: number; lng: number };
  createdDate: string;
  hasImage: boolean;
  hasAudio: boolean;
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
  eggId: number;
  title: string;
  content: string;
  viewCount: number;
  location: string | { lat: number; lng: number };
  foundDate: string; // ISO 8601 형식 (정렬 기준)
  plantedDate: string; // ISO 8601 형식
  hasImage: boolean;
  hasAudio: boolean;
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
  location: string;
  date: string;
  eggIcon?: string | number;
  hasImage?: boolean;
  hasAudio?: boolean;
  viewCount?: number; // 조회수 (심은 알에서 사용)
  status?: 'ACTIVE' | 'EXPIRED'; // 활성/소멸 상태 (심은 알에서 사용)
}

export type TabType = 'discovered' | 'planted';
export type FilterOption = 'latest' | 'oldest';
