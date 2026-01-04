/**
 * commons/components/timecapsule-header/styles.ts
 * TimeCapsuleHeader 컴포넌트 스타일 정의
 *
 * @description
 * - step-info, step-room 컴포넌트의 헤더 스타일을 통합
 * - Colors, Typography, Spacing 토큰만 사용
 * - 하드코딩된 색상 값 사용 금지
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 헤더 컨테이너 (외부)
  container: {
    width: '100%',
  },

  // 헤더 내부 컨테이너 (flexDirection: 'row')
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 84,
  },

  // 왼쪽 영역 (뒤로가기 버튼)
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  // 뒤로가기 버튼 플레이스홀더 (제목 중앙 정렬을 위해)
  backButtonPlaceholder: {
    width: 24,
    height: 24,
    marginRight: 16,
  },

  // 중앙 영역 (제목)
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
  },

  headerCenterCenter: {
    alignItems: 'center',
  },

  headerCenterLeft: {
    alignItems: 'flex-start',
  },

  title: {
    ...Typography.header.h1,
    color: Colors.black[500],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // step-room용 제목 스타일 (lineHeight: 26.4)
  titleLeft: {
    lineHeight: 26.4,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 오른쪽 영역 (아이콘 버튼들)
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0, // 아이콘 버튼 간격은 각 버튼의 margin으로 처리
  },

  // 오른쪽 영역 플레이스홀더 (제목 중앙 정렬을 위해)
  headerRightPlaceholder: {
    width: 40,
    height: 40,
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 하단 보더
  border: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey[200],
  },
});

