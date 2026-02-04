import { Colors } from '@/commons/constants';
import { usePathname, useSegments } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
        : (['top','bottom', 'left', 'right'] as const),
    };
  }, [segments, pathname]);

  /**
   * 🚨 Android(Fabric) addViewAt 크래시 방지
   * - 라우트에 따라 래퍼 컴포넌트 타입(View ↔ SafeAreaView)을 바꾸면,
   *   네비게이션 트리가 다른 parent로 "리패런팅"되며
   *   `The specified child already has a parent` 크래시가 발생할 수 있습니다.
   * - 따라서 항상 SafeAreaView로 고정하고, 지도 화면만 edges=[]로 SafeArea를 비활성화합니다.
   */
  return (
    <SafeAreaView
      style={isMapRoute ? styles.mapSafeArea : styles.safeArea}
      edges={isMapRoute ? ([] as const) : edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white[500], //추후 수정 예정
  },
  mapSafeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
