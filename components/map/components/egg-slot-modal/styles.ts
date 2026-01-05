/**
 * EggSlotModal Component Styles
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
  // 모달 컨테이너 (Modal 컴포넌트 내부 컨텐츠)
  modalContent: {
    position: 'relative',
    width: '100%',
    paddingTop: Spacing.lg, // 24px
    paddingBottom: Spacing.lg, // 24px
    paddingHorizontal: Spacing.lg, // 24px
    // backgroundColor는 Modal 컴포넌트에서 이미 제공되므로 제거
  },

  // 헤더 영역
  headerContainer: {
    marginBottom: Spacing.md, // 16px
    paddingTop: Spacing.sm, // 8px
    minHeight: 59, // 헤더 최소 높이
  },

  // 헤더 텍스트 영역
  headerTextContainer: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },

  // "MY EGGS" 타이틀
  title: {
    ...Typography.header.h1,
    color: Colors.black[500], // #0A0A0A
    textTransform: 'uppercase',
  },

  // 서브타이틀
  subtitle: {
    ...Typography.body.body11,
    color: Colors.grey[800], // #99A1AF (Figma에서 확인)
  },

  // 닫기 버튼
  closeButton: {
    position: 'absolute',
    top: Spacing.md, // 16px
    right: Spacing.md, // 16px
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full, // 9999
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // 에그 슬롯 컨테이너
  eggSlotContainer: {
    backgroundColor: Colors.whiteGrey[50], // #F9FAFB
    borderWidth: 1,
    borderColor: Colors.whiteGrey[100], // #F3F4F6
    borderRadius: BorderRadius['2xl'], // 24px
    paddingHorizontal: 52,
    paddingVertical: 41,
    marginBottom: Spacing.lg, // 24px
    alignItems: 'center',
  },

  // 에그 슬롯 아이템들
  eggSlotRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  // 에그 슬롯 개별 아이템
  eggSlotItem: {
    width: 44,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 에그 아이콘
  eggIcon: {
    width: 44,
    height: 55,
  },

  // 에그 아이콘 (빈 슬롯)
  eggIconEmpty: {
    width: 44,
    height: 55,
    opacity: 0.3,
  },

  // 개수 표시 영역
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginBottom: Spacing.lg, // 24px
    width: '100%',
  },

  // 현재 개수 (큰 숫자)
  currentCount: {
    ...Typography.header.h5,
    color: Colors.black[500], // #101828
  },

  // 전체 개수 (작은 숫자)
  totalCount: {
    ...Typography.header.h5,
    color: Colors.grey[300], // #D1D5DC
  },

  // 정보 섹션
  infoContainer: {
    backgroundColor: Colors.whiteGrey[50], // #F9FAFB
    borderWidth: 1,
    borderColor: Colors.whiteGrey[100], // #F3F4F6
    borderRadius: BorderRadius.lg, // 16px
    padding: Spacing.md, // 16px
    marginBottom: Spacing.lg, // 24px
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
  },

  // 정보 아이콘 컨테이너
  infoIconContainer: {
    width: 16,
    height: 16,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 정보 아이콘
  infoIcon: {
    width: 16,
    height: 16,
  },

  // 정보 텍스트 컨테이너
  infoTextContainer: {
    flex: 1,
  },

  // 정보 텍스트
  infoText: {
    ...Typography.body.body8,
    color: Colors.grey[700], // #6A7282 (Figma 기준)
  },

  // 정보 텍스트 강조 부분 (3개)
  infoTextHighlight: {
    color: Colors.black[500], // #000000
  },

  // 확인 버튼 컨테이너
  confirmButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
