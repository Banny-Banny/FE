/**
 * components/my-capsule/hooks/useOpenedCapsuleDetail.ts
 * 타임캡슐 상세 조회 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { getOpenedCapsuleDetail } from '../api/capsule';
import type { OpenedCapsuleDetailResponse, CapsuleSlot } from '../types';

/**
 * 타임캡슐 상세 조회 Hook
 * ⭐ 결제 완료된 캡슐만 조회 가능
 * @param id 캡슐 ID (UUID), null이면 조회하지 않음
 * @param userId 사용자 ID (UUID) - 다른 사람 게시물을 보기 위해 필요
 * @returns {object} data, isLoading, error, refetch, writtenSlots
 */
export function useOpenedCapsuleDetail(id: string | null, userId: string | null) {
  // @tanstack/react-query를 사용한 API 호출
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['openedCapsuleDetail', id, userId],
    queryFn: () => {
      if (!id) {
        throw new Error('캡슐 ID가 필요합니다.');
      }
      if (!userId) {
        throw new Error('사용자 ID가 필요합니다.');
      }
      return getOpenedCapsuleDetail(id, userId);
    },
    enabled: !!id && !!userId, // id와 userId가 모두 있을 때만 조회
    retry: 1,
  });

  // 작성된 슬롯만 필터링
  const writtenSlots: CapsuleSlot[] = data?.slots.filter(slot => slot.isWritten) || [];

  return {
    data: data || null,
    writtenSlots, // 작성된 슬롯만
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
