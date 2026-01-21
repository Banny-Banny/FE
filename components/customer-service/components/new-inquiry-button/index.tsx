/**
 * components/customer-service/components/new-inquiry-button/index.tsx
 * 고객센터 문의 버튼 컴포넌트
 */

import { Button } from '@/commons/components/button';
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { NewInquiryButtonProps } from './types';

export function NewInquiryButton({ onPress }: NewInquiryButtonProps) {
  return (
    <View style={styles.container}>
      <Button label="1:1 문의하기" variant="primary" size="M" onPress={onPress || (() => {})} fullWidth={true} />
    </View>
  );
}
