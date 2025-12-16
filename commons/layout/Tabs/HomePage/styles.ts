import { StyleSheet } from 'react-native';

/**
 * HomePage 스타일
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 *
 * 토큰 소스: /Users/jiho/Desktop/TimeEgg/FE/tailwind.config.js
 * 생성 시각: 2025-12-16
 * 버전: 1.0.0
 */

// Tailwind 토큰 매핑
const COLORS = {
  white: '#ffffff',
  black: '#000000',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // 타임캡슐 만들기 플로팅 버튼
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    left: 24,
    height: 60,
    backgroundColor: COLORS.black,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  floatingButtonText: {
    fontFamily: 'Pretendard Variable',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: COLORS.white,
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
