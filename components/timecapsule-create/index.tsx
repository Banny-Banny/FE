/**
 * components/timecapsule/index.tsx
 * 타임캡슐 생성 컨테이너 컴포넌트
 */

import { useNavigation } from '@/commons/hooks';
import TossPayment from '@/components/toss-payments';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import StepInfo from './components/step-info';
import { CreateOrderResponse } from './components/step-info/api/types/order';
import { StepInfoFormData } from './components/step-info/types';
import StepRoom from './components/step-room';

// 웹 환경에서 sessionStorage 사용
const STORAGE_KEYS = {
  STEP: 'timecapsule_create_step',
  STEP_INFO_DATA: 'timecapsule_create_step_info_data',
  ORDER_DATA: 'timecapsule_create_order_data',
};

export default function TimeCapsuleCreate() {
  const navigation = useNavigation();

  // 항상 초기 상태로 시작 (sessionStorage 복원 제거)
  const [step, setStep] = useState<number>(1);
  const [stepInfoData, setStepInfoData] = useState<StepInfoFormData | null>(null);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  // 화면이 포커스를 받을 때마다 state 초기화 (타임캡슐 만들기는 항상 새로 시작)
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 [TimeCapsuleCreate] 화면 포커스 - state 초기화 (항상 새로 시작)');
      setStep(1);
      setStepInfoData(null);
      setOrderData(null);

      // sessionStorage도 클리어
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.STEP);
        sessionStorage.removeItem(STORAGE_KEYS.STEP_INFO_DATA);
        sessionStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
      }
    }, [])
  );

  console.log('🎯 TimeCapsuleCreate 렌더링! step:', step);

  // 웹 환경에서 state 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.STEP, step.toString());
      console.log('💾 [TimeCapsuleCreate] step 저장:', step);
    }
  }, [step]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (stepInfoData) {
        sessionStorage.setItem(STORAGE_KEYS.STEP_INFO_DATA, JSON.stringify(stepInfoData));
        console.log('💾 [TimeCapsuleCreate] stepInfoData 저장');
      }
    }
  }, [stepInfoData]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (orderData) {
        sessionStorage.setItem(STORAGE_KEYS.ORDER_DATA, JSON.stringify(orderData));
        console.log('💾 [TimeCapsuleCreate] orderData 저장');
      }
    }
  }, [orderData]);

  // 3단계 도달 시 sessionStorage 클리어
  useEffect(() => {
    if (step === 3 && Platform.OS === 'web' && typeof window !== 'undefined') {
      console.log('🧹 [TimeCapsuleCreate] 3단계 도달 - sessionStorage 클리어');
      sessionStorage.removeItem(STORAGE_KEYS.STEP);
      sessionStorage.removeItem(STORAGE_KEYS.STEP_INFO_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
    }
  }, [step]);

  // 1단계: 타임캡슐 정보 입력
  if (step === 1) {
    const handleSubmit = (data: any) => {
      console.log('✅ [TimeCapsuleCreate] 1단계 완료!');
      console.log('📦 [TimeCapsuleCreate] 전체 데이터:', data);
      console.log('📦 [TimeCapsuleCreate] orderData:', data.orderData);

      if (!data.orderData) {
        console.error('❌ [TimeCapsuleCreate] orderData가 없습니다!');
        return;
      }

      setStepInfoData(data); // formData 저장
      setOrderData(data.orderData); // 백엔드 응답 저장

      console.log('🚀 [TimeCapsuleCreate] 2단계로 이동!');
      setStep(2); // 2단계로 이동
    };

    const handleBack = () => {
      console.log('🔙 메인으로 돌아가기');
      navigation.back(); // 메인 페이지로 이동
    };

    console.log('📤 StepInfo에 onSubmit 전달:', typeof handleSubmit);

    return <StepInfo onSubmit={handleSubmit} onBack={handleBack} initialData={stepInfoData} />;
  }

  // 2단계: 결제
  if (step === 2) {
    console.log('🎯 [TimeCapsuleCreate] 2단계 렌더링!');
    console.log('📦 [TimeCapsuleCreate] stepInfoData:', stepInfoData);
    console.log('📦 [TimeCapsuleCreate] orderData:', orderData);

    if (!stepInfoData || !orderData) {
      console.error('❌ [TimeCapsuleCreate] 필수 데이터가 없습니다!');
      return null;
    }

    return (
      <TossPayment
        formData={stepInfoData} // 1단계 폼 데이터 전달
        orderData={orderData} // 백엔드 주문 데이터 전달
        onBack={() => {
          console.log('🔙 [TimeCapsuleCreate] 1단계로 돌아가기');
          setStep(1);
        }}
        onSubmit={(paymentData) => {
          console.log('✅ [TimeCapsuleCreate] 결제 완료:', paymentData);
          setStep(3); // 3단계로 이동
        }}
      />
    );
  }

  // 3단계: 대기방
  if (step === 3) {
    // TODO: 실제로는 결제 완료 후 서버에서 호스트/게스트 정보를 받아와야 함
    // 현재는 임시로 호스트로 설정
    const userRole: 'host' | 'guest' = 'host';

    // orderData가 없으면 에러 처리
    if (!orderData) {
      console.error('❌ [TimeCapsuleCreate] orderData가 없습니다!');
      return null;
    }

    return (
      <StepRoom
        role={userRole}
        orderId={orderData.order_id} // 백엔드에서 생성한 order_id 전달
        onSubmit={() => {
          console.log('✅ [TimeCapsuleCreate] 타임캡슐 제출 완료!');
          // TODO: 메인 화면으로 이동 또는 완료 페이지로 이동
          navigation.back();
        }}
      />
    );
  }

  return null;
}
