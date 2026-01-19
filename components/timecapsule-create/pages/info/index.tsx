/**
 * components/timecapsule-create/pages/info/index.tsx
 * 타임캡슐 생성 - 기본 정보 입력 페이지 (비즈니스 로직)
 *
 * 역할:
 * - 타임캡슐 제목, 날짜, 위치 등 기본 정보 입력
 * - StepInfo 컴포넌트를 래핑하여 사용
 * - 폼 제출 시 백엔드에 order 생성 요청
 * - orderData를 navigation params로 전달하여 payment 페이지로 이동
 */

import { ROUTES } from '@/commons/constants';
import StepInfo from '@/components/timecapsule-create/components/step-info';
import type { CreateOrderResponse } from '@/components/timecapsule-create/components/step-info/api/types/order';
import type { StepInfoFormData } from '@/components/timecapsule-create/components/step-info/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

/**
 * StepInfo onSubmit 콜백 데이터 타입
 */
interface StepInfoSubmitData extends StepInfoFormData {
  orderData: CreateOrderResponse;
}

/**
 * 타임캡슐 생성 - 기본 정보 입력 페이지
 */
export default function TimeCapsuleCreateInfo() {
  const router = useRouter();

  /**
   * 폼 제출 핸들러
   * - 백엔드에서 order 생성 완료 후 호출됨
   * - orderData와 formData를 navigation params로 전달
   */
  const handleSubmit = (data: StepInfoSubmitData) => {
    if (!data.orderData) {
      return;
    }

    // 결제 페이지로 이동 (orderData와 formData 전달)
    router.push({
      pathname: '/timecapsule/payment',
      params: {
        orderData: JSON.stringify(data.orderData),
        formData: JSON.stringify(data),
      },
    });
  };

  /**
   * 뒤로가기 핸들러
   * - 메인 페이지로 이동
   */
  const handleBack = () => {
    router.push(ROUTES.MAIN);
  };

  return (
    <View style={{ flex: 1 }}>
      <StepInfo onSubmit={handleSubmit} onBack={handleBack} />
    </View>
  );
}
