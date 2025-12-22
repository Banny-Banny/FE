/**
 * step-info/styles.ts
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] tailwind.config.js 토큰 기반 색상 사용
 * - [x] StyleSheet.create() 방식 사용
 * - [x] 인라인 스타일 금지 준수
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[100],
  },

  // ============================================
  // Header
  // ============================================
  header: {
    width: '100%',
    height: 64,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },

  headerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey[200],
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backButtonText: {
    ...Typography.body.body4,
    fontSize: 20,
    color: Colors.black[500],
    includeFontPadding: false,
  },

  headerTitle: {
    ...Typography.header.h1,
    color: Colors.darkGrey[900],
  },
  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  // ============================================
  // Section Common
  // ============================================
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  sectionHeaderWithSub: {
    height: 43,
  },
  sectionLabelContainer: {
    gap: 4,
  },
  sectionSubLabel: {
    ...Typography.body.body10,
    color: Colors.black[500],
  },
  sectionLabel: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
  },
  sectionLabelBlack: {
    color: Colors.black[500],
  },
  sectionPrice: {
    ...Typography.body.body10,
    color: Colors.red[500],
  },
  sectionPriceMuted: {
    color: Colors.grey[400],
  },

  // ============================================
  // Capsule Name Section
  // ============================================
  capsuleNameSection: {
    gap: 24,
  },
  inputContainer: {
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    ...Typography.body.body4,
    color: Colors.black[500],
  },
  inputPlaceholder: {
    ...Typography.body.body4,
    color: Colors.grey[400],
  },

  // ============================================
  // Date Selection Section
  // ============================================
  dateSelectionSection: {
    gap: 16,
  },
  openDateText: {
    ...Typography.body.body9,
    fontSize: 13,
    lineHeight: 19.5,
    color: Colors.grey[700],
    marginTop: 4,
    paddingHorizontal: 4,
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateButton: {
    width: '48%',
    backgroundColor: Colors.white[100],
    borderWidth: 2,
    borderColor: Colors.grey[200],
    borderRadius: 16,
    paddingTop: 18,
    paddingBottom: 2,
    paddingHorizontal: 18,
    height: 80,
    gap: 4,
  },
  dateButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.black[500],
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dateButtonTitle: {
    ...Typography.header.h3,
    color: Colors.darkGrey[900],
  },
  dateButtonTitleSelected: {
    color: Colors.black[500],
  },
  dateButtonPrice: {
    ...Typography.body.body3,
    fontSize: 10,
    lineHeight: 15,
    color: Colors.grey[500],
  },
  dateButtonPriceSelected: {
    color: Colors.grey[500],
  },

  // ============================================
  // Stepper Section
  // ============================================
  stepperSection: {
    marginBottom: 24,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
  },
  stepperLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperLabelColumn: {
    gap: 4,
  },
  stepperLabel: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },
  stepperSubLabel: {
    ...Typography.body.body3,
    fontSize: 11,
    lineHeight: 20,
    color: Colors.grey[500],
  },
  stepperHint: {
    ...Typography.body.body6,
    color: Colors.grey[600],
    textAlign: 'right',
    marginTop: 6,
  },
  stepperSectionPrice: {
    ...Typography.body.body10,
    color: Colors.red[500],
    textAlign: 'right',
    marginBottom: 16,
  },
  stepperContainer: {
    backgroundColor: Colors.white[100],
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 27,

    height: 72,
    minWidth: 174,
  },
  stepperButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.whiteGrey[50],
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonText: {
    ...Typography.header.h5,
    fontSize: 28,
    lineHeight: 28,
    color: Colors.black[500],
  },
  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperValue: {
    ...Typography.header.h5,
    fontSize: 28,
    lineHeight: 36,
    color: Colors.black[500],
  },
  stepperUnit: {
    ...Typography.body.body1,
    color: Colors.grey[600],
  },

  // ============================================
  // Additional Options Section
  // ============================================
  additionalOptionsSection: {
    gap: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.white[100],
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
    color: Colors.darkGrey[900],
    textAlign: 'center',
  },
  optionPrice: {
    ...Typography.body.body6,
    color: Colors.grey[500],
    textAlign: 'center',
  },

  // ============================================
  // Payment Section (총 결제금액 및 결제 버튼)
  // ============================================
  paymentSection: {
    marginTop: 66,
    gap: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
  },
  totalLabel: {
    ...Typography.body.body1,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.black[500],
  },
  totalPrice: {
    ...Typography.header.h1,
    fontSize: 24,
    lineHeight: 32,
    color: Colors.red[500],
  },
  submitButton: {
    backgroundColor: Colors.darkGrey[900],
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  submitButtonText: {
    ...Typography.caption.button,
    color: Colors.white[50],
    textAlign: 'center',
  },

  // ============================================
  // Calendar Bottom Sheet
  // ============================================
  calendarBottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // Colors.black[500] with 50% opacity
    justifyContent: 'flex-end',
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
    borderWidth: 2,
    borderColor: Colors.darkGrey[900],
    backgroundColor: Colors.whiteGrey[100],
    shadowColor: Colors.darkGrey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitleSelected: {
    color: Colors.black[500],
  },
  optionPriceSelected: {
    color: Colors.grey[600],
  },
});
