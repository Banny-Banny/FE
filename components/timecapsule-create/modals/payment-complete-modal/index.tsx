/**
 * components/timecapsule-create/components/payment-complete-modal/index.tsx
 * 결제 완료 모달 컴포넌트
 *
 * @description
 * - 결제가 완료되었을 때 표시되는 모달
 * - 공통 Modal 컴포넌트의 children으로 사용됨
 * - 아이콘, 제목, 확인 버튼으로 구성
 */

import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Button } from '@/commons/components/button';
import { Colors } from '@/commons/constants/color';
import { styles } from './styles';

interface PaymentCompleteModalProps {
  /** 확인 버튼 클릭 시 실행될 함수 */
  onConfirm: () => void;
}

/**
 * 결제 완료 모달
 * - useModal().openModal()의 children으로 전달됨
 */
export default function PaymentCompleteModal({ onConfirm }: PaymentCompleteModalProps) {
  return (
    <View style={styles.container}>
      {/* 아이콘 + 텍스트 영역 */}
      <View style={styles.contentSection}>
        {/* 아이콘 영역 */}
        <View style={styles.iconContainer}>
          <Icon name="bank-card-2-line" size={34} color={Colors.black[500]} />
        </View>

        {/* 텍스트 영역 */}
        <Text style={styles.title}>결제가 완료되었습니다!</Text>
      </View>

      {/* 버튼 영역 */}
      <Button label="확인" variant="primary" size="S" fullWidth={true} onPress={onConfirm} />
    </View>
  );
}
