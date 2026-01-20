/**
 * components/onboarding/components/login-step/email-login/index.tsx
 * 이메일 로그인 화면 컴포넌트
 * 
 * ✅ React Hook Form + Zod 통합
 * ✅ 실시간 검증
 * ✅ 에러 메시지 표시
 * ✅ 비밀번호 토글 기능
 * ✅ 약관 동의 기능
 */

import { Colors } from '@/commons/constants';
import { useEmailLogin } from '@/components/onboarding/hooks/useEmailLogin';
import { getUserFromToken } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ErrorMessage } from './components/error-message';
import { PasswordInput } from './components/password-input';
import { TermsConsent } from './components/terms-consent';
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from './schemas';
import { styles } from './styles';

interface EmailLoginProps {
  isLoading: boolean;
  onLoginSuccess: (token: string, userData: any) => Promise<void>;
  onBack: () => void;
}

/**
 * 이메일 로그인 화면
 */
export function EmailLogin({ isLoading: externalLoading, onLoginSuccess, onBack }: EmailLoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const { isLoading: loginLoading, loginWithEmail, signupWithEmail } = useEmailLogin();

  const isLoading = externalLoading || loginLoading;

  // 로그인 폼
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  // 회원가입 폼
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsConsent: {
        service: false,
        privacy: false,
        marketing: false,
      },
    },
  });

  // 현재 사용할 폼
  const currentForm = isSignup ? signupForm : loginForm;

  // 로그인 처리
  const handleLogin = async (data: LoginFormData) => {
    // 이메일 또는 전화번호 구분
    const isEmail = data.emailOrPhone.includes('@');
    const email = isEmail ? data.emailOrPhone : undefined;
    const phoneNumber = !isEmail ? data.emailOrPhone.replace(/-/g, '') : undefined;

    const result = await loginWithEmail({
      email,
      phoneNumber,
      password: data.password,
    });

    if (result && result.token) {
      const userData = getUserFromToken(result.token) || {
        id: result.user.id,
        email: result.user.email || email,
        nickname: result.user.nickname,
      };

      await onLoginSuccess(result.token, userData);
      // 성공 시 입력값 초기화
      loginForm.reset();
    }
  };

  // 회원가입 처리
  const handleSignup = async (data: SignupFormData) => {
    // 전화번호 하이픈 제거 (스키마에서 이미 처리되지만 안전을 위해)
    const cleanPhoneNumber = data.phoneNumber.replace(/-/g, '');

    const result = await signupWithEmail({
      nickname: data.name,
      phoneNumber: cleanPhoneNumber,
      password: data.password,
      email: data.email || undefined,
    });

    if (result && result.token) {
      // 회원가입 성공 모달 표시
      Alert.alert(
        '회원가입 완료',
        '회원가입이 완료되었습니다!',
        [
          {
            text: '확인',
            onPress: () => {
              // 로그인 화면으로 전환
              setIsSignup(false);
              // 회원가입 폼 초기화
              signupForm.reset();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  // 로그인/회원가입 전환
  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    // 폼 초기화
    if (isSignup) {
      signupForm.reset();
    } else {
      loginForm.reset();
    }
  };

  const sanitizeNumericInput = (value: string) => value.replace(/[^0-9]/g, '');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        bounces={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-left-line" size={24} color={Colors.black[500]} />
          </Pressable>
        </View>

        {/* 제목 섹션 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{isSignup ? '회원가입' : '로그인'}</Text>
          <Text style={styles.subtitle}>
            {isSignup ? '타임캡슐과 함께 추억을 보관하세요' : '이메일과 비밀번호로 로그인하세요'}
          </Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.form}>
          {isSignup ? (
            // 회원가입 폼
            <>
              {/* 이름 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>이름</Text>
                <Controller
                  control={signupForm.control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, signupForm.formState.errors.name && styles.inputError]}
                      placeholder="홍길동"
                      placeholderTextColor={Colors.grey[500]}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  )}
                />
                <ErrorMessage message={signupForm.formState.errors.name?.message} />
              </View>

              {/* 전화번호 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>전화번호</Text>
                <Controller
                  control={signupForm.control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        signupForm.formState.errors.phoneNumber && styles.inputError,
                      ]}
                      placeholder="전화번호를 입력해주세요"
                      placeholderTextColor={Colors.grey[500]}
                      value={value}
                      onChangeText={(text) => onChange(sanitizeNumericInput(text))}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  )}
                />
                <ErrorMessage message={signupForm.formState.errors.phoneNumber?.message} />
              </View>

              {/* 이메일 입력 (선택사항) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>이메일 (선택사항)</Text>
                <Controller
                  control={signupForm.control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        signupForm.formState.errors.email && styles.inputError,
                      ]}
                      placeholder="이메일을 입력해주세요"
                      placeholderTextColor={Colors.grey[500]}
                      value={value || ''}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  )}
                />
                <ErrorMessage message={signupForm.formState.errors.email?.message} />
              </View>

              {/* 비밀번호 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>비밀번호</Text>
                <PasswordInput
                  control={signupForm.control}
                  name="password"
                  placeholder="8자 이상 입력해주세요"
                  error={signupForm.formState.errors.password}
                  editable={!isLoading}
                />
              </View>

              {/* 비밀번호 확인 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <PasswordInput
                  control={signupForm.control}
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력해주세요"
                  error={signupForm.formState.errors.confirmPassword}
                  editable={!isLoading}
                />
              </View>

              {/* 약관 동의 */}
              <View style={styles.inputContainer}>
                <TermsConsent
                  control={signupForm.control}
                  errors={signupForm.formState.errors.termsConsent}
                  editable={!isLoading}
                />
              </View>

              {/* 회원가입 버튼 */}
              <Pressable
                style={[
                  styles.submitButton,
                  (!signupForm.formState.isValid || isLoading) && styles.submitButtonDisabled,
                ]}
                onPress={signupForm.handleSubmit(handleSignup)}
                disabled={!signupForm.formState.isValid || isLoading}>
                <Text style={styles.submitButtonText}>
                  {isLoading ? '처리 중...' : '회원가입'}
                </Text>
              </Pressable>
            </>
          ) : (
            // 로그인 폼
            <>
              {/* 전화번호 또는 이메일 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>전화번호 또는 이메일</Text>
                <Controller
                  control={loginForm.control}
                  name="emailOrPhone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        loginForm.formState.errors.emailOrPhone && styles.inputError,
                      ]}
                      placeholder="전화번호 또는 이메일을 입력해주세요"
                      placeholderTextColor={Colors.grey[500]}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  )}
                />
                <ErrorMessage message={loginForm.formState.errors.emailOrPhone?.message} />
              </View>

              {/* 비밀번호 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>비밀번호</Text>
                <PasswordInput
                  control={loginForm.control}
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  error={loginForm.formState.errors.password}
                  editable={!isLoading}
                />
              </View>

              {/* 로그인 버튼 */}
              <Pressable
                style={[
                  styles.submitButton,
                  (!loginForm.formState.isValid || isLoading) && styles.submitButtonDisabled,
                ]}
                onPress={loginForm.handleSubmit(handleLogin)}
                disabled={!loginForm.formState.isValid || isLoading}>
                <Text style={styles.submitButtonText}>
                  {isLoading ? '처리 중...' : '로그인'}
                </Text>
              </Pressable>
            </>
          )}

          {/* 로그인/회원가입 전환 */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isSignup ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
            </Text>
            <Pressable onPress={handleToggleMode} disabled={isLoading}>
              <Text style={styles.switchLink}>{isSignup ? '로그인' : '회원가입'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
