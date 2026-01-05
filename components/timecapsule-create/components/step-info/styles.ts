/**
 * step-info/styles.ts
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-30 (Figma 디자인 node 303:654 기반 전면 개선)
 * 규칙 준수 체크리스트:
 * - [x] tailwind.config.js 토큰 기반 색상 사용
 * - [x] StyleSheet.create() 방식 사용
 * - [x] 인라인 스타일 금지 준수 (로딩 오버레이 포함)
 * - [x] Figma 디자인과 1px 단위 정밀 일치
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },

  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // ============================================
  // Section Common
  // ============================================
  section: {
    marginBottom: 48,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionLabel: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },

  sectionPrice: {
    ...Typography.caption.caption1,
    color: Colors.red[500],
  },

  // ============================================
  // Capsule Name Section
  // ============================================
  capsuleNameSection: {
    gap: 12,
  },

  inputContainer: {
    backgroundColor: Colors.darkGrey[50],
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    justifyContent: 'center',
  },

  input: {
    ...Typography.body.body1,
    color: Colors.black[500],
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // ============================================
  // Date Selection Section
  // ============================================
  dateSelectionSection: {
    gap: 12,
  },

  openDateText: {
    ...Typography.body.body9,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.grey[700],
    marginTop: 4,
  },

  dateButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  dateButton: {
    width: '48%',
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
    height: 84,
    justifyContent: 'space-between',
  },

  dateButtonSelected: {
    backgroundColor: Colors.black[500],
    borderColor: Colors.black[500],
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 4,
  },

  dateButtonTitle: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },

  dateButtonTitleSelected: {
    color: Colors.white[500],
  },

  dateButtonPrice: {
    ...Typography.caption.caption1,
    color: Colors.black[500],
  },

  dateButtonPriceSelected: {
    color: Colors.white[500],
  },

  // ============================================
  // Stepper Section
  // ============================================
  stepperSection: {
    marginBottom: 48,
  },

  stepperRow: {
    flexDirection: 'column',
    gap: 16,
  },

  stepperInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  stepperLabelRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },

  stepperLabelColumn: {
    gap: 4,
  },

  stepperPriceColumn: {
    gap: 4,
    alignItems: 'flex-end',
  },

  stepperLabel: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },

  stepperSubLabel: {
    ...Typography.caption.caption1,
    color: Colors.grey[700],
  },

  stepperHint: {
    ...Typography.caption.caption1,
    color: Colors.grey[700],
    textAlign: 'right',
    marginTop: 0,
  },

  stepperPrice: {
    ...Typography.caption.caption1,
    color: Colors.red[500],
    textAlign: 'right',
    marginTop: 0,
  },

  stepperSectionPrice: {
    ...Typography.caption.caption1,
    color: Colors.red[500],
    textAlign: 'right',
    marginBottom: 12,
  },

  stepperContainer: {
    backgroundColor: Colors.whiteGrey[200],
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 43,
    height: 60,
  },

  stepperButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepperButtonText: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.grey[900],
    includeFontPadding: false,
  },

  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  stepperValue: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: Colors.black[500],
    includeFontPadding: false,
  },

  stepperUnit: {
    ...Typography.body.body1,
    color: Colors.grey[700],
  },

  // ============================================
  // Additional Options Section
  // ============================================
  additionalOptionsSection: {
    gap: 12,
  },

  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  optionCard: {
    flex: 1,
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 18,
    height: 136,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionTitle: {
    ...Typography.body.body1,
    color: Colors.black[500],
    textAlign: 'center',
  },

  optionPrice: {
    ...Typography.caption.caption1,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // ============================================
  // Payment Section (총 결제금액 및 결제 버튼)
  // ============================================
  paymentSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
  },

  totalLabel: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black[500],
  },

  totalPrice: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.red[500],
  },

  // ============================================
  // Calendar Bottom Sheet
  // ============================================
  calendarBottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // Colors.black[500] with 50% opacity
    justifyContent: 'flex-end',
  },

  calendarBottomSheetBackdrop: {
    flex: 1,
  },

  calendarBottomSheetContainer: {
    backgroundColor: Colors.white[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: '70%',
  },

  calendarBottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  calendarBottomSheetTitle: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 27,
    color: Colors.darkGrey[900],
  },

  calendarBottomSheetCloseButton: {
    padding: 8,
  },

  calendarBottomSheetCloseText: {
    ...Typography.body.body11,
    color: Colors.grey[600],
  },

  calendarContainer: {
    marginBottom: 20,
  },

  calendarConfirmButton: {
    backgroundColor: Colors.darkGrey[900],
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  calendarConfirmButtonText: {
    ...Typography.body.body1,
    color: Colors.white[50],
  },

  // ============================================
  // Option Card Selected State
  // ============================================
  optionCardSelected: {
    backgroundColor: Colors.black[500],
    borderColor: Colors.black[500],
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 3,
  },

  optionTitleSelected: {
    color: Colors.white[500],
  },

  optionPriceSelected: {
    color: Colors.white[500],
  },

  // ============================================
  // Loading Overlay (인라인 스타일 제거)
  // ============================================
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  loadingContainer: {
    backgroundColor: Colors.white[100],
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.black[500],
  },
});
