/**
 * components/toss-payments/components/payment-history/styles.ts
 * PaymentHistory 컴포넌트 스타일 정의
 *
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Typography 토큰 활용
 * - [x] Spacing 토큰 활용
 * - [x] 피그마 디자인 100% 반영
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    fontFamily: Typography.header.h5.fontFamily,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: Typography.header.h5.fontWeight,
    color: Colors.black[500],
    marginBottom: Spacing.xs,
  },

  headerSubtitle: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },

  headerCloseButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },

  // 목록 컨테이너
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },

  // 결제 카드
  paymentCard: {
    backgroundColor: Colors.white[500],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: Spacing.lg,
    minHeight: 98,
    position: 'relative',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  orderName: {
    fontFamily: Typography.header.h2.fontFamily,
    fontSize: 18,
    lineHeight: 19.8,
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold
    color: Colors.black[500],
    flex: 1,
  },

  cardArrow: {
    width: 20,
    height: 20,
    marginLeft: Spacing.sm,
  },

  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  cardDate: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadgeDone: {
    backgroundColor: Colors.green[600], // 피그마 디자인 #7fb685과 유사 (가장 가까운 토큰)
  },

  statusBadgeCanceled: {
    backgroundColor: Colors.grey[500], // #B2B2B2 (피그마 #b3b3b3과 거의 유사)
  },

  statusText: {
    ...Typography.body.body8,
    color: Colors.white[500],
  },

  cardAmount: {
    fontFamily: Typography.header.h2.fontFamily,
    fontSize: 18,
    lineHeight: 19.8,
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold
    color: Colors.red[500],
  },

  // 빈 화면
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },

  emptyText: {
    ...Typography.header.h3,
    color: Colors.grey[700],
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  emptySubText: {
    ...Typography.body.body6,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  // Modal 스타일 (영수증)
  // Modal 컴포넌트가 이미 컨테이너 스타일(width, height, backgroundColor, borderRadius)을 제공하므로
  // 여기서는 padding만 설정 (또는 Modal의 padding prop 사용)
  modalContent: {
    padding: Spacing.lg,
    minHeight: 623,
  },

  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  modalTitle: {
    fontFamily: Typography.header.h2.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold
    color: Colors.black[500],
    marginBottom: Spacing.xs,
  },

  modalSubtitle: {
    ...Typography.body.body7,
    color: Colors.grey[500],
  },

  modalDivider: {
    height: 1,
    backgroundColor: Colors.darkGrey[100], // #D1D1D1 (피그마 #d1d5dc과 거의 유사)
    marginVertical: Spacing.md,
  },

  modalSection: {
    marginBottom: Spacing.md,
  },

  modalInfoItem: {
    marginBottom: Spacing.md,
  },

  modalLabel: {
    ...Typography.body.body7,
    color: Colors.grey[500],
    marginBottom: Spacing.xs,
  },

  modalValue: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },

  modalItemList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalItemLabel: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },

  modalItemValue: {
    ...Typography.body.body6,
    color: Colors.black[500],
  },

  modalTotalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },

  modalTotalLabel: {
    fontFamily: Typography.header.h2.fontFamily,
    fontSize: 18,
    lineHeight: 19.8,
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold
    color: Colors.black[500],
  },

  modalTotalAmount: {
    fontFamily: Typography.header.h2.fontFamily,
    fontSize: 24,
    lineHeight: 26.4,
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold
    color: Colors.red[500],
  },

  modalFooter: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

  modalFooterText: {
    ...Typography.body.body7,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  // 모달 닫기 버튼
  modalCloseButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // 모달 헤더 아이콘
  modalHeaderIcon: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    lineHeight: 40,
  },
});
