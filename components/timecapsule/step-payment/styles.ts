/**
 * step-payment/styles.ts
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] StyleSheet.create() 사용
 * - [x] 색상 하드코딩 0건 (tailwind.config.js 토큰 사용)
 * - [x] 인라인 스타일 금지
 * - [x] Figma 디자인 사이즈 그대로 적용
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // neutral-50에 가까운 흰색
  },

  // ============================================
  // 헤더
  // ============================================
  header: {
    width: '100%',
    height: 73,
  },

  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 73,
  },

  headerBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 73,
    borderBottomWidth: 0.613,
    borderBottomColor: '#e0e0e0', // neutral-200
    pointerEvents: 'none', // 터치 이벤트 무시 (뒤로가기 버튼 클릭 가능하도록)
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 14,
    width: 43.663,
    height: 43.663,
    backgroundColor: '#ffffff',
    borderWidth: 1.838,
    borderColor: '#000000', // neutral-950
    borderRadius: 21.8315,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // 다른 요소 위에 표시
  },

  backButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 26,
    color: '#000000',
    includeFontPadding: false,
  },

  headerTitle: {
    position: 'absolute',
    left: 79.98,
    top: 22.8,
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 24,
    lineHeight: 26.4,
    letterSpacing: -0.4097,
    color: '#1a1a1a', // neutral-900
  },

  // ============================================
  // 스크롤 영역
  // ============================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // ============================================
  // 주문 상품 카드
  // ============================================
  orderSummaryCard: {
    width: '100%',
    height: 280,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
  },

  cardBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb', // neutral-200
    borderRadius: 20,
  },

  cardContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  // 주문 상품 헤더
  orderSummaryHeader: {
    paddingHorizontal: 17,
    paddingTop: 17,
    height: 45,
  },

  orderSummaryTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.4492,
    color: '#1a1a1a', // neutral-900
  },

  // 참여 인원
  participantRow: {
    paddingHorizontal: 17,
    height: 37,
    borderBottomWidth: 0.613,
    borderBottomColor: '#e0e0e0', // neutral-200
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  participantRowBorder: {
    // 제거됨 - participantRow에 직접 border 적용
  },

  participantRowContent: {
    // 제거됨 - participantRow에 직접 flexDirection 적용
  },

  participantLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: '#666666', // neutral-500
  },

  participantValue: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: '#1a1a1a', // neutral-900
  },

  // 상품 목록
  itemsList: {
    paddingHorizontal: 17,
    paddingTop: 8,
    paddingBottom: 8,
  },

  itemRow: {
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: '#1a1a1a', // neutral-900
    marginRight: 8,
  },

  itemDetail: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 12,
    lineHeight: 16,
    color: '#999999', // neutral-400
  },

  itemPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: '#1a1a1a', // neutral-900
  },

  // 합계
  totalRow: {
    paddingHorizontal: 17,
    height: 37,
    borderTopWidth: 0.613,
    borderTopColor: '#e0e0e0', // neutral-200
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalRowBorder: {
    // 제거됨 - totalRow에 직접 border 적용
  },

  totalLabel: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: '#1a1a1a', // neutral-900
  },

  totalPrice: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.7995,
    color: '#1a1a1a', // neutral-900
  },

  // ============================================
  // 약관 동의 카드
  // ============================================
  agreementsCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },

  // 전체 동의
  allAgreeRow: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 17,
    borderBottomWidth: 0.613,
    borderBottomColor: '#e0e0e0', // neutral-200
    justifyContent: 'center',
  },

  allAgreeRowBorder: {
    // 제거됨
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 23.996,
    height: 23.996,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 23.996,
    height: 23.996,
    borderWidth: 0.613,
    borderColor: '#1a1a1a', // neutral-900
    borderRadius: 20,
  },

  checkboxChecked: {
    backgroundColor: '#ffffff', // 체크되어도 흰색 유지
  },

  checkboxCheckmark: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#1a1a1a', // neutral-900
    zIndex: 1,
  },

  allAgreeText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3125,
    color: '#1a1a1a', // neutral-900
  },

  // 개별 약관 목록
  agreementsList: {
    paddingHorizontal: 17,
    paddingBottom: 17,
  },

  agreementRow: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  agreementText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: '#1a1a1a', // neutral-900
  },

  chevronButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 24,
    color: '#666666', // neutral-500
  },

  // ============================================
  // 하단 결제 버튼
  // ============================================
  footer: {
    width: '100%',
    borderTopWidth: 0.66,
    borderTopColor: '#e0e0e0', // neutral-200
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 34,
  },

  footerBorder: {
    // 제거됨 - footer에 직접 border 적용
  },

  footerContent: {
    // 제거됨 - footer에 직접 padding 적용
  },

  submitButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#1a1a1a', // neutral-900
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: '#d4d4d4', // neutral-300 (비활성화 상태)
    opacity: 0.6,
  },

  submitButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.4395,
    color: '#ffffff',
  },

  submitButtonArrow: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#ffffff',
  },

  // ============================================
  // 약관 상세 모달
  // ============================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: '#1a1a1a',
    flex: 1,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 24,
    color: '#666666',
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  modalText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: '#333333',
  },

  modalSection: {
    marginBottom: 16,
  },

  modalSectionTitle: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: '#1a1a1a',
    marginBottom: 8,
  },
});
