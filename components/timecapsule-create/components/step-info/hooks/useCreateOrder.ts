/**
 * hooks/useCreateOrder.ts
 * 타임캡슐 주문 생성 Hook
 */

import { useCallback, useState } from 'react';
import { createOrder, mapFormToOrderRequest } from '../api/orders';
import type { CreateOrderResponse } from '../api/types/order';
import type { StepInfoFormData } from '../types';

// ============================================
// 개발 모드 설정
// ============================================

/**
 * 개발 모드에서 인증 체크 우회 (백엔드 연결 없이 개발 시 true로 설정)
 * true로 설정하면 인증 체크를 건너뛰고 Mock 데이터로 다음 단계로 진행합니다.
 */
const SKIP_AUTH_CHECK = __DEV__ && false;

// ============================================
// Hook 반환 타입
// ============================================

interface UseCreateOrderReturn {
  isLoading: boolean;
  error: string | null;
  orderData: CreateOrderResponse | null;
  submitOrder: (formData: StepInfoFormData) => Promise<CreateOrderResponse>;
  clearError: () => void;
}

export const useCreateOrder = (): UseCreateOrderReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  const submitOrder = useCallback(
    async (formData: StepInfoFormData): Promise<CreateOrderResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        // ============================================
        // 개발 모드: 인증 체크 우회
        // ============================================
        if (SKIP_AUTH_CHECK) {
          // Mock 데이터 반환 (실제 백엔드 응답 형식과 동일하게)
          const mockResponse: CreateOrderResponse = {
            order_id: 'mock-order-' + Date.now(),
            total_amount: 15000, // Mock 금액
            customer_key: 'mock-customer-key',
            created_at: new Date().toISOString(),
          };

          // 로딩 상태 시뮬레이션 (500ms 대기)
          await new Promise((resolve) => setTimeout(resolve, 500));

          setOrderData(mockResponse);
          return mockResponse;
        }

        // ============================================
        // 프로덕션 모드: 실제 API 호출
        // ============================================

        const requestData = mapFormToOrderRequest(formData);
        const response = await createOrder(requestData);

        setOrderData(response);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '주문 생성에 실패했습니다';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    orderData,
    submitOrder,
    clearError,
  };
};
