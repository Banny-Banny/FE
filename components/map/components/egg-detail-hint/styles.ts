/**
 * EggDetailHint Component Styles
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] 모든 스타일은 styles.ts에만 정의
 * - [x] 토큰 기반 스타일 사용
 * - [x] Figma 디자인 1:1 대응
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 토스트 컨테이너 (화면 상단에 absolute positioning)
  container: {
    position: 'absolute',
    top: 96, // Figma 기준: y=96
    left: 0,
    right: 0,
    alignItems: 'center', // 중앙 정렬
    zIndex: 1000, // 다른 UI 요소 위에 표시
    pointerEvents: 'box-none', // 터치 이벤트는 자식 요소만 받음
  },

  // 카드 컨테이너
  content: {
    width: 260, // Figma 기준: width=260
    paddingTop: 13, // Figma 정확한 값 (Spacing.sm=8, Spacing.md=16 사이)
    paddingBottom: 1, // Figma 정확한 값
    paddingHorizontal: 13, // Figma 정확한 값 (Spacing.sm=8, Spacing.md=16 사이)
    backgroundColor: Colors.white[500],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[200],
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // 메인 컨텐츠 영역
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // 4px
    marginBottom: 10, // Figma 정확한 값 (Spacing.sm=8, Spacing.md=16 사이)
    height: 40,
  },

  // 알 아이콘 컨테이너 (왼쪽)
  iconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 아이콘 래퍼 (검은색 원)
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // 알 아이콘
  eggIcon: {
    width: 20,
    height: 24,
    tintColor: Colors.white[50],
  },

  // 텍스트 영역
  textContainer: {
    flex: 1,
    height: 35,
    justifyContent: 'center',
    gap: 2, // Figma 정확한 값 (Spacing.xs=4보다 작음)
  },

  // 메인 텍스트 (제목)
  title: {
    ...Typography.body.body8,
    color: Colors.darkGrey[800],
  },

  // 거리 정보 컨테이너
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // 4px
    height: 15,
  },

  // 거리 텍스트
  distanceText: {
    ...Typography.body.body3,
    color: Colors.grey[800],
  },

  // 방향 화살표 컨테이너 (오른쪽)
  arrowContainer: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 방향 화살표 래퍼 (회전용)
  arrowWrapper: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 진행 바 컨테이너
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: 0,
  },

  // 진행 바 (채워진 부분)
  progressBar: {
    height: 6,
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.full,
  },
});
