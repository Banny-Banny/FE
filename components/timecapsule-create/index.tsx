/**
 * components/timecapsule/index.tsx
 * 타임캡슐 생성 컨테이너 컴포넌트
 */

import { Spinner } from '@/commons/components/spinner';
import { ROUTES } from '@/commons/constants';
import TossPayment from '@/components/toss-payments';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import StepInfo from './components/step-info';
import { CreateOrderResponse } from './components/step-info/api/types/order';
import { StepInfoFormData } from './components/step-info/types';
import StepRoom from './components/step-room';

// 웹 환경에서 sessionStorage 사용
const STORAGE_KEYS = {
  STEP: 'timecapsule_create_step',
  STEP_INFO_DATA: 'timecapsule_create_step_info_data',
  ORDER_DATA: 'timecapsule_create_order_data',
  PAYMENT_PARAMS: 'timecapsule_create_payment_params',
};

export default function TimeCapsuleCreate() {
  const router = useRouter();

  // 웹 환경에서 URL 파라미터에 결제 정보가 있는지 확인
  // 결제 완료 후 리다이렉트된 경우 화면 깜빡임 방지를 위해 특별 처리
  const checkPaymentRedirect = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentKey = urlParams.get('paymentKey');
      const orderId = urlParams.get('orderId');
      const amount = urlParams.get('amount');

      // 결제 완료 후 리다이렉트된 경우
      if (paymentKey && orderId && amount) {
        console.log('💳 [TimeCapsuleCreate] 결제 완료 리다이렉트 감지 - 결제 승인 처리 중 화면으로 이동');
        return true;
      }
    }
    return false;
  };

  // 웹 환경에서 sessionStorage에서 복원 (결제 리다이렉트 대응)
  // ⚠️ step 3(대기실)은 복원하지 않음 - 대기실은 마이페이지에서 접근 가능하므로
  // 캡슐 생성 페이지는 항상 step 1부터 시작해야 함
  const getInitialStep = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const savedStep = sessionStorage.getItem(STORAGE_KEYS.STEP);
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        // step 3(대기실)은 복원하지 않고 항상 1로 시작
        if (step === 3) {
          console.log('🔄 [TimeCapsuleCreate] step 3(대기실) 감지 - 캡슐 생성은 항상 step 1부터 시작');
          // sessionStorage 클리어
          sessionStorage.removeItem(STORAGE_KEYS.STEP);
          sessionStorage.removeItem(STORAGE_KEYS.STEP_INFO_DATA);
          sessionStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
          return 1;
        }
        console.log('🔄 [TimeCapsuleCreate] sessionStorage에서 step 복원:', step);
        return step;
      }
    }
    return 1;
  };

  const getInitialStepInfoData = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEYS.STEP_INFO_DATA);
      if (saved) {
        console.log('🔄 [TimeCapsuleCreate] sessionStorage에서 stepInfoData 복원');
        return JSON.parse(saved);
      }
    }
    return null;
  };

  const getInitialOrderData = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ORDER_DATA);
      if (saved) {
        console.log('🔄 [TimeCapsuleCreate] sessionStorage에서 orderData 복원');
        return JSON.parse(saved);
      }
    }
    return null;
  };

  const [step, setStep] = useState<number>(() => {
    const initialStep = getInitialStep();
    console.log('🎬 [TimeCapsuleCreate] useState 초기화 - step:', initialStep);
    return initialStep;
  });
  const [stepInfoData, setStepInfoData] = useState<StepInfoFormData | null>(() => {
    const data = getInitialStepInfoData();
    console.log('🎬 [TimeCapsuleCreate] useState 초기화 - stepInfoData:', data ? '있음' : '없음');
    return data;
  });
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(() => {
    const data = getInitialOrderData();
    console.log('🎬 [TimeCapsuleCreate] useState 초기화 - orderData:', data ? '있음' : '없음');
    return data;
  });
  const [isPaymentRedirect, setIsPaymentRedirect] = useState<boolean>(() => {
    const isRedirect = checkPaymentRedirect();
    console.log('🎬 [TimeCapsuleCreate] useState 초기화 - isPaymentRedirect:', isRedirect);
    return isRedirect;
  });

  // 화면이 포커스를 받을 때마다 state 초기화 (타임캡슐 만들기는 항상 새로 시작)
  // ⚠️ 단, step이 2 이상일 때는 초기화하지 않음 (결제 진행 중이거나 완료된 경우)
  // ⚠️ isPaymentRedirect가 true인 경우도 초기화하지 않음 (결제 리다이렉트 처리 중)
  const stepRef = React.useRef(step);
  const isPaymentRedirectRef = React.useRef(isPaymentRedirect);

  // step과 isPaymentRedirect 변경 시 ref 업데이트
  React.useEffect(() => {
    stepRef.current = step;
    isPaymentRedirectRef.current = isPaymentRedirect;
  }, [step, isPaymentRedirect]);

  useFocusEffect(
    useCallback(() => {
      // 결제 리다이렉트 중이면 초기화하지 않음
      if (isPaymentRedirectRef.current) {
        console.log('🎯 [TimeCapsuleCreate] 화면 포커스 - 결제 리다이렉트 처리 중이므로 초기화 스킵');
        return;
      }

      // step이 2면 결제 진행 중이므로 초기화하지 않음 (결제 리다이렉트 대응)
      // step이 3(대기실)이면 항상 초기화 (대기실은 마이페이지에서 접근 가능)
      if (stepRef.current === 2) {
        console.log('🎯 [TimeCapsuleCreate] 화면 포커스 - 결제 진행 중이므로 초기화 스킵 (step:', stepRef.current, ')');
        return;
      }

      // step 1 또는 step 3인 경우 항상 초기화 (캡슐 생성은 항상 처음부터 시작)
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
    }, []) // 의존성 배열 비우기 - 포커스 변경 시에만 실행
  );

  console.log('🎯 TimeCapsuleCreate 렌더링! step:', step, 'isPaymentRedirect:', isPaymentRedirect);

  // ============================================
  // 웹 환경에서 state 변경 시 sessionStorage에 저장
  // ============================================
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

  // ============================================
  // 3단계 도달 시 sessionStorage 클리어
  // ============================================
  useEffect(() => {
    if (step === 3 && Platform.OS === 'web' && typeof window !== 'undefined') {
      console.log('🧹 [TimeCapsuleCreate] 3단계 도달 - sessionStorage 클리어');
      sessionStorage.removeItem(STORAGE_KEYS.STEP);
      sessionStorage.removeItem(STORAGE_KEYS.STEP_INFO_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.ORDER_DATA);
    }
  }, [step]);

  // 결제 리다이렉트 후 결제 승인이 완료되면 step 3으로 이동
  useEffect(() => {
    if (isPaymentRedirect && step === 3) {
      console.log('✅ [TimeCapsuleCreate] 결제 승인 완료 - 결제 리다이렉트 상태 해제');
      setIsPaymentRedirect(false);
    }
  }, [step, isPaymentRedirect]);

  // 결제 리다이렉트 시 즉시 TossPayment에게 결제 승인 처리 트리거
  const [triggerPaymentCheck, setTriggerPaymentCheck] = useState(false);
  useEffect(() => {
    if (isPaymentRedirect && step === 2 && !triggerPaymentCheck) {
      console.log('🚀 [TimeCapsuleCreate] 결제 승인 처리 트리거 설정');
      setTriggerPaymentCheck(true);
    }
  }, [isPaymentRedirect, step, triggerPaymentCheck]);

  // ============================================
  // 렌더링 로직
  // ============================================

  // 결제 완료 후 리다이렉트된 경우: 결제 승인 처리 중 화면 표시
  if (isPaymentRedirect && step === 2) {
    console.log('💳 [TimeCapsuleCreate] 결제 승인 처리 중 화면 렌더링');

    if (!stepInfoData || !orderData) {
      console.error('❌ [TimeCapsuleCreate] 결제 리다이렉트 상태인데 필수 데이터가 없습니다!');
      // 데이터가 없으면 결제 리다이렉트 상태 해제하고 step 1로 이동
      setIsPaymentRedirect(false);
      setStep(1);
      return null;
    }

    // ⚠️ TossPayment 컴포넌트를 정상적으로 렌더링하되, 로딩 스피너를 그 위에 오버레이로 표시
    // TossPayment의 useEffect가 실행되어 URL 파라미터를 확인하고 결제 승인 처리
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        {/* TossPayment: 정상적으로 렌더링 (useEffect 실행) */}
        <TossPayment
          formData={stepInfoData}
          orderData={orderData}
          onBack={() => {
            console.log('🔙 [TimeCapsuleCreate] 1단계로 돌아가기');
            setIsPaymentRedirect(false);
            setStep(1);
          }}
          onSubmit={(paymentData) => {
            console.log('✅ [TimeCapsuleCreate] 결제 완료:', paymentData);
            setStep(3); // 3단계로 이동
          }}
          triggerPaymentCheck={triggerPaymentCheck}
        />
        {/* 로딩 화면: TossPayment 위에 오버레이로 표시 */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Spinner size="large" color="#0064FF" />
        </View>
      </View>
    );
  }

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
      router.push(ROUTES.MAIN); // 메인 페이지로 이동
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
          router.push(ROUTES.MAIN);
        }}
      />
    );
  }

  return null;
}
