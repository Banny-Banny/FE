/**
 * hooks/useCreateOrder.ts
 * 타임캡슐 주문 생성 Hook
 */

import { useCallback, useState } from 'react';
import { createOrder, mapFormToOrderRequest } from '../api/orders';
import type { CreateOrderResponse } from '../api/types/order';
import type { StepInfoFormData } from '../types';

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

  const submitOrder = useCallback(async (formData: StepInfoFormData): Promise<CreateOrderResponse> => {
    try {
      setIsLoading(true);
      setError(null);

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
  }, []);

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
