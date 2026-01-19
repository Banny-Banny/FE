/**
 * components/onboarding/components/login-step/email-login/index.tsx
 * 이메일 로그인 화면 컴포넌트
 */

import { Colors } from '@/commons/constants';
import { useEmailLogin } from '@/components/onboarding/hooks/useEmailLogin';
import { getUserFromToken } from '@/utils';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading: loginLoading, loginWithEmail } = useEmailLogin();

  const isLoading = externalLoading || loginLoading;

  // 로그인 처리
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const result = await loginWithEmail({ email, password });
    if (result && result.token) {
      const userData = getUserFromToken(result.token) || {
        id: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
      };

      await onLoginSuccess(result.token, userData);
      // 성공 시 입력값 초기화
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      setIsSignup(false);
    }
  };

  // 회원가입 처리 (임시 - API 엔드포인트 추가 필요)
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('입력 오류', '비밀번호는 8자 이상 입력해주세요.');
      return;
    }

    // TODO: 회원가입 API 호출
    Alert.alert('알림', '회원가입 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          {/* 회원가입 시 이름 입력 */}
          {isSignup && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="홍길동"
                placeholderTextColor={Colors.grey[500]}
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          )}

          {/* 이메일 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={Colors.grey[500]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder={isSignup ? '8자 이상 입력해주세요' : '비밀번호를 입력하세요'}
              placeholderTextColor={Colors.grey[500]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 회원가입 시 비밀번호 확인 입력 */}
          {isSignup && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 다시 입력해주세요"
                placeholderTextColor={Colors.grey[500]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          )}

          {/* 로그인/회원가입 버튼 */}
          <Pressable
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={isSignup ? handleSignup : handleLogin}
            disabled={isLoading}>
            <Text style={styles.submitButtonText}>
              {isLoading ? '처리 중...' : isSignup ? '회원가입' : '로그인'}
            </Text>
          </Pressable>

          {/* 로그인/회원가입 전환 */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isSignup ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
            </Text>
            <Pressable
              onPress={() => setIsSignup(!isSignup)}
              disabled={isLoading}>
              <Text style={styles.switchLink}>
                {isSignup ? '로그인' : '회원가입'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
