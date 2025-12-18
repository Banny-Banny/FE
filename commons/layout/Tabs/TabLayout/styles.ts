import { Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * TabLayout 스타일 및 설정
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 *
 * 토큰 소스: commons/constants/color.ts
 * 생성 시각: 2025-12-16
 * 버전: 1.0.0
 */

// Tabs 설정 상수 (토큰 기반)
export const TABS_SETTINGS = {
  tabBarStyle: {
    backgroundColor: Colors.white[50],
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    height: 68,
    paddingBottom: 12,
    paddingTop: 12,
  },
  tabBarActiveTintColor: Colors.black[500],
  tabBarInactiveTintColor: Colors.grey[500],
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  headerStyle: {
    backgroundColor: Colors.white[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  headerTintColor: Colors.black[500],
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
    backgroundColor: Colors.white[50],
  },
  // 페이지 컨테이너
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.white[50],
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
    color: Colors.black[500],
    marginBottom: 8,
  },
  // 서브타이틀
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.grey[500],
    textAlign: 'center',
  },
});

/**
 * ✅ 체크리스트
 * [✅] tailwind.config.js 수정 안 함
 * [✅] 색상값 직접 입력 0건 (모두 Colors 토큰 사용)
 * [✅] 모든 색상은 commons/constants/color.ts의 토큰 기반
 * [✅] 하드코딩 hex/rgb/hsl 사용 0건
 * [✅] 스타일은 styles.ts에서만 관리
 */
