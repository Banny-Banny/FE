/**
 * hooks/useCreateOrder.ts
 * 생성 시각: 2024-12-19
 * 타임캡슐 주문 생성 Hook
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { createOrder, mapFormToOrderRequest } from '@/lib/api/orders';
import type { CreateOrderResponse } from '@/lib/api/types/order';
import type { StepInfoFormData } from '../types';

// ============================================
// Hook 반환 타입
// ============================================

interface UseCreateOrderReturn {
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 주문 데이터 */
  orderData: CreateOrderResponse | null;
  /** 주문 생성 함수 */
  submitOrder: (formData: StepInfoFormData) => Promise<CreateOrderResponse>;
  /** 에러 클리어 함수 */
  clearError: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 타임캡슐 주문 생성 Hook
 * @returns 주문 생성 관련 상태 및 함수
 *
 * @example
 * const { isLoading, error, orderData, submitOrder, clearError } = useCreateOrder();
 *
 * // 주문 생성
 * try {
 *   const response = await submitOrder(formData);
 *   console.log('주문 생성 성공:', response);
 * } catch (err) {
 *   console.error('주문 생성 실패:', err);
 * }
 */
export const useCreateOrder = (): UseCreateOrderReturn => {
  // ============================================
  // 인증 정보
  // ============================================

  /** 로그인된 사용자의 토큰 */
  const { accessToken } = useAuth();

  // ============================================
  // 상태 관리
  // ============================================

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** 에러 메시지 */
  const [error, setError] = useState<string | null>(null);

  /** 주문 데이터 */
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  // ============================================
  // 주문 생성 함수
  // ============================================

  /**
   * 주문 생성 함수
   * @param formData 폼 데이터
   * @returns 주문 생성 응답
   * @throws 주문 생성 실패 시 에러
   */
  const submitOrder = useCallback(async (formData: StepInfoFormData): Promise<CreateOrderResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      // 로그인된 사용자의 토큰 확인
      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다');
      }

      // 폼 데이터를 API 요청 형식으로 변환
      const requestData = mapFormToOrderRequest(formData);

      // API 호출
      const response = await createOrder(requestData, accessToken);

      // 응답 데이터 저장
      setOrderData(response);

      return response;
    } catch (err) {
      // 에러 처리
      const errorMessage =
        err instanceof Error ? err.message : '주문 생성에 실패했습니다';

      setError(errorMessage);
      console.error('주문 생성 에러:', err);

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // ============================================
  // 에러 클리어 함수
  // ============================================

  /**
   * 에러 메시지 클리어
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // 반환값
  // ============================================

  return {
    isLoading,
    error,
    orderData,
    submitOrder,
    clearError,
  };
};
