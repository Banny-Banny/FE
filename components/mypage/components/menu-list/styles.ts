/**
 * components/mypage/components/menu-list/styles.ts
 * 메뉴 리스트 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 *
 * Figma 노드 ID: 161:24117
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Input form)
  container: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.grey[300],
    borderRadius: BorderRadius.lg,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 18,
    paddingVertical: 5,
    width: '100%',
  },

  // 메뉴 항목 (Text input)
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderBottomWidth: 1.111,
    borderBottomColor: Colors.grey[300],
  },

  // 마지막 메뉴 항목 (구분선 없음)
  menuItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },

  // 메뉴 텍스트
  menuText: {
    ...Typography.header.h4,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 아이콘 컨테이너
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

