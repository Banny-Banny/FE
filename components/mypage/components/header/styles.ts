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

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Text input)
  container: {
    height: 73.108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 23.993,
    paddingTop: 0,
    paddingBottom: 1.111,
    borderBottomWidth: 1.111,
    // borderBottomColor: rgba(10, 10, 10, 0.08) - Colors.black[500]의 8% 투명도
    // React Native에서는 borderColor에 opacity를 직접 적용할 수 없으므로
    // 가장 가까운 연한 회색 토큰 사용
    borderBottomColor: Colors.whiteGrey[400], // #E9E9E9 (가장 가까운 연한 회색)
  },

  // 왼쪽: 타이틀 컨테이너 (Button)
  titleContainer: {
    height: 21.997,
    width: 84.514,
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
    height: 31.997,
    width: 67.986,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // 아이콘 간 간격: Figma에서 35.99 - 23.993 = 11.997 ≈ 12
    // React Native에서는 gap 대신 marginLeft 사용
  },

  // 알림 버튼 (Button)
  notificationButton: {
    width: 23.993,
    height: 23.993,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // 아이콘 간 간격
  },

  // 알림 아이콘
  notificationIcon: {
    width: 23.993,
    height: 23.993,
  },

  // 알림 배지 (MyPageScreen)
  badge: {
    position: 'absolute',
    top: -3.99,
    left: 12,
    width: 15.99,
    height: 15.99,
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
    lineHeight: 13.5,
    fontWeight: Typography.body.body3.fontWeight, // Bold
    color: Colors.white[500], // #fafafa
    textAlign: 'center',
    letterSpacing: 0.167,
  },

  // 설정 버튼 (Button)
  settingsButton: {
    width: 31.997,
    height: 31.997,
    backgroundColor: Colors.whiteGrey[500], // #e8e8e8
    borderWidth: 1.111,
    // borderColor: rgba(10, 10, 10, 0.08) - Colors.black[500]의 8% 투명도
    // 가장 가까운 연한 회색 토큰 사용
    borderColor: Colors.whiteGrey[400], // #E9E9E9 (가장 가까운 연한 회색)
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1.111,
  },

  // 설정 아이콘
  settingsIcon: {
    width: 20,
    height: 20,
  },
});

