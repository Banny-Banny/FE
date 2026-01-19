/**
 * components/customer-service/components/new-inquiry-button/index.tsx
 * 새 문의 시작 버튼 컴포넌트
 */

import { Button } from '@/commons/components/button';
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { NewInquiryButtonProps } from './types';

export function NewInquiryButton({ onPress }: NewInquiryButtonProps) {
  return (
    <View style={styles.container}>
      <Button label="새 문의 시작" variant="primary" size="M" onPress={onPress || (() => {})} fullWidth={true} />
    </View>
  );
}
