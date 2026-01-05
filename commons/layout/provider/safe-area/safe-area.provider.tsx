/**
 * commons/layout/provider/safe-area/safe-area.provider.tsx
 * SafeAreaView를 통합 관리하는 Provider
 * 라우터 컨텍스트 내부에서 경로를 확인하여 SafeAreaView를 조건부로 적용합니다.
 */

import { useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaProviderProps {
  children: React.ReactNode;
}

/**
 * SafeAreaProvider 컴포넌트
 * 경로에 따라 SafeAreaView를 조건부로 적용합니다.
 *
 * 규칙:
 * - 경로에 /map이 있으면 SafeAreaView를 적용하지 않음
 * - (auth) 경로: edges={['top', 'bottom', 'left', 'right']} (하단 탭이 없는 페이지)
 * - 기본: edges={['top', 'left', 'right']} (탭 바나 하단 버튼이 있는 페이지가 많기 때문)
 */
export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  const segments = useSegments();
  const path = segments.join('/');

  // 경로에 /map이 있으면 SafeAreaView를 적용하지 않음
  const isMapRoute = path.includes('map');

  // (auth) 경로인지 확인
  const isAuthRoute = segments[0] === '(auth)';

  // Edge 결정 로직
  const edges = isAuthRoute
    ? (['top', 'bottom', 'left', 'right'] as const)
    : (['top', 'left', 'right'] as const);

  if (isMapRoute) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

