/**
 * app/(auth)/_layout.tsx
 * 인증 관련 페이지들의 레이아웃
 * SafeAreaView를 적용하여 상태바 영역을 고려합니다.
 */

import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
