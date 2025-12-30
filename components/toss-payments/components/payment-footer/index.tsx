/**
 * components/payment-footer/index.tsx
 * 결제 버튼 Footer 컴포넌트
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
      <TouchableOpacity
        style={[styles.submitButton, (isLoading || !isPaymentEnabled) && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={isLoading || !isPaymentEnabled}
        accessibilityRole="button"
        accessibilityLabel={TEXTS.footer.submitButton}>
        <Text style={styles.submitButtonText}>
          {isLoading ? '결제 처리 중...' : TEXTS.footer.submitButton}
        </Text>
        {!isLoading && <Text style={styles.submitButtonArrow}>→</Text>}
      </TouchableOpacity>
    </View>
  );
};

