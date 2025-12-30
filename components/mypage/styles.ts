/**
 * components/mypage/styles.ts
 * 마이페이지 Feature Container 스타일
 *
 * Figma 디자인 기준:
 * - 좌우 마진: 24px (23.99px)
 * - 컴포넌트 간 간격:
 *   - 프로필 ~ 활동 통계: 0px (직접 붙어있음)
 *   - 활동 통계 ~ 메뉴 리스트: 24px (364.89 - 340.541)
 *   - 메뉴 리스트 ~ 로그아웃: 30px (586.02 - 555.89)
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 *
 * Figma 노드 ID: 161:24061
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
    paddingHorizontal: Spacing.lg, // Figma: 23.99px ≈ 24px
  },
  
  // 컴포넌트 간 간격을 위한 래퍼
  content: {
    flex: 1,
  },
  
  // 프로필 섹션 (활동 통계와 직접 붙어있음)
  profileSection: {
    marginBottom: 0,
  },
  
  // 활동 통계 (메뉴 리스트와 24px 간격)
  activityStats: {
    marginBottom: Spacing.lg, // 24px
  },
  
  // 메뉴 리스트 (로그아웃 버튼과 30px 간격)
  menuList: {
    marginBottom: 30, // Figma: 30.13px ≈ 30px
  },
  
  // 로그아웃 버튼
  logoutButton: {
    marginBottom: 0,
  },
});

