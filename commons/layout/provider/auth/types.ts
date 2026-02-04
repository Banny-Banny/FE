/**
 * commons/layout/provider/auth/types.ts
 * AuthProvider에서 사용하는 타입 정의
 */

export interface User {
  id: string;
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  [key: string]: unknown; // 확장 가능한 필드
}

