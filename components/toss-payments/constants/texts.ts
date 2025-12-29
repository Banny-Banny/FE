/**
 * constants/texts.ts
 * 결제 화면 텍스트 상수
 */

export const TEXTS = {
  header: {
    title: '결제하기',
  },
  orderSummary: {
    title: '주문 상품',
    participantLabel: '참여 인원',
    totalLabel: '합계',
  },
  agreements: {
    allAgree: '전체 동의',
    items: ['이용약관 동의 (필수)', '개인정보 처리방침 동의 (필수)', '결제 진행 동의 (필수)'],
  },
  footer: {
    submitButton: '토스페이먼츠로 결제하기',
  },
  alerts: {
    agreementRequired: '모든 약관에 동의해주세요',
  },
} as const;

