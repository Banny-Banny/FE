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
 * - openedCapsules: status !== "WAITING" && openDate < 현재시각
 * - lockedCapsules: status !== "WAITING" && openDate >= 현재시각
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

    console.log('🔄 [useMyCapsules] 캡슐 리스트 분류 시작');

    // 현재 시각
    const now = new Date();

    // status와 openDate로 3가지 상태 분류
    const waitingRooms: MyCapsuleItem[] = [];
    const openedCapsules: MyCapsuleItem[] = [];
    const lockedCapsules: MyCapsuleItem[] = [];

    data.items.forEach((capsule) => {
      if (capsule.status === 'WAITING') {
        // 대기실
        waitingRooms.push(capsule);
      } else {
        // 개봉 날짜 기준으로 열린/잠긴 구분
        const openDate = new Date(capsule.openDate);
        if (openDate <= now) {
          // 열린 캡슐
          openedCapsules.push(capsule);
        } else {
          // 잠긴 캡슐
          lockedCapsules.push(capsule);
        }
      }
    });

    console.log('✅ [useMyCapsules] 캡슐 리스트 분류 완료', {
      대기실: waitingRooms.length,
      열린캡슐: openedCapsules.length,
      잠긴캡슐: lockedCapsules.length,
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
