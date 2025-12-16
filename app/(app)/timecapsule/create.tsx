import { StepInfo } from '@/components/timecapsule/step-info';
import { StepPayment } from '@/components/timecapsule/step-payment';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function TimeCapsuleCreate(): JSX.Element {
  const [step, setStep] = useState(1);

  console.log('🎯 TimeCapsuleCreate 렌더링! step:', step);

  // 1단계: 타임캡슐 정보 입력
  if (step === 1) {
    const handleSubmit = (formData: any) => {
      console.log('✅ 1단계 완료:', formData);
      setStep(2); // 2단계로 이동
    };

    console.log('📤 StepInfo에 onSubmit 전달:', typeof handleSubmit);

    return <StepInfo onSubmit={handleSubmit} />;
  }

  // 2단계: 결제
  if (step === 2) {
    return (
      <StepPayment
        onBack={() => setStep(1)} // 1단계로 돌아가기
        onSubmit={() => {
          console.log('결제 완료');
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
