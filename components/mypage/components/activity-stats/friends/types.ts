/**
 * components/mypage/components/activity-stats/friends/types.ts
 * 친구 관리 모달 타입 정의
 */

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  isBlocked: boolean;
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
}

