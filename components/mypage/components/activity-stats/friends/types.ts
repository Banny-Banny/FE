/**
 * components/mypage/components/activity-stats/friends/types.ts
 * 친구 관리 모달 타입 정의
 */

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  profileImg: string | null; // 프로필 이미지 URL
  isBlocked: boolean;
}

// API 응답 타입
export interface FriendItemResponse {
  id: string;
  status: string; // "CONNECTED" 등
  friend: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
  createdAt: string;
}

export interface FriendsListResponse {
  items: FriendItemResponse[];
}

export interface FriendsModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 친구 목록 */
  friends?: Friend[];
  /** 새로고침 함수 */
  onRefresh?: () => void;
  /** 친구 차단/해제 함수 */
  onToggleBlock?: (friendId: string) => void;
  /** 동기화 진행 중 여부 */
  isRefreshing?: boolean;
}

