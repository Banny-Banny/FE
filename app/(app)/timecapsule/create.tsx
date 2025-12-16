import { StepInfo } from '@/components/timecapsule/step-info';
import { StepInfoFormData } from '@/components/timecapsule/step-info/types';
import { StepPayment } from '@/components/timecapsule/step-payment';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

export default function TimeCapsuleCreate() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stepInfoData, setStepInfoData] = useState<StepInfoFormData | null>(null);

  console.log('🎯 TimeCapsuleCreate 렌더링! step:', step);

  // 1단계: 타임캡슐 정보 입력
  if (step === 1) {
    const handleSubmit = (formData: StepInfoFormData) => {
      console.log('✅ 1단계 완료:', formData);
      setStepInfoData(formData); // formData 저장
      setStep(2); // 2단계로 이동
    };

    const handleBack = () => {
      console.log('🔙 메인으로 돌아가기');
      router.back(); // 메인 페이지로 이동
    };

    console.log('📤 StepInfo에 onSubmit 전달:', typeof handleSubmit);

    return <StepInfo onSubmit={handleSubmit} onBack={handleBack} initialData={stepInfoData} />;
  }

  // 2단계: 결제
  if (step === 2 && stepInfoData) {
    return (
      <StepPayment
        formData={stepInfoData} // 1단계 데이터 전달
        onBack={() => setStep(1)} // 1단계로 돌아가기
        onSubmit={(orderSummary) => {
          console.log('✅ 결제 완료:', orderSummary);
          setStep(3); // 3단계로 이동
        }}
      />
    );
  }

  // 3단계: 대기방
  if (step === 3) {
    return (
      <View>
        <Text>타임캡슐 생성 - 3단계 (대기방)</Text>
      </View>
    );
  }

  return null;
}
