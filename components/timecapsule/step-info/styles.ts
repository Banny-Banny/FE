/**
 * step-info/styles.ts
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] tailwind.config.js 토큰 기반 색상 사용
 * - [x] StyleSheet.create() 방식 사용
 * - [x] 인라인 스타일 금지 준수
 */

import { StyleSheet } from 'react-native';

// tailwind.config.js 토큰 기반 색상
const colors = {
  white: '#FFFFFF',
  black: '#000000',
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',
  // 피그마 디자인 색상 (tailwind 토큰과 매핑)
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6a7282',
  gray600: '#4a5565',
  gray700: '#364153',
  gray800: '#1f2937',
  gray900: '#111827',
  textMuted: '#969695',
  textDark: '#221900',
  priceRed: '#e10004',
  priceRedLight: 'rgba(196, 14, 18, 0.85)',
};

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 180,
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
    color: colors.textDark,
  },
  sectionLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: colors.gray600,
  },
  sectionLabelBlack: {
    color: colors.black,
  },
  sectionPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: colors.priceRedLight,
  },
  sectionPriceMuted: {
    color: colors.textMuted,
  },

  // ============================================
  // Capsule Name Section
  // ============================================
  capsuleNameSection: {
    gap: 24,
  },
  inputContainer: {
    backgroundColor: colors.gray50,
    borderWidth: 0.66,
    borderColor: colors.gray200,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 60,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 18,
    letterSpacing: -0.44,
    color: '#99a1af',
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
    color: colors.gray700,
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
    backgroundColor: colors.white,
    borderWidth: 0.66,
    borderColor: colors.gray200,
    borderRadius: 14,
    paddingTop: 17,
    paddingBottom: 1,
    paddingHorizontal: 17,
    height: 73,
    gap: 4,
  },
  dateButtonSelected: {
    borderWidth: 2,
    borderColor: colors.black,
    shadowColor: colors.black,
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
    color: colors.gray700,
  },
  dateButtonTitleSelected: {
    color: colors.black,
  },
  dateButtonPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.62,
    color: colors.gray500,
  },
  dateButtonPriceSelected: {
    color: colors.black,
    opacity: 0.6,
  },

  // ============================================
  // Stepper Section
  // ============================================
  stepperSection: {
    gap: 16,
  },
  stepperContainer: {
    backgroundColor: colors.gray50,
    borderWidth: 0.66,
    borderColor: colors.gray200,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 1,
    height: 56,
  },
  stepperContainerDisabled: {
    opacity: 0.5,
  },
  stepperButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.textMuted,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepperButtonIcon: {
    width: 24,
    height: 24,
  },
  stepperValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperValue: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: 0.41,
    color: colors.black,
  },
  stepperUnit: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.15,
    color: colors.gray600,
  },
  stepperHint: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.62,
    color: colors.gray500,
    textAlign: 'right',
    marginTop: 0,
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
    backgroundColor: colors.white,
    borderWidth: 0.66,
    borderColor: colors.gray200,
    borderRadius: 14,
    paddingTop: 17,
    paddingLeft: 17,
    paddingRight: 1,
    paddingBottom: 1,
    height: 113,
    gap: 8,
  },
  optionIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.gray100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 16,
    height: 16,
  },
  optionTextContainer: {
    gap: 4,
  },
  optionTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: colors.gray700,
  },
  optionPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '800',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.12,
    color: colors.gray500,
  },

  // ============================================
  // Footer Section
  // ============================================
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 0.66,
    borderTopColor: colors.gray200,
    paddingTop: 25,
    paddingHorizontal: 24,
    paddingBottom: 34,
    gap: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
  },
  totalLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: colors.gray600,
  },
  totalPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0.07,
    color: colors.priceRed,
  },
  submitButton: {
    backgroundColor: colors.black,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray300,
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.89,
    color: colors.white,
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
    backgroundColor: colors.white,
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
    color: colors.black,
  },
  calendarBottomSheetCloseButton: {
    padding: 8,
  },
  calendarBottomSheetCloseText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    fontSize: 16,
    color: colors.gray600,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarConfirmButton: {
    backgroundColor: colors.black,
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
    color: colors.white,
  },

  // ============================================
  // Option Card Selected State
  // ============================================
  optionCardSelected: {
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.gray50,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitleSelected: {
    color: colors.black,
  },
  optionPriceSelected: {
    color: colors.black,
    opacity: 0.7,
  },
});
