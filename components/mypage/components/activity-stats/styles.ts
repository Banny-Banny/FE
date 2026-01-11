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

import { BorderRadius, Colors, FontWeight, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Number input)
  container: {
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 21,
    gap: Spacing.xl, // 32px
  },

  // 통계 항목 컨테이너
  statItem: {
    flexDirection: 'column',
    alignItems: 'stretch', // flex-start에서 stretch로 변경하여 자식의 width: 100%가 제대로 작동하도록
    gap: 4,
    height: 48,
    justifyContent: 'flex-start',
    flex: 1, // 각 항목이 동일한 공간을 차지하도록 추가
  },

  // 통계 값 컨테이너
  statValueContainer: {
    height: 28,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 통계 값 텍스트 (숫자)
  statValue: {
    fontFamily: Typography.header.h1.fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    lineHeight: 26,
    letterSpacing: 0,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 통계 라벨 컨테이너
  statLabelContainer: {
    height: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 1,
  },

  // 통계 라벨 텍스트
  statLabel: {
    ...Typography.body.body8,
    color: Colors.darkGrey[400], // #878787 (피그마 #888에 가장 가까운 토큰)
    textAlign: 'center',
  },

  // 구분선
  divider: {
    backgroundColor: Colors.grey[300],
    width: 1,
    height: 40,
  },
});
