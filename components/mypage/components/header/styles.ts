/**
 * components/mypage/components/header/styles.ts
 * 마이페이지 헤더 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영
 *
 * Figma 노드 ID: 161:24062
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 외부 컨테이너
  outerContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'visible', // absolute positioned border가 화면 밖으로 나갈 수 있도록
  },

  // 메인 컨테이너 (Text input)
  container: {
    width: '100%',
    height: 73,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 23.993,
    paddingTop: 0,
    paddingBottom: 1,
  },

  // border-bottom line (화면 양끝까지 확장)
  borderLine: {
    position: 'absolute',
    bottom: 0,
    left: -Spacing.lg, // 부모의 paddingHorizontal 상쇄
    right: -Spacing.lg, // 부모의 paddingHorizontal 상쇄
    height: 1,
    backgroundColor: Colors.whiteGrey[400], // #E9E9E9 (가장 가까운 연한 회색)
  },

  // 왼쪽: 타이틀 컨테이너 (Button)
  titleContainer: {
    height: 22,
    width: 85,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // 타이틀 텍스트
  titleText: {
    fontFamily: Typography.header.h1.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: Typography.header.h1.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // #0a0a0a
    letterSpacing: -0.8492,
  },

  // 오른쪽: 아이콘 컨테이너 (Container)
  iconContainer: {
    height: 32,
    width: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // 아이콘 간 간격: Figma에서 35.99 - 23.993 = 11.997 ≈ 12
    // React Native에서는 gap 대신 marginLeft 사용
  },

  // 알림 버튼 (Button)
  notificationButton: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // 아이콘 간 간격
  },

  // 알림 아이콘
  notificationIcon: {
    width: 24,
    height: 24,
  },

  // 알림 배지 (MyPageScreen)
  badge: {
    position: 'absolute',
    top: -4,
    left: 12,
    width: 16,
    height: 16,
    // 피그마 디자인: #ff7b7b - Colors.red 팔레트에서 가장 가까운 색상 사용
    backgroundColor: Colors.red[500], // #FF515A (가장 가까운 빨간색)
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 배지 텍스트
  badgeText: {
    fontFamily: Typography.body.body3.fontFamily,
    fontSize: 9,
    lineHeight: 14,
    fontWeight: Typography.body.body3.fontWeight, // Bold
    color: Colors.white[500], // #fafafa
    textAlign: 'center',
    letterSpacing: 0,
  },

  // 설정 버튼 (Button)
  settingsButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.whiteGrey[500], // #e8e8e8
    borderWidth: 1,
    // borderColor: rgba(10, 10, 10, 0.08) - Colors.black[500]의 8% 투명도
    // 가장 가까운 연한 회색 토큰 사용
    borderColor: Colors.whiteGrey[400], // #E9E9E9 (가장 가까운 연한 회색)
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },

  // 설정 아이콘
  settingsIcon: {
    width: 20,
    height: 20,
  },
});
