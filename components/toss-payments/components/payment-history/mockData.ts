/**
 * components/toss-payments/components/payment-history/mockData.ts
 * 결제 내역 목데이터
 *
 * TODO: 백엔드 API 완성 후 삭제 예정
 */

import type { PaymentListResponse, PaymentDetailData } from './types';

/**
 * 결제 목록 목데이터
 * 피그마 디자인 예시 데이터 기반
 */
export const MOCK_PAYMENT_LIST: PaymentListResponse = {
  payments: [
    {
      paymentKey: 'tviva20250110abc123',
      orderNo: 'ORDER20250110001',
      orderName: '우리의 2024 여름',
      tossStatus: 'DONE',
      method: '카드',
      amount: 15000,
      approvedAt: '2024-12-01T14:30:00Z',
      receiptUrl: 'https://example.com/receipt/1',
    },
    {
      paymentKey: 'tviva20250109xyz789',
      orderNo: 'ORDER20250109005',
      orderName: '졸업 여행',
      tossStatus: 'DONE',
      method: '카드',
      amount: 20000,
      approvedAt: '2024-11-15T10:15:00Z',
      receiptUrl: 'https://example.com/receipt/2',
    },
    {
      paymentKey: 'tviva20250108def456',
      orderNo: 'ORDER20250108003',
      orderName: '생일 파티',
      tossStatus: 'DONE',
      method: '카드',
      amount: 10000,
      approvedAt: '2024-10-20T16:20:00Z',
      receiptUrl: 'https://example.com/receipt/3',
    },
    {
      paymentKey: 'tviva20250107ghi789',
      orderNo: 'ORDER20250107002',
      orderName: '첫 데이트',
      tossStatus: 'CANCELED',
      method: '카드',
      amount: 15000,
      approvedAt: '2025-01-07T11:45:00Z',
      receiptUrl: 'https://example.com/receipt/4',
    },
    {
      paymentKey: 'tviva20250106jkl012',
      orderNo: 'ORDER20250106008',
      orderName: '여름 추억',
      tossStatus: 'DONE',
      method: '카드',
      amount: 12000,
      approvedAt: '2025-01-06T09:30:00Z',
      receiptUrl: 'https://example.com/receipt/5',
    },
    {
      paymentKey: 'tviva20250105mno345',
      orderNo: 'ORDER20250105004',
      orderName: '졸업식',
      tossStatus: 'DONE',
      method: '카드',
      amount: 8000,
      approvedAt: '2025-01-05T13:50:00Z',
      receiptUrl: 'https://example.com/receipt/6',
    },
  ],
  pagination: {
    total: 6,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

/**
 * 결제 상세 목데이터 맵
 * orderNo를 키로 사용
 */
export const MOCK_PAYMENT_DETAILS: Record<string, PaymentDetailData> = {
  ORDER20250110001: {
    payment: {
      paymentKey: 'tviva20250110abc123',
      orderNo: 'ORDER20250110001',
      tossStatus: 'DONE',
      method: '카드',
      currency: 'KRW',
      amount: 12000,
      approvedAt: '2025-01-10T14:30:00Z',
      receiptUrl: 'https://example.com/receipt/1',
    },
    cancels: [],
  },
  ORDER20250109005: {
    payment: {
      paymentKey: 'tviva20250109xyz789',
      orderNo: 'ORDER20250109005',
      tossStatus: 'DONE',
      method: '카드',
      currency: 'KRW',
      amount: 8000,
      approvedAt: '2025-01-09T10:15:00Z',
      receiptUrl: 'https://example.com/receipt/2',
    },
    cancels: [],
  },
  ORDER20250108003: {
    payment: {
      paymentKey: 'tviva20250108def456',
      orderNo: 'ORDER20250108003',
      tossStatus: 'CANCELED',
      method: '카드',
      currency: 'KRW',
      amount: 15000,
      approvedAt: '2025-01-08T16:20:00Z',
      receiptUrl: 'https://example.com/receipt/3',
    },
    cancels: [
      {
        transactionKey: 'cancel_20250108_001',
        cancelAmount: 15000,
        cancelReason: '단순 변심',
        cancelStatus: 'DONE',
        canceledAt: '2025-01-08T17:00:00Z',
      },
    ],
  },
  ORDER20250107002: {
    payment: {
      paymentKey: 'tviva20250107ghi789',
      orderNo: 'ORDER20250107002',
      tossStatus: 'DONE',
      method: '계좌이체',
      currency: 'KRW',
      amount: 20000,
      approvedAt: '2025-01-07T11:45:00Z',
      receiptUrl: 'https://example.com/receipt/4',
    },
    cancels: [],
  },
  ORDER20250106008: {
    payment: {
      paymentKey: 'tviva20250106jkl012',
      orderNo: 'ORDER20250106008',
      tossStatus: 'DONE',
      method: '카드',
      currency: 'KRW',
      amount: 10000,
      approvedAt: '2025-01-06T09:30:00Z',
      receiptUrl: 'https://example.com/receipt/5',
    },
    cancels: [],
  },
  ORDER20250105004: {
    payment: {
      paymentKey: 'tviva20250105mno345',
      orderNo: 'ORDER20250105004',
      tossStatus: 'CANCELED',
      method: '카드',
      currency: 'KRW',
      amount: 5000,
      approvedAt: '2025-01-05T13:50:00Z',
      receiptUrl: 'https://example.com/receipt/6',
    },
    cancels: [
      {
        transactionKey: 'cancel_20250105_001',
        cancelAmount: 5000,
        cancelReason: '상품 불량',
        cancelStatus: 'DONE',
        canceledAt: '2025-01-05T14:30:00Z',
      },
    ],
  },
};
