/**
 * app/_layout.tsx
 * Root Layout - 전체 앱의 최상위 레이아웃
 * 오직 라우팅과 Provider 설정만 담당
 */

import { RootProvider } from '@/commons/layout/provider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Figma 매칭용 Variable Font
    'Pretendard Variable': require('../assets/fonts/PretendardVariable.ttf'),
    // 개별 Weight 파일들 (100-900)
    'Pretendard-100': require('../assets/fonts/Pretendard-Thin.otf'),
    'Pretendard-200': require('../assets/fonts/Pretendard-ExtraLight.otf'),
    'Pretendard-300': require('../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-400': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-500': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-600': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-700': require('../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-800': require('../assets/fonts/Pretendard-ExtraBold.otf'),
    'Pretendard-900': require('../assets/fonts/Pretendard-Black.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <RootProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RootProvider>
  );
}
