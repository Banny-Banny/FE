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
    borderColor: Colors.grey[500], // Figma: #B2B2B2
    borderRadius: 16,
    gap: 40, // Figma: gap-[40px] - Spacing 토큰에 40px 없음
  },

  infoCardLabel: {
    ...Typography.body.body10, // Figma: 12px, lineHeight: 18px
    color: Colors.darkGrey[500], // Figma: #666666
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
    gap: 40, // Figma: gap-[40px] - Spacing 토큰에 40px 없음
  },

  infoCardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Figma: gap-[10px] - Spacing 토큰에 10px 없음
  },

  infoCardIconWrapper: {
    width: 28,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoCardDetailLabel: {
    ...Typography.body.body3,
    lineHeight: 12, // Figma: leading-[12px]로 오버라이드
    color: Colors.darkGrey[500], // Figma: #666666
  },

  infoCardDetailValue: {
    ...Typography.caption.caption1,
    lineHeight: 21, // Figma: leading-[21px]로 오버라이드
    color: Colors.black[500],
  },

  // 친구 초대하기 버튼 래퍼
  inviteButtonWrapper: {
    marginVertical: 20,
  },

  // 프로그래스바
  progressBarContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm, // Figma: gap-[8px]
  },

  progressBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  progressBarLabel: {
    ...Typography.caption.caption1, // Figma: 14px, lineHeight: 21px
    color: Colors.black[500],
  },

  progressBarText: {
    ...Typography.caption.caption1, // Figma: 14px, lineHeight: 21px
    color: Colors.black[500],
  },

  progressBarWrapper: {
    width: '100%',
    height: 8, // Figma: h-[8px]
    backgroundColor: Colors.whiteGrey[500], // Figma: #e5e5e5
    borderWidth: 1,
    borderColor: Colors.black[500], // Figma: #0a0a0a
    borderRadius: 9999, // Figma: rounded-full
    overflow: 'hidden',
    padding: 1, // 내부 padding으로 fill의 높이 조정
  },

  progressBarFill: {
    height: 6, // Figma: h-[6px] (8px - padding 1px * 2)
    backgroundColor: Colors.black[500], // Figma: #0a0a0a
    borderRadius: 9999,
    minWidth: 0, // 최소 너비 0으로 설정하여 작은 값도 표시 가능
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

  participantCardMe: {
    borderWidth: 1,
    borderColor: Colors.black[500],
    borderRadius: 16,
  },

  participantCardOther: {
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
    overflow: 'hidden',
  },

  avatarActive: {
    borderColor: Colors.lightBlack[500],
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
    borderRadius: 12,
    backgroundColor: Colors.white[50],
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    borderColor: Colors.darkGrey[500],
  },

  checkboxInactive: {
    borderColor: Colors.grey[200],
  },

  checkboxChecked: {
    backgroundColor: Colors.white[50],
    borderColor: Colors.darkGrey[500],
    borderWidth: 1,
  },

  checkboxCheckmark: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '700',
    color: Colors.green[500],
    includeFontPadding: false,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  deadlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 중앙정렬
    gap: Spacing.sm,
    minWidth: 300, // 전체 컨테이너 고정 너비로 떨림 방지
  },

  deadlineIcon: {
    width: 16,
    height: 16,
  },

  deadlineTextContainer: {
    gap: 4,
    minWidth: 240, // 텍스트 길이 변경 시 레이아웃 떨림 방지
    alignItems: 'center', // 중앙정렬
  },

  deadlineText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.150390625,
    color: Colors.grey[500],
    fontVariant: ['tabular-nums'], // 숫자를 고정 너비로 표시 (떨림 방지)
  },

  autoSubmitHint: {
    fontFamily: 'Pretendard Variable',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0,
    color: Colors.grey[400],
    textAlign: 'center',
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

  // 헤더 닫기 버튼 (캡슐보관함과 동일한 스타일)
  headerCloseButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 헤더 컨테이너
  headerContainer: {
    width: '100%',
  },

  // 헤더 내부 컨테이너
  headerInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 84,
  },

  // 헤더 제목 컨테이너
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // 헤더 제목 텍스트
  headerTitle: {
    ...Typography.header.h1,
    color: Colors.black[500],
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 26.4,
  },

  // 헤더 하단 보더
  headerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey[200],
  },
});
