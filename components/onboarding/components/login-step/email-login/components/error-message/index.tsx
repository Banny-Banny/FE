/**
 * components/onboarding/components/login-step/email-login/components/error-message/index.tsx
 * 에러 메시지 표시 컴포넌트
 */

import { Typography } from '@/commons/constants';
import { Colors } from '@/commons/constants';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface ErrorMessageProps {
  message?: string;
}

/**
 * 에러 메시지 컴포넌트
 * - 각 입력창 하단에 붉은색 글씨로 표시
 * - 메시지가 없으면 렌더링하지 않음
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
