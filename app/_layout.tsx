/**
 * app/_layout.tsx
 * Root Layout - 전체 앱의 최상위 레이아웃
 * 오직 라우팅과 Provider 설정만 담당
 */

import '../global.css';

import { RootProvider } from '@/commons/layout/provider';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <RootProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RootProvider>
  );
}
