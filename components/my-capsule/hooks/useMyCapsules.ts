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
 * - openedCapsules: status !== "WAITING" && openDate <= 현재시각
 * - lockedCapsules: status !== "WAITING" && openDate > 현재시각
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

    // 현재 시각
    const now = new Date();

    // status와 openDate로 3가지 상태 분류
    const waitingRooms: MyCapsuleItem[] = [];
    const openedCapsules: MyCapsuleItem[] = [];
    const lockedCapsules: MyCapsuleItem[] = [];

    data.items.forEach((capsule) => {
      // 🎯 이스터에그 필터링: openDate와 deadline이 둘 다 null인 경우 제외
      if (capsule.openDate === null && capsule.deadline === null) {
        return; // 이 캡슐은 건너뛰기
      }

      if (capsule.status === 'WAITING') {
        // 대기실 - 작성 대기 중인 캡슐
        waitingRooms.push(capsule);
      } else {
        // status가 WAITING이 아닌 경우, openDate로 열린/잠긴 구분
        if (capsule.openDate) {
          const openDate = new Date(capsule.openDate);
          if (openDate <= now) {
            // 열린 캡슐 - 개봉 날짜가 현재 시각 이하
            openedCapsules.push(capsule);
          } else {
            // 잠긴 캡슐 - 개봉 날짜가 현재 시각보다 미래
            lockedCapsules.push(capsule);
          }
        } else {
          // openDate가 없는 경우, status로 분류 (폴백)
          if (capsule.status === 'COMPLETED' || capsule.status === 'EXPIRED') {
            openedCapsules.push(capsule);
          } else if (capsule.status === 'BURIED') {
            lockedCapsules.push(capsule);
          }
        }
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
