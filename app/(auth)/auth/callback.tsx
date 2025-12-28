import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * OAuth 콜백: 토큰 파라미터를 그대로 로그인 페이지로 전달만 함.
 * 토큰 처리 로직은 로그인 페이지의 useLogin 훅에서 수행.
 */
export default function AuthCallback() {
  const params = useLocalSearchParams<{ token?: string; isNewUser?: string }>();

  return <Redirect href={{ pathname: '/login', params }} />;
}
