/**
 * components/my-egg-list/utils/transformers.ts
 * 백엔드 API 응답을 UI 타입으로 변환하는 유틸리티 함수
 *
 * @description
 * - PlantedEggItem, FoundEggItem을 EasterEggItem으로 변환
 * - 날짜 포맷팅, 위치 문자열 변환 등 처리
 */

import type { EasterEggItem, FoundEggItem, PlantedEggItem } from '../types';

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
}

/**
 * 위치를 문자열로 변환
 */
function formatLocation(location: string | { lat: number; lng: number }): string {
  if (typeof location === 'string') {
    return location;
  }
  // 좌표인 경우 주소로 변환 필요 (현재는 좌표 그대로 반환)
  return `${location.lat}, ${location.lng}`;
}

/**
 * PlantedEggItem을 EasterEggItem으로 변환
 */
export function transformPlantedEggToItem(item: PlantedEggItem, index: number): EasterEggItem {
  return {
    id: `planted-${item.eggId}`,
    title: item.title,
    description: item.content,
    location: formatLocation(item.location),
    date: formatDate(item.createdDate),
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
    viewCount: item.viewCount,
  };
}

/**
 * FoundEggItem을 EasterEggItem으로 변환
 */
export function transformFoundEggToItem(item: FoundEggItem, index: number): EasterEggItem {
  return {
    id: `found-${item.eggId}`,
    title: item.title,
    description: item.content,
    location: formatLocation(item.location),
    date: formatDate(item.foundDate), // 발견 날짜 사용
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
  };
}

/**
 * PlantedEggsResponse를 EasterEggItem 배열로 변환
 * (activeEggs와 expiredEggs를 합쳐서 반환)
 */
export function transformPlantedEggsResponse(response: {
  summary: { totalPlantedCount: number; activeCount: number };
  data: { activeEggs: PlantedEggItem[]; expiredEggs: PlantedEggItem[] };
}): EasterEggItem[] {
  const allItems = [...response.data.activeEggs, ...response.data.expiredEggs];
  return allItems.map((item, index) => transformPlantedEggToItem(item, index));
}

/**
 * FoundEggsResponse를 EasterEggItem 배열로 변환
 */
export function transformFoundEggsResponse(response: {
  summary: { totalFoundCount: number };
  data: FoundEggItem[];
}): EasterEggItem[] {
  return response.data.map((item, index) => transformFoundEggToItem(item, index));
}
