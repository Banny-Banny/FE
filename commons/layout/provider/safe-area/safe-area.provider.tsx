import { usePathname, useSegments } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppSafeAreaProviderProps {
  children: React.ReactNode;
}

export const AppSafeAreaProvider: React.FC<AppSafeAreaProviderProps> = ({ children }) => {
  const segments = useSegments() as string[]; // 1. string[]로 단언하여 never 에러 해결
  const pathname = usePathname();

  const { isMapRoute, edges } = useMemo(() => {
    // [디버깅 로그] 지도가 켜진 상태에서 터미널에 찍히는 이 값을 반드시 확인하세요!
    // console.log('📍 현재 경로:', { pathname, segments });

    // 2. 지도 판별:
    // 파일 구조상 app/(tabs)/index.tsx가 '홈'이면서 '지도'라면 pathname은 '/' 또는 '/(tabs)' 입니다.
    const isMap =
      pathname === '/' ||
      pathname === '/index' ||
      pathname.includes('map') ||
      segments.includes('map');

    // 3. (auth) 판별: string[] 형변환 덕분에 이제 에러가 나지 않습니다.
    const isAuth = segments.includes('(auth)');

    return {
      isMapRoute: isMap,
      edges: isAuth
        ? (['top', 'bottom', 'left', 'right'] as const)
        : (['top', 'left', 'right'] as const),
    };
  }, [segments, pathname]);

  // 4. 지도일 때: SafeAreaView를 완전히 제거하고 일반 View만 반환
  if (isMapRoute) {
    return <View style={{ flex: 1, backgroundColor: 'transparent' }}>{children}</View>;
  }

  return (
    <SafeAreaView key={pathname} style={styles.safeArea} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'hotpink', //추후 수정 예정
  },
});
