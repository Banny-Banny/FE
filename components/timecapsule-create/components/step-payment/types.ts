/**
 * step-payment/types.ts
 * 생성 시각: 2024-12-16
 * 타임캡슐 결제 화면 타입 정의
 */

import { CreateOrderResponse } from '../step-info/api/types/order';
import { StepInfoFormData } from '../step-info/types';

// ============================================
// 주문 항목 타입
// ============================================

/**
 * 주문 항목 타입
 */
export interface OrderItem {
  /** 항목 라벨 (예: "텍스트", "사진", "음악", "동영상") */
  label: string;
  /** 상세 계산식 (예: "2명 × 3개 × ₩500") */
  detail: string;
  /** 가격 */
  price: number;
}

// ============================================
// 주문 요약 타입
// ============================================

/**
 * 주문 요약 타입
 */
export interface OrderSummary {
  /** 참여 인원 */
  personnelCount: number;
  /** 주문 항목 목록 */
  items: OrderItem[];
  /** 총 금액 */
  totalPrice: number;
}

// ============================================
// 약관 동의 상태 타입
// ============================================

/**
 * 약관 동의 상태 타입
 */
export interface AgreementsState {
  /** 이용약관 동의 */
  terms: boolean;
  /** 개인정보 처리방침 동의 */
  privacy: boolean;
  /** 결제 진행 동의 */
  payment: boolean;
}

// ============================================
// 컴포넌트 Props 타입
// ============================================

/**
 * StepPayment 컴포넌트 Props 타입
 */
export interface StepPaymentProps {
  /** 이전 단계(step-info)에서 전달받은 폼 데이터 */
  formData: StepInfoFormData;
  /** 백엔드에서 받은 주문 데이터 */
  orderData: CreateOrderResponse;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** 결제하기 핸들러 (주문 요약 정보 전달) */
  onSubmit?: (orderSummary: OrderSummary) => void;
}

