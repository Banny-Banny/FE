import { Redirect, useLocalSearchParams } from 'expo-router';

// OAuth 콜백을 받아 로그인 페이지로 리다이렉트
export default function AuthCallback() {
  const params = useLocalSearchParams<{ token?: string; isNewUser?: string }>();

  return <Redirect href={{ pathname: '/login', params }} />;
}

