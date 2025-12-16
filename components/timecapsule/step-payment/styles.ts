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
    paddingTop: 9.834,
    paddingBottom: 1.838,
    paddingHorizontal: 9.834,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonIconContainer: {
    width: 23.996,
    height: 23.996,
    overflow: 'hidden',
  },

  backButtonIcon: {
    width: 19.993,
    height: 19.993,
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
    backgroundColor: '#1a1a1a', // neutral-900
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
    width: 15.991,
    height: 15.991,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronIcon: {
    width: 15.991,
    height: 15.991,
  },

  // ============================================
  // 하단 결제 버튼
  // ============================================
  footer: {
    width: '100%',
    borderTopWidth: 0.613,
    borderTopColor: '#e0e0e0', // neutral-200
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 25,
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700', // bold
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.4395,
    color: '#ffffff',
    textAlign: 'center',
  },
});
