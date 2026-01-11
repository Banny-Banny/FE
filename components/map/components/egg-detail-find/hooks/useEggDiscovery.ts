/**
 * Egg Discovery Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 진입 감지 및 자동 발견 로직
 * - 리스트 데이터 실시간 감시
 * - 30m 이내 진입 감지
 * - 중복 호출 방지
 * - 다중 발견 시 우선순위 처리
 */

import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { calculateDistance } from '@/utils/coordinate';

import type { CapsuleItem } from '../../map-view/types';

export interface UseEggDiscoveryParams {
  /** 캡슐 리스트 (GET /api/capsules 응답의 items) */
  capsules: CapsuleItem[];
  /** 현재 위치 */
  currentLocation: { lat: number; lng: number } | null;
  /** 모달이 열려있는지 여부 */
  isModalVisible: boolean;
  /** API 요청이 진행 중인지 여부 */
  isApiLoading: boolean;
}

export interface UseEggDiscoveryReturn {
  /** 발견된 캡슐 ID (null이면 발견되지 않음) */
  discoveredCapsuleId: string | null;
  /** 발견된 캡슐 데이터 */
  discoveredCapsule: CapsuleItem | null;
}

/**
 * 이스터에그 진입 감지 및 자동 발견 로직을 처리하는 Hook
 *
 * 조건:
 * - item.type === 'EASTER_EGG'
 * - item.is_mine === false
 * - item.distance_m <= 30
 *
 * 우선순위:
 * - distance_m 기준 오름차순 정렬
 * - 가장 가까운 캡슐 하나만 처리
 */
export function useEggDiscovery({
  capsules,
  currentLocation,
  isModalVisible,
  isApiLoading,
}: UseEggDiscoveryParams): UseEggDiscoveryReturn {
  // 이미 발견한 캡슐 ID들을 추적 (세션 동안 유지)
  const discoveredIdsRef = useRef<Set<string>>(new Set());
  // 현재 활성화된 캡슐 ID
  const [activeCapsuleId, setActiveCapsuleId] = useState<string | null>(null);
  // 발견된 캡슐 데이터
  const [discoveredCapsule, setDiscoveredCapsule] = useState<CapsuleItem | null>(null);

  useEffect(() => {
    // Early Return 조건들
    if (!currentLocation) return;
    if (isModalVisible) return; // 모달이 열려있으면 새로운 발견 로직 실행 안 함
    if (isApiLoading) return; // API 요청 중이면 새로운 발견 로직 실행 안 함
    if (capsules.length === 0) return; // 캡슐 리스트가 비어있으면 종료

    // 조건에 맞는 이스터에그 필터링 및 거리 계산
    const eligibleEggsWithDistance = capsules
      .map((item) => {
        // 기본 조건 체크
        if (item.type !== 'EASTER_EGG') return null;
        if (item.is_mine === true) return null;

        // 실제 사용자 위치와 이스터에그 위치 간 거리 계산
        const actualDistance = calculateDistance(
          { lat: currentLocation.lat, lng: currentLocation.lng },
          { lat: item.latitude, lng: item.longitude },
        );

        // 30m 이내가 아니면 제외
        if (actualDistance > 30) return null;

        // 이미 발견한 캡슐은 제외 (세션 동안)
        if (discoveredIdsRef.current.has(item.id)) return null;

        return {
          item,
          actualDistance,
        };
      })
      .filter((result): result is { item: CapsuleItem; actualDistance: number } => result !== null);

    // 조건에 맞는 캡슐이 없으면 종료
    if (eligibleEggsWithDistance.length === 0) return;

    // 실제 거리 기준 오름차순 정렬 (가장 가까운 것부터)
    const sortedEggs = [...eligibleEggsWithDistance].sort((a, b) => {
      return a.actualDistance - b.actualDistance;
    });

    // 가장 가까운 캡슐 하나만 선택
    const nearestEgg = sortedEggs[0].item;
    const nearestDistance = sortedEggs[0].actualDistance;

    // 이미 활성화된 캡슐이면 무시
    if (activeCapsuleId === nearestEgg.id) return;

    // 진동 피드백 (웹에서는 사용자 상호작용 없이 호출 불가하므로 네이티브에서만 실행)
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // 햅틱 피드백 실패 시 무시 (일부 기기에서 지원하지 않을 수 있음)
      }
    }

    // 발견된 캡슐 설정
    setActiveCapsuleId(nearestEgg.id);
    setDiscoveredCapsule(nearestEgg);
    discoveredIdsRef.current.add(nearestEgg.id);
  }, [capsules, currentLocation, isModalVisible, isApiLoading, activeCapsuleId]);

  // 모달이 닫히면 activeCapsuleId 초기화 (다음 발견을 위해)
  useEffect(() => {
    if (!isModalVisible) {
      setActiveCapsuleId(null);
      setDiscoveredCapsule(null);
    }
  }, [isModalVisible]);

  return {
    discoveredCapsuleId: activeCapsuleId,
    discoveredCapsule,
  };
}
