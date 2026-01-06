/**
 * components/onboarding/components/login-step/index.tsx
 * 로그인 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

interface LoginStepProps {
  isLoading: boolean;
  onKakaoLogin: () => void;
}

/**
 * 로그인 단계 (UI만 담당)
 */
export function LoginStep({ isLoading, onKakaoLogin }: LoginStepProps) {
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
