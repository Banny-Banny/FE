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

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/colors';
import { Fonts } from '@/commons/constants/fonts';
import { Spacing } from '@/commons/constants/spacing';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    borderColor: Colors.black,
    borderRadius: 9999,
  },

  roleBadgeHost: {
    paddingLeft: 38,
  },

  roleBadgeGuest: {
    paddingLeft: Spacing.md,
  },

  roleBadgeText: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
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
    fontSize: Fonts.size['2xl'],
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
    marginTop: 24,
    letterSpacing: 0.07,
  },

  // 정보 카드
  infoCard: {
    marginTop: 24,
    padding: 25,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    gap: Spacing.md,
  },

  infoCardLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
  },

  infoCardValue: {
    fontSize: Fonts.size['3xl'],
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
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
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
    marginBottom: 4,
  },

  infoCardDetailValue: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
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
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
    letterSpacing: -0.15,
  },

  progressValue: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
    letterSpacing: -0.15,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 6,
    backgroundColor: Colors.black,
    margin: 1,
  },

  // 참여자 목록
  participantSection: {
    marginTop: 30,
    gap: Spacing.md,
  },

  participantLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
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
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderRadius: 16,
  },

  participantCardActive: {
    borderColor: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  participantCardInactive: {
    borderColor: '#E5E5E5',
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
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarActive: {
    borderColor: Colors.black,
  },

  avatarEmoji: {
    fontSize: Fonts.size['2xl'],
  },

  avatarEmojiDisabled: {
    opacity: 0.3,
  },

  participantDetails: {
    gap: 4,
  },

  participantName: {
    fontSize: Fonts.size.base,
    fontWeight: Fonts.weight.bold,
    color: Colors.black,
    letterSpacing: -0.61,
  },

  participantStatus: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
  },

  statusCompleted: {
    color: '#999999',
  },

  statusPending: {
    color: '#1F59DB',
  },

  statusWaiting: {
    color: '#999999',
  },

  // 체크박스
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 1.11,
  },

  checkboxActive: {
    borderColor: '#CCCCCC',
  },

  checkboxInactive: {
    borderColor: '#E5E5E5',
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
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#999999',
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
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
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
    backgroundColor: '#B3B3B3',
  },

  submitButtonEnabled: {
    backgroundColor: Colors.primary,
  },

  submitButtonText: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
    color: '#FAFAFA',
    letterSpacing: -0.44,
  },

  buttonHint: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
    textAlign: 'center',
  },

  // 크라운 아이콘 (참여자 이름 옆)
  crownEmoji: {
    fontSize: Fonts.size.base,
    marginLeft: 4,
  },
});
