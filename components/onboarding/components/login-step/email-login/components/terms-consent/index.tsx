/**
 * components/onboarding/components/login-step/email-login/components/terms-consent/index.tsx
 * 약관 동의 컴포넌트
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ErrorMessage } from '../error-message';
import { styles } from './styles';

interface TermsConsentProps {
  control: Control<any>;
  errors?: {
    service?: FieldError;
    privacy?: FieldError;
    marketing?: FieldError;
  };
  editable?: boolean;
}

/**
 * 약관 동의 컴포넌트
 * - 서비스 이용약관 (필수)
 * - 개인정보 처리방침 (필수)
 * - 마케팅 정보 수신 동의 (선택)
 */
export function TermsConsent({ control, errors, editable = true }: TermsConsentProps) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="termsConsent.service"
        render={({ field: { onChange, value } }) => (
          <Pressable
            style={styles.item}
            onPress={() => editable && onChange(!value)}
            disabled={!editable}>
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && (
                <Icon name="check-line" size={16} color={Colors.white[500]} />
              )}
            </View>
            <Text style={styles.label}>
              서비스 이용약관에 동의합니다 <Text style={styles.required}>(필수)</Text>
            </Text>
          </Pressable>
        )}
      />
      {errors?.service && <ErrorMessage message={errors.service.message} />}

      <Controller
        control={control}
        name="termsConsent.privacy"
        render={({ field: { onChange, value } }) => (
          <Pressable
            style={styles.item}
            onPress={() => editable && onChange(!value)}
            disabled={!editable}>
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && (
                <Icon name="check-line" size={16} color={Colors.white[500]} />
              )}
            </View>
            <Text style={styles.label}>
              개인정보 처리방침에 동의합니다 <Text style={styles.required}>(필수)</Text>
            </Text>
          </Pressable>
        )}
      />
      {errors?.privacy && <ErrorMessage message={errors.privacy.message} />}

      <Controller
        control={control}
        name="termsConsent.marketing"
        render={({ field: { onChange, value } }) => (
          <Pressable
            style={styles.item}
            onPress={() => editable && onChange(!value)}
            disabled={!editable}>
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && (
                <Icon name="check-line" size={16} color={Colors.white[500]} />
              )}
            </View>
            <Text style={styles.label}>
              마케팅 정보 수신에 동의합니다 <Text style={styles.optional}>(선택)</Text>
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
