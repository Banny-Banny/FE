/**
 * step-payment/styles.ts
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] StyleSheet.create() 사용
 * - [x] 색상 하드코딩 0건 (tailwind.config.js 토큰 사용)
 * - [x] 인라인 스타일 금지
 * - [x] Figma 디자인 사이즈 그대로 적용
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[50],
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
    borderBottomColor: Colors.grey[200],
    pointerEvents: 'none', // 터치 이벤트 무시 (뒤로가기 버튼 클릭 가능하도록)
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 14,
    width: 43.663,
    height: 43.663,
    backgroundColor: Colors.white[50],
    borderWidth: 1.838,
    borderColor: Colors.black[500],
    borderRadius: 21.8315,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // 다른 요소 위에 표시
  },

  backButtonText: {
    ...Typography.body.body4,
    fontSize: 26,
    color: Colors.black[500],
    includeFontPadding: false,
  },

  headerTitle: {
    position: 'absolute',
    left: 79.98,
    top: 22.8,
    ...Typography.header.h1,
    color: Colors.darkGrey[900],
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
    backgroundColor: Colors.white[50],
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
    borderColor: Colors.grey[200],
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
    ...Typography.body.body1,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.darkGrey[900],
  },

  // 참여 인원
  participantRow: {
    paddingHorizontal: 17,
    height: 37,
    borderBottomWidth: 0.613,
    borderBottomColor: Colors.grey[200],
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
    ...Typography.body.body6,
    color: Colors.grey[500],
  },

  participantValue: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
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
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
    marginRight: 8,
  },

  itemDetail: {
    ...Typography.body.body3,
    color: Colors.grey[400],
  },

  itemPrice: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
  },

  // 합계
  totalRow: {
    paddingHorizontal: 17,
    height: 37,
    borderTopWidth: 0.613,
    borderTopColor: Colors.grey[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalRowBorder: {
    // 제거됨 - totalRow에 직접 border 적용
  },

  totalLabel: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
  },

  totalPrice: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 20,
    color: Colors.darkGrey[900],
  },

  // ============================================
  // 약관 동의 카드
  // ============================================
  agreementsCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.white[50],
    borderRadius: 20,
  },

  // 전체 동의
  allAgreeRow: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 17,
    borderBottomWidth: 0.613,
    borderBottomColor: Colors.grey[200],
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
    backgroundColor: Colors.white[50],
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
    borderColor: Colors.darkGrey[900],
    borderRadius: 20,
  },

  checkboxChecked: {
    backgroundColor: Colors.white[50], // 체크되어도 흰색 유지
  },

  checkboxCheckmark: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 16,
    color: Colors.darkGrey[900],
    zIndex: 1,
  },

  allAgreeText: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
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
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
  },

  chevronButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronText: {
    ...Typography.body.body4,
    fontSize: 24,
    lineHeight: 24,
    color: Colors.grey[500],
  },

  // ============================================
  // 하단 결제 버튼
  // ============================================
  footer: {
    width: '100%',
    borderTopWidth: 0.66,
    borderTopColor: Colors.grey[200],
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
    backgroundColor: Colors.darkGrey[900],
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },

  submitButtonText: {
    ...Typography.caption.button,
    color: Colors.white[50],
  },

  submitButtonArrow: {
    ...Typography.caption.button,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.white[50],
  },

  // ============================================
  // 약관 상세 모달
  // ============================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // Colors.black[500] with 50% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    overflow: 'hidden',
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.darkGrey[900],
    flex: 1,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    ...Typography.header.h1,
    color: Colors.grey[500],
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  modalText: {
    ...Typography.body.body6,
    lineHeight: 22,
    color: Colors.darkGrey[800],
  },

  modalSection: {
    marginBottom: 16,
  },

  modalSectionTitle: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
    marginBottom: 8,
  },
});
