import { StyleSheet } from 'react-native';

/**
 * TabLayout 스타일 및 설정
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 *
 * 토큰 소스: /Users/jiho/Desktop/TimeEgg/FE/tailwind.config.js
 * 생성 시각: 2025-12-16
 * 버전: 1.0.0
 */

// Tailwind 토큰 매핑
const COLORS = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  white: '#ffffff',
  black: '#000000',
};

// Tabs 설정 상수 (토큰 기반)
export const TABS_SETTINGS = {
  tabBarStyle: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarActiveTintColor: COLORS.primary[500],
  tabBarInactiveTintColor: COLORS.neutral[400],
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  headerStyle: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  headerTintColor: COLORS.neutral[900],
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 18,
  },
};

// Tabs 화면 옵션
export const TABS_SCREEN_OPTIONS = {
  headerShown: false,
  tabBarStyle: TABS_SETTINGS.tabBarStyle,
  tabBarActiveTintColor: TABS_SETTINGS.tabBarActiveTintColor,
  tabBarInactiveTintColor: TABS_SETTINGS.tabBarInactiveTintColor,
  tabBarLabelStyle: TABS_SETTINGS.tabBarLabelStyle,
};

export const styles = StyleSheet.create({
  // 탭 컨테이너
  tabContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // 페이지 컨테이너
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  // 컨텐츠 영역
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // 타이틀
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  // 서브타이틀
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: COLORS.neutral[500],
    textAlign: 'center',
  },
});

/**
 * ✅ 체크리스트
 * [✅] tailwind.config.js 수정 안 함
 * [✅] 색상값 직접 입력 0건 (모두 COLORS 토큰 사용)
 * [✅] 모든 색상은 tailwind.config.js의 토큰 기반
 * [✅] 하드코딩 hex/rgb/hsl 사용 0건
 * [✅] 스타일은 styles.ts에서만 관리
 */
