/**
 * components/login/components/login-form/index.tsx
 * 로그인 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

interface LoginFormProps {
  isLoading: boolean;
  onKakaoLogin: () => void;
}

/**
 * 로그인 폼 (UI만 담당)
 */
export function LoginForm({ isLoading, onKakaoLogin }: LoginFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인</Text>
        <Pressable onPress={onKakaoLogin} disabled={isLoading}>
          <Text>{isLoading ? '로그인 중...' : '카카오 로그인'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

