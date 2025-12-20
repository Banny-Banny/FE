import { Pressable, Text, View } from 'react-native';

import { useLogin } from './hooks/useLogin';
import { styles } from './styles';

/**
 * 로그인 뷰 컴포넌트
 * 복잡한 컴포넌트이므로 내부에 hooks를 가짐 (규칙: "Must be separated into folders if they are complex")
 */
export function LoginView() {
  const { isLoading, handleKakaoLogin } = useLogin();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인</Text>
        <Pressable onPress={handleKakaoLogin} disabled={isLoading}>
          <Text>{isLoading ? '로그인 중...' : '로그인 버튼'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
