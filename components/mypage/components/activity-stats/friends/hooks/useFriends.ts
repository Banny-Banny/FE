/**
 * Friends API Hook
 * Version: 3.0.0 (React Query)
 * Created: 2025-12-18
 *
 * [Business Logic] 친구 목록 조회 및 관리 API 통신
 * - 카카오톡 친구 목록 조회 (GET /api/me/friends)
 * - React Query로 캐싱 및 중복 요청 방지
 * - 친구 차단/해제 (로컬 상태 관리)
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { useCallback, useEffect, useState } from 'react';
import type { Friend, FriendItemResponse, FriendsListResponse } from '../types';

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
 * - GET /api/me/friends API를 통해 카카오톡 친구 목록 조회
 * - 페이지네이션 파라미터: limit (기본값: 20), offset (기본값: 0)
 * - 차단 상태는 로컬에서 관리
 */
export function useFriends(): UseFriendsReturn {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 Friend 타입으로 변환
   */
  const mapFriendItemToFriend = useCallback(
    (item: FriendItemResponse, blockedFriendIds: Set<string>): Friend => {
      return {
        id: item.id,
        name: item.friend.nickname,
        emoji: '😊', // 기본 이모지 (프로필 이미지가 없을 때 사용)
        profileImg: item.friend.profileImg, // 프로필 이미지 URL
        isBlocked: blockedFriendIds.has(item.id),
      };
    },
    [],
  );

  /**
   * 카카오톡 친구 목록 조회
   *
   * @description
   * - GET /api/me/friends
   * - Query Parameters: limit (기본값: 20), offset (기본값: 0)
   */
  const refreshFriends = useCallback(async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      setError(null);

      // 차단된 친구 ID 목록 저장 (상태 유지용)
      const blockedFriendIds = new Set(friends.filter((f) => f.isBlocked).map((f) => f.id));

      // API 호출
      const endpoint = `/${API_ENDPOINTS.AUTH.FRIENDS}`;
      const response = await apiClient.get<FriendsListResponse>(endpoint, {
        params: {
          limit: 20, // 한 페이지에 표시할 아이템 수
          offset: 0, // 건너뛸 아이템 수
        },
      });

      // API 응답을 Friend 타입으로 변환
      const mappedFriends = response.data.items.map((item) =>
        mapFriendItemToFriend(item, blockedFriendIds),
      );

      setFriends(mappedFriends);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '친구 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('[useFriends] 친구 목록 조회 실패:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, friends, mapFriendItemToFriend]);

  /**
   * 초기 친구 목록 로드
   */
  useEffect(() => {
    refreshFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 친구 차단/해제
   *
   * @description
   * - 현재는 로컬 상태만 변경
   * - 추후 서버에 차단 상태 저장 API가 추가되면 연동 필요
   */
  const toggleBlock = useCallback((friendId: string) => {
    setFriends((prevFriends) => {
      return prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isBlocked: !friend.isBlocked } : friend,
      );
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
