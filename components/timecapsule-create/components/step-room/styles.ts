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
  // 메인 컨테이너 (SafeAreaView)
  container: {
    flex: 1,
    backgroundColor: Colors.white[100],
  },

  // 스크롤 영역
  scrollContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // 스크롤 컨텐츠 컨테이너
  scrollContentContainer: {
    paddingBottom: Spacing.lg, // 24px
  },

  // 중앙 정렬 컨텐츠 (로딩, 에러 상태)
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  icon: {
    width: 24,
    height: 24,
  },

  // 정보 카드
  infoCard: {
    marginTop: Spacing.lg,
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
    fontFamily: 'Pretendard Variable',
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0.3955078125,
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

  infoCardIconWrapper: {
    width: 28,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoCardDetailLabel: {
    ...Typography.body.body3,
    color: Colors.grey[500],
  },

  infoCardDetailValue: {
    ...Typography.caption.caption1,
    color: Colors.black[500],
  },

  // 친구 초대하기 버튼 래퍼
  inviteButtonWrapper: {
    marginVertical: 20,
  },

  // 참여자 목록
  participantSection: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },

  participantLabel: {
    ...Typography.caption.caption1,
    color: Colors.black[500],
  },

  participantList: {
    gap: Spacing.md,
  },

  // 참여자 카드
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 78,
    paddingHorizontal: 21,
    backgroundColor: Colors.white[100],
  },

  participantCardActive: {
    borderColor: Colors.black.darker,
    shadowColor: Colors.black.darker,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 4,
  },

  participantCardInactive: {
    backgroundColor: Colors.whiteGrey[200],
    borderRadius: 16,
  },

  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.whiteGrey[500],
    backgroundColor: Colors.white[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarActive: {
    borderColor: Colors.lightBlack[500],
  },

  avatarEmoji: {
    fontSize: 24,
  },

  avatarEmojiDisabled: {
    backgroundColor: Colors.grey[100],
    borderColor: Colors.whiteGrey[500],
  },

  participantDetails: {
    gap: Spacing.xs,
  },

  participantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  participantName: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.612500011920929,
    color: Colors.black[500],
  },

  participantStatus: {
    ...Typography.body.body3,
  },

  statusCompleted: {
    color: Colors.grey[400],
  },

  statusPending: {
    color: Colors.blue[500],
  },

  statusWaiting: {
    color: Colors.darkGrey[500],
  },

  emptySlotText: {
    ...Typography.body.body3,
    color: Colors.darkGrey[500],
  },

  // 체크박스
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 1,
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
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },

  infoText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0,
    color: Colors.grey[600],
    textAlign: 'center',
  },

  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  deadlineIcon: {
    width: 16,
    height: 16,
  },

  deadlineText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.150390625,
    color: Colors.grey[500],
  },

  // 버튼 영역
  buttonSection: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },

  buttonHint: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  // 크라운 아이콘 (참여자 이름 옆)
  crownEmoji: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 0,
  },
});
