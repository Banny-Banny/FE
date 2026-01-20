/**
 * components/onboarding/components/login-step/email-login/components/terms-consent/styles.ts
 * 약관 동의 컴포넌트 스타일
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 12, // 약관 항목 간 간격
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm, // 4px
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.white[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.black[500],
    borderColor: Colors.black[500],
  },
  label: {
    ...Typography.body.body6, // 14px, Regular
    color: Colors.black[500],
    flex: 1,
  },
  required: {
    color: Colors.red[500],
  },
  optional: {
    color: Colors.grey[600],
  },
});
