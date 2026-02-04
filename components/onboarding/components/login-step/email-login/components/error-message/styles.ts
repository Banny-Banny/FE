/**
 * components/onboarding/components/login-step/email-login/components/error-message/styles.ts
 * 에러 메시지 컴포넌트 스타일
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 4, // 입력창과 4px 간격
  },
  text: {
    ...Typography.body.body6, // 14px, Regular
    color: Colors.red[500], // 붉은색
  },
});
