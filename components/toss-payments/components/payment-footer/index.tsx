/**
 * components/payment-footer/index.tsx
 * 결제 버튼 Footer 컴포넌트
 */

import { Button } from '@/commons/components/button';
import React from 'react';
import { View } from 'react-native';
import { TEXTS } from '../../constants';
import { styles } from './styles';
import type { PaymentFooterProps } from './types';

export const PaymentFooter: React.FC<PaymentFooterProps> = ({
  isLoading,
  isPaymentEnabled,
  onSubmit,
}) => {
  return (
    <View style={styles.footer}>
      <Button
        label={isLoading ? '결제 처리 중...' : TEXTS.footer.submitButton}
        variant="primary"
        size="L"
        fullWidth
        disabled={isLoading || !isPaymentEnabled}
        onPress={onSubmit}
      />
    </View>
  );
};
