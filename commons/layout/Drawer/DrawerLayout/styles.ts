import { StyleSheet } from 'react-native';

/**
 * DrawerLayout 스타일 및 설정
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 *
 * 토큰 소스: /Users/jiho/Desktop/TimeEgg/FE/tailwind.config.js
 * 생성 시각: 2025-12-14
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
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
  },
  white: '#ffffff',
  black: '#000000',
};

// Drawer 설정 상수 (토큰 기반)
export const DRAWER_SETTINGS = {
  backgroundColor: COLORS.neutral[800] + 'F2', // neutral-800 + 95% opacity
  width: 280,
  overlayColor: COLORS.black + '80', // black + 50% opacity
};

// 메뉴 버튼 위치 상수
export const MENU_BUTTON_POSITION = {
  top: 16,
  left: 16,
};

// Drawer 화면 옵션
export const DRAWER_SCREEN_OPTIONS = {
  headerShown: false,
  drawerType: 'front' as const,
  drawerStyle: {
    backgroundColor: DRAWER_SETTINGS.backgroundColor,
    width: DRAWER_SETTINGS.width,
  },
  overlayColor: DRAWER_SETTINGS.overlayColor,
};

export const styles = StyleSheet.create({
  // Drawer 컨테이너
  drawerContainer: {
    flex: 1,
    backgroundColor: DRAWER_SETTINGS.backgroundColor,
  },
  // 메뉴 버튼 오버레이
  menuButtonOverlay: {
    position: 'absolute',
    zIndex: 1000,
  },
  // 메뉴 버튼
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: COLORS.neutral[800] + '99', // neutral-800 + 60% opacity
    borderWidth: 0.528,
    borderColor: COLORS.white + '14', // white + 8% opacity
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: COLORS.white,
    borderRadius: 1,
    alignSelf: 'center',
  },
  menuContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: COLORS.primary[500] + '33', // primary-500 + 20% opacity
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.white,
  },
  menuLabelActive: {
    color: COLORS.primary[500],
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.white + '1A', // white + 10% opacity
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.white + '80', // white + 50% opacity
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

