/**
 * components/onboarding/components/login-step/email-login/components/password-input/index.tsx
 * 비밀번호 입력 필드 컴포넌트 (토글 기능 포함)
 */

import { Colors } from '@/commons/constants';
import React, { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ErrorMessage } from '../error-message';
import { styles } from './styles';

interface PasswordInputProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  error?: FieldError;
  editable?: boolean;
}

/**
 * 비밀번호 입력 필드 컴포넌트
 * - 비밀번호 보이기/숨기기 토글 기능
 * - React Hook Form Controller 통합
 * - 에러 메시지 표시
 */
export function PasswordInput({
  control,
  name,
  placeholder,
  error,
  editable = true,
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor={Colors.grey[500]}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              editable={editable}
            />
          )}
        />
        <Pressable
          style={styles.toggleButton}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          disabled={!editable}>
          <Icon
            name={isPasswordVisible ? 'eye-off-line' : 'eye-line'}
            size={20}
            color={Colors.grey[600]}
          />
        </Pressable>
      </View>
      <ErrorMessage message={error?.message} />
    </View>
  );
}
