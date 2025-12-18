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

import { Colors, FontFamily, FontSize, FontWeight, Spacing } from '@/commons/constants';
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.15,
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
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    marginTop: 24,
    letterSpacing: 0.07,
  },

  // 정보 카드
  infoCard: {
    marginTop: 24,
    padding: 25,
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.white[200],
    borderRadius: 16,
    gap: Spacing.md,
  },

  infoCardLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
  },

  infoCardValue: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: 0.4,
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
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    marginBottom: 4,
  },

  infoCardDetailValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.15,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.15,
  },

  progressValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.15,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.white[200],
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    letterSpacing: -0.15,
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
    borderColor: Colors.white[200],
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
    borderColor: Colors.white[200],
    backgroundColor: Colors.white[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarActive: {
    borderColor: Colors.black.darker,
  },

  avatarEmoji: {
    fontSize: FontSize['2xl'],
  },

  avatarEmojiDisabled: {
    opacity: 0.3,
  },

  participantDetails: {
    gap: 4,
  },

  participantName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.61,
  },

  participantStatus: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
  },

  statusCompleted: {
    color: Colors.black[500],
  },

  statusPending: {
    color: Colors.blue[500],
  },

  statusWaiting: {
    color: Colors.black[500],
  },

  // 체크박스
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 1.11,
  },

  checkboxActive: {
    borderColor: Colors.black[500],
  },

  checkboxInactive: {
    borderColor: Colors.white[200],
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
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    letterSpacing: -0.15,
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
  },

  submitButtonDisabled: {
    backgroundColor: Colors.black[500],
  },

  submitButtonEnabled: {
    backgroundColor: Colors.blue[500],
  },

  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.white[50],
    letterSpacing: -0.44,
  },

  buttonHint: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 크라운 아이콘 (참여자 이름 옆)
  crownEmoji: {
    fontSize: FontSize.base,
    marginLeft: 4,
  },
});
