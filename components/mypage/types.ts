/**
 * components/mypage/types.ts
 * 마이페이지 관련 타입 정의
 */

// API 응답 타입
export interface UserInfoResponse {
  id: string;
  nickname: string;
  email: string;
  profileImg: string; // camelCase
  phoneNumber: string;
  isMarketingAgreed: boolean;
  isPushAgreed: boolean;
  isLocationTermAgreed: boolean;
  createdAt: string;
}

// Hook 반환 타입
export interface UseUserInfoReturn {
  data: UserInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

