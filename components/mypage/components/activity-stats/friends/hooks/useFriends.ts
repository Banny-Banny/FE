/**
 * Friends API Hook
 * Version: 4.0.0 (React Query)
 * Created: 2025-12-18
 *
 * [Business Logic] 친구 목록 조회 및 관리 API 통신
 * - 카카오톡 친구 목록 조회 (GET /api/me/friends)
 * - React Query로 캐싱 및 중복 요청 방지
 * - 친구 차단/해제 (로컬 상태 관리)
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import type { Friend, FriendItemResponse, FriendsListResponse } from '../types';

export interface UseFriendsReturn {
  friends: Friend[];
  isRefreshing: boolean;
  error: string | null;
  refreshFriends: () => Promise<void>;
  toggleBlock: (friendId: string) => void;
}

/**
 * 친구 목록 조회 함수 (React Query용)
 */
const fetchFriends = async (): Promise<FriendItemResponse[]> => {
  const endpoint = `/${API_ENDPOINTS.AUTH.FRIENDS}`;
  const response = await apiClient.get<FriendsListResponse>(endpoint, {
    params: {
      limit: 20,
      offset: 0,
    },
  });
  return response.data.items;
};

/**
 * 친구 목록을 관리하는 Hook (React Query)
 *
 * @description
 * - GET /api/me/friends API를 통해 카카오톡 친구 목록 조회
 * - React Query로 캐싱 및 중복 요청 방지
 * - 페이지네이션 파라미터: limit (기본값: 20), offset (기본값: 0)
 * - 차단 상태는 로컬에서 관리
 */
export function useFriends(): UseFriendsReturn {
  // 로컬에서 관리하는 차단된 친구 ID 목록
  const [blockedFriendIds, setBlockedFriendIds] = useState<Set<string>>(new Set());

  // React Query로 친구 목록 조회
  const {
    data: friendItems = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: fetchFriends,
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });

  // 에러 메시지 변환
  const error = queryError
    ? (queryError as any).response?.data?.message ||
      (queryError as Error).message ||
      '친구 목록을 불러오는 중 오류가 발생했습니다.'
    : null;

  /**
   * API 응답을 Friend 타입으로 변환 (차단 상태 포함)
   */
  const friends = useMemo(() => {
    return friendItems.map((item) => ({
      id: item.id,
      name: item.friend.nickname,
      emoji: '😊',
      profileImg: item.friend.profileImg,
      isBlocked: blockedFriendIds.has(item.id),
    }));
  }, [friendItems, blockedFriendIds]);

  /**
   * 수동 새로고침 함수
   */
  const refreshFriends = async () => {
    await refetch();
  };

  /**
   * 친구 차단/해제
   */
  const toggleBlock = useCallback((friendId: string) => {
    setBlockedFriendIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
      } else {
        newSet.add(friendId);
      }
      return newSet;
    });
  }, []);

  return {
    friends,
    isRefreshing: isLoading,
    error,
    refreshFriends,
    toggleBlock,
  };
}
