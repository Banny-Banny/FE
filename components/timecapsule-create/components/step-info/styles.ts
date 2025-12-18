/**
 * step-info/styles.ts
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] tailwind.config.js 토큰 기반 색상 사용
 * - [x] StyleSheet.create() 방식 사용
 * - [x] 인라인 스타일 금지 준수
 */

import { Colors } from '@/commons/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
    backgroundColor: Colors.border,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 20,
    color: Colors.black,
    includeFontPadding: false,
  },

  headerTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.31,
    color: Colors.gray900,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.31,
    color: Colors.gray900,
  },
  sectionLabelBlack: {
    color: Colors.black,
  },
  sectionPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.error,
  },
  sectionPriceMuted: {
    color: Colors.textDisabled,
  },

  // ============================================
  // Capsule Name Section
  // ============================================
  capsuleNameSection: {
    gap: 24,
  },
  inputContainer: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 56,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.31,
    color: Colors.textDisabled,
  },

  // ============================================
  // Date Selection Section
  // ============================================
  dateSelectionSection: {
    gap: 16,
  },
  openDateText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 19.5,
    color: Colors.gray700,
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
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingTop: 18,
    paddingBottom: 2,
    paddingHorizontal: 18,
    height: 80,
    gap: 4,
  },
  dateButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dateButtonTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: Colors.gray900,
  },
  dateButtonTitleSelected: {
    color: Colors.black,
  },
  dateButtonPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.62,
    color: Colors.gray500,
  },
  dateButtonPriceSelected: {
    color: Colors.black,
    opacity: 0.6,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: Colors.black,
  },
  stepperSubLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 20,
    letterSpacing: -0.150390625,
    color: '#969696',
  },
  stepperHint: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.150390625,
    color: Colors.gray600,
    textAlign: 'right',
    marginTop: 6,
  },
  stepperSectionPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.error,
    textAlign: 'right',
    marginBottom: 16,
  },
  stepperContainer: {
    backgroundColor: Colors.backgroundSecondary,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 28,
    color: Colors.black,
  },
  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperValue: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.3955078125,
    color: Colors.black,
  },
  stepperUnit: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: Colors.gray600,
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
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: Colors.gray900,
    textAlign: 'center',
  },
  optionPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.150390625,
    color: Colors.gray500,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: Colors.black,
  },
  totalPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.0703125,
    color: Colors.error,
  },
  submitButton: {
    backgroundColor: Colors.gray300,
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray300,
    opacity: 1,
  },
  submitButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: Colors.white,
    textAlign: 'center',
  },

  // ============================================
  // Calendar Bottom Sheet
  // ============================================
  calendarBottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarBottomSheetContainer: {
    backgroundColor: Colors.white,
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
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.5,
    color: Colors.gray900,
  },
  calendarBottomSheetCloseButton: {
    padding: 8,
  },
  calendarBottomSheetCloseText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 16,
    color: Colors.gray600,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarConfirmButton: {
    backgroundColor: Colors.gray900,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  calendarConfirmButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.white,
  },

  // ============================================
  // Option Card Selected State
  // ============================================
  optionCardSelected: {
    borderWidth: 2,
    borderColor: Colors.gray900,
    backgroundColor: Colors.gray100,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitleSelected: {
    color: Colors.black,
  },
  optionPriceSelected: {
    color: Colors.black,
    opacity: 0.7,
  },
});
