/**
 * components/payment-method-selector/index.tsx
 * 결제 수단 선택 컴포넌트
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PaymentMethod } from '../payment-webview';
import { styles } from './styles';

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

/**
 * 결제 수단 선택 컴포넌트
 * 카드, 간편결제(카카오페이 포함) 중 선택
 */
export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods: { value: PaymentMethod; label: string; description: string }[] = [
    {
      value: '카드',
      label: '신용/체크카드',
      description: '모든 카드사 지원',
    },
    {
      value: '간편결제',
      label: '간편결제',
      description: '카카오페이, 네이버페이, 토스페이',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>결제 수단 선택</Text>
      <View style={styles.methodList}>
        {methods.map((method) => {
          const isSelected = selectedMethod === method.value;
          return (
            <TouchableOpacity
              key={method.value}
              style={[styles.methodItem, isSelected && styles.methodItemSelected]}
              onPress={() => onSelectMethod(method.value)}
              accessibilityRole="button"
              accessibilityLabel={`${method.label} 선택`}
              accessibilityState={{ selected: isSelected }}>
              <View style={styles.methodContent}>
                <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                  {method.label}
                </Text>
                <Text style={[styles.methodDescription, isSelected && styles.methodDescriptionSelected]}>
                  {method.description}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

