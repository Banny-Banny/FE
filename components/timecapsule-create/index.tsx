/**
 * components/timecapsule/index.tsx
 * 타임캡슐 생성 컨테이너 컴포넌트
 */

import { useNavigation } from '@/commons/hooks';
import TossPayment from '@/components/toss-payments';
import React, { useState } from 'react';
import StepInfo from './components/step-info';
import { CreateOrderResponse } from './components/step-info/api/types/order';
import { StepInfoFormData } from './components/step-info/types';
import StepRoom from './components/step-room';

export default function TimeCapsuleCreate() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [stepInfoData, setStepInfoData] = useState<StepInfoFormData | null>(null);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  console.log('🎯 TimeCapsuleCreate 렌더링! step:', step);

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
