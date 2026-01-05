/**
 * app/(auth)/_layout.tsx
 * 인증 관련 페이지들의 레이아웃
 * SafeAreaView는 RootProvider에서 통합 관리됩니다.
 */

import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
