/**
 * Friends API Hook
 * Version: 1.0.0
 * Created: 2025-12-18
 *
 * [Business Logic] 친구 목록 조회 및 관리 API 통신
 * - 카카오톡 친구 동기화
 * - 친구 차단/해제
 * - ⚠️ 현재는 Mock Data 사용, 추후 API 연동 시 이 파일만 수정하면 됨
 */

import { DEFAULT_FRIENDS } from '@/egg/constants/MOCK_DATA';
import { useCallback, useState } from 'react';
import type { Friend } from '../types';

export interface UseFriendsReturn {
  friends: Friend[];
  isRefreshing: boolean;
  error: string | null;
  refreshFriends: () => Promise<void>;
  toggleBlock: (friendId: string) => void;
}

/**
 * 친구 목록을 관리하는 Hook
 *
 * @description
 * - 현재는 Mock Data 사용
 * - API 연동 시 fetchFriends 함수 내부의 TODO 부분만 수정하면 됨
 * - 차단 상태는 로컬에서 관리 (API 연동 시 서버와 동기화 필요)
 */
export function useFriends(): UseFriendsReturn {
  const [friends, setFriends] = useState<Friend[]>(DEFAULT_FRIENDS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 카카오톡 친구 목록 동기화
   *
   * @description
   * - 현재는 Mock Data 시뮬레이션
   * - API 연동 시 아래 TODO 부분을 실제 API 호출로 교체
   */
  const refreshFriends = useCallback(async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      setError(null);

      // TODO: API 연동 시 아래 코드로 교체
      // import { API_ENDPOINTS } from '@/commons/constants';
      // import { apiClient } from '@/utils/apiClient';
      //
      // const endpoint = `/${API_ENDPOINTS.FRIENDS.SYNC}`;
      // const response = await apiClient.get<FriendsResponse>(endpoint);
      //
      // // 차단된 친구 상태 유지
      // const blockedFriendIds = friends.filter(f => f.isBlocked).map(f => f.id);
      // const syncedFriends = response.data.friends.map(friend => ({
      //   ...friend,
      //   isBlocked: blockedFriendIds.includes(friend.id),
      // }));
      //
      // setFriends(syncedFriends);

      // Mock Data 시뮬레이션 (2초 대기)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 동기화 완료 후 친구 목록 업데이트 (차단 상태는 유지)
      setFriends((prevFriends) => {
        const blockedFriendIds = prevFriends.filter(f => f.isBlocked).map(f => f.id);
        return DEFAULT_FRIENDS.map(friend => ({
          ...friend,
          isBlocked: blockedFriendIds.includes(friend.id),
        }));
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '친구 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('[useFriends] 친구 동기화 실패:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * 친구 차단/해제
   *
   * @description
   * - 현재는 로컬 상태만 변경
   * - API 연동 시 서버에 차단 상태 저장 필요
   */
  const toggleBlock = useCallback((friendId: string) => {
    setFriends((prevFriends) => {
      const updatedFriends = prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isBlocked: !friend.isBlocked } : friend
      );

      // TODO: API 연동 시 아래 코드 추가
      // const friend = updatedFriends.find(f => f.id === friendId);
      // if (friend) {
      //   // 서버에 차단 상태 저장
      //   apiClient.post(`/${API_ENDPOINTS.FRIENDS.BLOCK}`, {
      //     friendId,
      //     isBlocked: friend.isBlocked,
      //   }).catch(err => {
      //     console.error('[useFriends] 차단 상태 저장 실패:', err);
      //     // 실패 시 롤백
      //     setFriends(prevFriends);
      //   });
      // }

      return updatedFriends;
    });
  }, []);

  return {
    friends,
    isRefreshing,
    error,
    refreshFriends,
    toggleBlock,
  };
}

