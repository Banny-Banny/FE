/**
 * components/mypage/components/activity-stats/styles.ts
 * 활동 통계 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 *
 * Figma 노드 ID: 161:24090
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Number input)
  container: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.grey[300],
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'auto',
    height: 90.191,
    paddingLeft: 36.163,
    paddingRight: 36.25,
    paddingVertical: 0,
  },

  // 통계 항목 컨테이너
  statItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 3.993,
    height: 47.969,
    justifyContent: 'flex-start',
  },

  // 통계 값 컨테이너
  statValueContainer: {
    height: 27.986,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 통계 값 텍스트 (숫자)
  statValue: {
    ...Typography.header.h1,
    fontSize: 24,
    lineHeight: 26.4,
    fontWeight: '800',
    letterSpacing: -0.40968748927116394,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 통계 라벨 컨테이너
  statLabelContainer: {
    height: 15.99,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 1.11,
  },

  // 통계 라벨 텍스트
  statLabel: {
    ...Typography.body.body8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0,
    color: Colors.darkGrey[400],
    textAlign: 'center',
  },

  // 구분선
  divider: {
    backgroundColor: Colors.grey[300],
    width: 0.99,
    height: 40,
  },
});
