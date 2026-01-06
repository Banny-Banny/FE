/**
 * components/mypage/types.ts
 * 마이페이지 관련 타입 정의
 */

// API 응답 타입
export interface UserInfoSummary {
  capsuleCount: number;
  easterEggCount: number;
  friendCount: number;
}

export interface UserInfoData {
  nickname: string;
  email: string;
  profileImageUrl: string;
  summary: UserInfoSummary;
}

export interface UserInfoResponse {
  success: boolean;
  data: UserInfoData;
}

// Hook 반환 타입
export interface UseUserInfoReturn {
  data: UserInfoData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
