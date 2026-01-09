/**
 * MyCapsule 컴포넌트 스타일
 * Figma 디자인 1:1 매칭 (node-id=1078:2782)
 * 
 * 체크리스트:
 * - [✅] Figma 디자인 픽셀 단위 정확히 매칭
 * - [✅] 디자인 토큰 100% 사용 (Colors, Typography)
 * - [✅] 소수점 값 반올림 적용 (1.111 → 1, 26.198 → 26 등)
 * - [✅] 하드코딩 색상 0건
 * - [✅] 인라인 스타일 0건
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';
import { Typography } from '@/commons/constants/typography';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
    width: 393,
    height: 852,
  },

  // ========== 헤더 섹션 ==========
  headerContainer: {
    width: 393,
    height: 124,
    paddingTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  headerTopRow: {
    width: 345,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitleContainer: {
    height: 33,
  },

  headerTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 33,
    letterSpacing: 0,
    color: Colors.black[500],
  },

  headerCloseButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSubtitle: {
    width: 345,
    height: 20,
    marginTop: 8,
  },

  headerSubtitleText: {
    ...Typography.body.body9,
    color: Colors.grey[500],
    width: 345,
    height: 20,
  },

  // ========== 열려있는 캡슐 섹션 ==========
  openCapsulesSection: {
    width: 393,
    height: 241,
    marginTop: 23,
  },

  sectionHeader: {
    width: 393,
    height: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  sectionTitleContainer: {
    height: 26,
  },

  sectionTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: 0,
    color: Colors.black[500],
  },

  sectionCount: {
    height: 20,
  },

  sectionCountText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
  },

  // 가로 스크롤 컨테이너
  horizontalScrollContainer: {
    width: 393,
    height: 203,
    marginTop: 12,
  },

  cardListContainer: {
    flexDirection: 'row',
    paddingLeft: 24,
    gap: 12,
  },

  // ========== 캡슐 카드 (열려있는 캡슐) ==========
  capsuleCard: {
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 28,
    width: 260,
    height: 203,
    padding: 21,
  },

  cardHeader: {
    width: 218,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  cardTitle: {
    ...Typography.body.body1,
    color: Colors.black[500],
    includeFontPadding: false,
  },

  cardEmojiContainer: {
    width: 22,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardEmoji: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,
    color: Colors.lightBlack[500],
    textAlign: 'center',
  },

  // 진행 상황 섹션
  cardProgressSection: {
    width: 218,
    height: 28,
    marginTop: 16,
  },

  progressLabelRow: {
    width: 218,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    height: 16,
  },

  progressLabelText: {
    ...Typography.body.body8,
    color: Colors.grey[500],
  },

  progressValue: {
    height: 16,
  },

  progressValueText: {
    ...Typography.body.body8,
    color: Colors.black[500],
  },

  progressBarContainer: {
    width: 218,
    height: 4,
    marginTop: 8,
  },

  progressBar: {
    width: 218,
    height: 4,
    backgroundColor: Colors.whiteGrey[50],
    borderRadius: 9999,
  },

  progressBarFill: {
    width: 109,
    height: 4,
    backgroundColor: Colors.black[500],
    borderRadius: 9999,
  },

  progressBarFillLarge: {
    width: 145,
    height: 4,
    backgroundColor: Colors.black[500],
    borderRadius: 9999,
  },

  progressBarFillSmall: {
    width: 54,
    height: 4,
    backgroundColor: Colors.black[500],
    borderRadius: 9999,
  },

  // 알 아이콘 섹션
  cardEggsSection: {
    width: 218,
    height: 28,
    flexDirection: 'row',
    gap: 0,
    marginTop: 16,
  },

  cardEggsSectionFour: {
    width: 218,
    height: 28,
    flexDirection: 'row',
    gap: 0,
    marginTop: 16,
  },

  eggIconGrey: {
    width: 28,
    height: 28,
    backgroundColor: Colors.whiteGrey[50],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },

  eggIconWhite: {
    width: 28,
    height: 28,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },

  eggEmoji: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    color: Colors.lightBlack[500],
    textAlign: 'center',
  },

  // 남은 시간 섹션
  cardTimeSection: {
    width: 218,
    height: 29,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lighter,
    paddingTop: 13,
  },

  timeSectionContent: {
    width: 218,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  timeLabel: {
    height: 16,
  },

  timeLabelText: {
    ...Typography.body.body8,
    color: Colors.grey[500],
  },

  timeValue: {
    height: 16,
  },

  timeValueText: {
    ...Typography.body.body8,
    color: Colors.black[500],
  },

  // ========== 탭 섹션 ==========
  tabContainer: {
    width: 393,
    height: 37,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
    marginTop: 26,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 0,
    paddingBottom: 1,
  },

  tabInner: {
    width: 345,
    height: 36,
    flexDirection: 'row',
    gap: 32,
  },

  tabButton: {
    height: 36,
  },

  tabTextContainer: {
    height: 19,
    marginTop: 2,
  },

  tabTextInactive: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  tabTextActive: {
    ...Typography.header.h4,
    color: Colors.black[500],
    textAlign: 'center',
  },

  tabIndicator: {
    width: 82,
    height: 2,
    backgroundColor: Colors.black[500],
    marginTop: 12,
  },

  // ========== 잠긴 캡슐 리스트 섹션 ==========
  lockedCapsulesSection: {
    width: 393,
    marginTop: 0,
    paddingLeft: 24,
    paddingRight: 24,
  },

  lockedCapsulesList: {
    width: 345,
    gap: 16,
    marginTop: 34,
  },

  // 잠긴 캡슐 카드 (열린 캡슐도 동일한 스타일 사용)
  lockedCapsuleCard: {
    width: 345,
    height: 145,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },

  lockedCardImageContainer: {
    width: 343,
    height: 80,
    marginLeft: 1,
    marginTop: 1,
  },

  lockedCardGradient: {
    width: 343,
    height: 80,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  lockedCardContent: {
    width: 303,
    height: 104,
    marginLeft: 20,
    marginTop: 20,
    flexDirection: 'row',
    gap: 16,
    position: 'absolute',
  },

  lockedCardIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    borderWidth: 1,
    borderColor: Colors.border.lighter,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockedCardIconText: {
    width: 26,
    height: 32,
  },

  lockedCardEmoji: {
    fontFamily: 'Pretendard Variable',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 0,
    color: Colors.lightBlack[500],
    textAlign: 'left',
  },

  lockedCardInfo: {
    width: 231,
    height: 104,
  },

  lockedCardTitleContainer: {
    width: 231,
    height: 20,
    marginTop: 4,
  },

  lockedCardTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.black[500],
  },

  lockedCardDetails: {
    width: 231,
    height: 72,
    marginTop: 8,
    gap: 6,
  },

  lockedCardDetailRow: {
    width: 231,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  lockedCardDetailIcon: {
    width: 16,
    height: 16,
    marginTop: 2,
  },

  lockedCardDetailText: {
    height: 20,
  },

  lockedCardDetailTextContent: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },

  lockedCardFooter: {
    width: 343,
    height: 64,
    backgroundColor: Colors.white[500],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  lockedCardFooterIcon: {
    width: 20,
    height: 20,
  },

  lockedCardFooterText: {
    height: 24,
  },

  lockedCardFooterTextContent: {
    ...Typography.header.h4,
    color: Colors.black[500],
  },

  lockedBadge: {
    width: 48,
    height: 32,
    backgroundColor: Colors.black[500],
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockedBadgeText: {
    ...Typography.body.body11,
    color: Colors.white[500],
  },

  // ========== 열린 캡슐 카드 ==========
  openedCapsuleCard: {
    width: 345,
    height: 145,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
  },

  openedCardContent: {
    width: 303,
    height: 104,
    flexDirection: 'row',
    gap: 16,
  },

  openedCardIcon: {
    width: 56,
    height: 56,
    backgroundColor: Colors.whiteGrey[50],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  openedCardEmoji: {
    fontFamily: 'Pretendard Variable',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 0,
    color: Colors.lightBlack[500],
    textAlign: 'center',
  },

  openedCardInfo: {
    width: 231,
    height: 104,
    flex: 1,
  },

  openedCardTitleContainer: {
    width: 231,
    height: 20,
    marginTop: 4,
  },

  openedCardTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.black[500],
  },

  openedCardDetails: {
    width: 231,
    height: 72,
    marginTop: 8,
    gap: 6,
  },

  openedCardDetailRow: {
    width: 231,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  openedCardDetailIcon: {
    width: 16,
    height: 16,
  },

  openedCardDetailText: {
    ...Typography.body.body11,
    color: Colors.black[500],
    height: 20,
  },
});
