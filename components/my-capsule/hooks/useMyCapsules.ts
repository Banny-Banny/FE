/**
 * components/my-capsule/hooks/useMyCapsules.ts
 * 참여중인 타임캡슐 리스트 조회 및 분류 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyCapsules } from '../api/capsule';
import type { CategorizedCapsules, MyCapsuleItem } from '../types';

/**
 * 참여중인 타임캡슐 리스트 조회 및 3가지 상태 분류 Hook
 *
 * 분류 기준:
 * - waitingRooms: status === "WAITING"
 * - openedCapsules: status === "COMPLETED" || status === "EXPIRED"
 * - lockedCapsules: status === "BURIED"
 *
 * @returns {object} capsules, isLoading, error, refetch
 */
export function useMyCapsules() {
  // @tanstack/react-query를 사용한 API 호출
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['myCapsules'],
    queryFn: () => getMyCapsules(),
    retry: 1,
  });

  // status와 openDate로 3가지 상태 분류
  const capsules: CategorizedCapsules = useMemo(() => {
    if (!data || !data.items) {
      // 에러 발생 시 빈 배열 반환 (UI 깨짐 방지)
      return {
        waitingRooms: [],
        openedCapsules: [],
        lockedCapsules: [],
      };
    }

    // status 값으로 3가지 상태 분류
    const waitingRooms: MyCapsuleItem[] = [];
    const openedCapsules: MyCapsuleItem[] = [];
    const lockedCapsules: MyCapsuleItem[] = [];

    data.items.forEach((capsule) => {
      // 디버깅: 각 캡슐 정보 출력
      // 🎯 이스터에그 필터링: openDate와 deadline이 둘 다 null인 경우 제외
      if (capsule.openDate === null && capsule.deadline === null) {
        return; // 이 캡슐은 건너뛰기
      }

      if (capsule.status === 'WAITING') {
        // 대기실 - 작성 대기 중인 캡슐
        waitingRooms.push(capsule);
      } else if (capsule.status === 'COMPLETED' || capsule.status === 'EXPIRED') {
        // 열린 캡슐 - COMPLETED(정상 개봉) 또는 EXPIRED(기한 만료)
        openedCapsules.push(capsule);
      } else if (capsule.status === 'BURIED') {
        // 잠긴 캡슐 - 아직 개봉되지 않은 캡슐
        lockedCapsules.push(capsule);
      }
    });

    return { waitingRooms, openedCapsules, lockedCapsules };
  }, [data]);

  return {
    capsules,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
