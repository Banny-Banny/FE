/**
 * components/timecapsule-create/components/step-room/styles.ts
 * StepRoom 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 금지)
 * - [✓] 인라인 스타일 금지
 * - [✓] Figma 디자인 1:1 대응
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: Colors.white[100],
    paddingHorizontal: Spacing.lg,
  },

  // 상단 헤더 영역
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginTop: 44,
  },

  // 역할 배지 (HOST/GUEST)
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.black.darker,
    borderRadius: 9999,
  },

  roleBadgeHost: {
    paddingLeft: 38,
  },

  roleBadgeGuest: {
    paddingLeft: Spacing.md,
  },

  roleBadgeText: {
    ...Typography.body.body6,
    color: Colors.black[500],
  },

  crownIcon: {
    position: 'absolute',
    left: 8,
    width: 24,
    height: 24,
  },

  // 헤더 아이콘 영역
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 24,
    height: 24,
  },

  // 타이틀
  title: {
    ...Typography.header.h5,
    color: Colors.black[500],
    marginTop: 24,
  },

  // 정보 카드
  infoCard: {
    marginTop: 24,
    padding: 25,
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    gap: Spacing.md,
  },

  infoCardLabel: {
    ...Typography.body.body3,
    color: Colors.grey[500],
  },

  infoCardValue: {
    ...Typography.header.h5,
    color: Colors.black[500],
  },

  infoCardDetails: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  infoCardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  infoCardDetailIcon: {
    width: 16,
    height: 16,
  },

  infoCardDetailLabel: {
    ...Typography.body.body3,
    color: Colors.grey[500],
    marginBottom: 4,
  },

  infoCardDetailValue: {
    ...Typography.body.body6,
    color: Colors.black[500],
  },

  // 진행 상황 바
  progressSection: {
    marginTop: 45,
    gap: Spacing.sm,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    ...Typography.body.body6,
    color: Colors.black[500],
  },

  progressValue: {
    ...Typography.body.body6,
    color: Colors.black[500],
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.grey[300],
    borderWidth: 1,
    borderColor: Colors.black.darker,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 6,
    backgroundColor: Colors.black.darker,
    margin: 1,
  },

  // 참여자 목록
  participantSection: {
    marginTop: 30,
    gap: Spacing.md,
  },

  participantLabel: {
    ...Typography.body.body6,
    color: Colors.grey[500],
  },

  participantList: {
    gap: Spacing.md,
  },

  // 참여자 카드
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 84,
    paddingHorizontal: 18,
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderRadius: 16,
  },

  participantCardActive: {
    borderColor: Colors.black.darker,
    shadowColor: Colors.black.darker,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  participantCardInactive: {
    borderColor: Colors.grey[200],
  },

  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    backgroundColor: Colors.white[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarActive: {
    borderColor: Colors.black.darker,
  },

  avatarEmoji: {
    fontSize: 24, // Typography.header.h1의 fontSize
  },

  avatarEmojiDisabled: {
    color: Colors.grey[400],
  },

  participantDetails: {
    gap: 4,
  },

  participantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  participantName: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },

  participantStatus: {
    ...Typography.body.body3,
  },

  statusCompleted: {
    color: Colors.grey[400],
  },

  statusPending: {
    color: Colors.green[500],
  },

  statusWaiting: {
    color: Colors.grey[400],
  },

  // 체크박스
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 1.11,
  },

  checkboxActive: {
    borderColor: Colors.grey[400],
  },

  checkboxInactive: {
    borderColor: Colors.grey[200],
  },

  checkboxChecked: {
    width: 24,
    height: 24,
  },

  // 하단 정보 영역
  bottomSection: {
    marginTop: 34,
    gap: Spacing.md,
  },

  infoText: {
    ...Typography.body.body3,
    color: Colors.grey[400],
    textAlign: 'center',
  },

  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  deadlineIcon: {
    width: 16,
    height: 16,
  },

  deadlineText: {
    ...Typography.body.body6,
    color: Colors.grey[500],
  },

  // 버튼 영역
  buttonSection: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },

  submitButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darkGrey[900], // 기본 색상: 진한 회색/검정
  },

  submitButtonDisabled: {
    backgroundColor: Colors.grey[400],
  },

  submitButtonText: {
    ...Typography.caption.button,
    color: Colors.white[50],
  },

  buttonHint: {
    ...Typography.body.body3,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  // 크라운 아이콘 (참여자 이름 옆)
  crownEmoji: {
    fontSize: 16, // Typography.body.body1의 fontSize
    marginLeft: 4,
  },
});
