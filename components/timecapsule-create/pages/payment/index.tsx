/**
 * components/timecapsule-create/pages/payment/index.tsx
 * 타임캡슐 생성 - 결제 페이지 (비즈니스 로직)
 *
 * 역할:
 * - Toss Payments를 통한 결제 처리
 * - TossPayment 컴포넌트를 래핑하여 사용
 * - info 페이지에서 전달받은 orderData, formData를 route params로 수신
 * - 웹 환경에서 결제 리다이렉트 시 sessionStorage 복원
 * - 결제 완료 후 room 페이지로 이동
 */

import { Spinner } from '@/commons/components/spinner';
import TossPayment from '@/components/toss-payments';
import type { CreateOrderResponse } from '@/components/timecapsule-create/components/step-info/api/types/order';
import type { StepInfoFormData } from '@/components/timecapsule-create/components/step-info/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';

// sessionStorage 키
const STORAGE_KEYS = {
  ORDER_DATA: 'timecapsule_order_data',
  FORM_DATA: 'timecapsule_form_data',
};

/**
 * sessionStorage에서 데이터 가져오기 (웹 환경 전용)
 */
function getFromSessionStorage<T>(key: string): T | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * sessionStorage에 데이터 저장 (웹 환경 전용)
 */
function saveToSessionStorage(key: string, data: unknown): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
}

/**
 * sessionStorage에서 데이터 삭제 (웹 환경 전용)
 */
function clearSessionStorage(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
  }
}

/**
 * 타임캡슐 생성 - 결제 페이지
 */
export default function TimeCapsuleCreatePayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  /**
   * 초기 데이터 계산 (useMemo로 최적화)
   *
   * 데이터 복원 우선순위:
   * 1. route params (일반적인 경우 - info 페이지에서 전달)
   * 2. sessionStorage (웹 환경, 결제 리다이렉트 시)
   */
  const initialData = useMemo(() => {
    // 1순위: route params (일반적인 경우)
    if (params.orderData && params.formData) {
      try {
        return {
          orderData: JSON.parse(params.orderData as string) as CreateOrderResponse,
          formData: JSON.parse(params.formData as string) as StepInfoFormData,
        };
      } catch {
        // JSON 파싱 실패 시 다음 우선순위로
      }
    }

    // 2순위: sessionStorage (웹 환경, 결제 리다이렉트 시)
    const savedOrderData = getFromSessionStorage<CreateOrderResponse>(STORAGE_KEYS.ORDER_DATA);
    const savedFormData = getFromSessionStorage<StepInfoFormData>(STORAGE_KEYS.FORM_DATA);
    if (savedOrderData && savedFormData) {
      return {
        orderData: savedOrderData,
        formData: savedFormData,
      };
    }

    return null;
  }, [params.orderData, params.formData]);

  // 상태 관리
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(
    initialData?.orderData || null
  );
  const [formData, setFormData] = useState<StepInfoFormData | null>(
    initialData?.formData || null
  );

  /**
   * 웹 환경에서 데이터를 sessionStorage에 저장 (결제 리다이렉트 대비)
   * - 결제창에서 외부 결제 서비스로 이동 후 돌아올 때 데이터 복원용
   */
  useEffect(() => {
    if (orderData && formData) {
      saveToSessionStorage(STORAGE_KEYS.ORDER_DATA, orderData);
      saveToSessionStorage(STORAGE_KEYS.FORM_DATA, formData);
    }
  }, [orderData, formData]);

  /**
   * 데이터가 없으면 info 페이지로 리다이렉트
   * - 잘못된 경로로 직접 접근한 경우
   * - sessionStorage 데이터도 없는 경우
   */
  useEffect(() => {
    if (!orderData || !formData) {
      setIsRedirecting(true);
      router.replace('/timecapsule/info');
    }
  }, [orderData, formData, router]);

  // 리다이렉트 중이거나 데이터 없으면 로딩 표시
  if (isRedirecting || !orderData || !formData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );
  }

  /**
   * 뒤로가기 핸들러
   * - sessionStorage 클리어 후 info 페이지로 이동
   */
  const handleBack = () => {
    clearSessionStorage();
    router.back();
  };

  /**
   * 결제 완료 핸들러
   * - sessionStorage 클리어 후 room 페이지로 이동
   */
  const handleSubmit = () => {
    clearSessionStorage();

    // 대기실 페이지로 이동 (orderId 전달)
    router.push({
      pathname: '/timecapsule/room',
      params: {
        orderId: orderData.order_id,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <TossPayment
        formData={formData}
        orderData={orderData}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
