/**
 * components/mypage/components/logout-button/types.ts
 * 로그아웃 버튼 컴포넌트 타입 정의
 */

/**
 * LogoutButton 컴포넌트 Props
 */
export interface LogoutButtonProps {
  /**
   * 로그아웃 버튼 클릭 핸들러 (필수)
   */
  onPress: () => void;
}

