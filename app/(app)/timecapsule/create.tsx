import { View, Text } from 'react-native';
import { useState } from 'react';

export default function TimeCapsuleCreate(): JSX.Element {
  const [step, setStep] = useState(1);

  // 1단계: 타임캡슐 정보 입력
  if (step === 1) {
    return (
      <View>
        <Text>타임캡슐 생성 - 1단계 (이름, 날짜 입력)</Text>
      </View>
    );
  }

  // 2단계: 결제
  if (step === 2) {
    return (
      <View>
        <Text>타임캡슐 생성 - 2단계 (결제)</Text>
      </View>
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
