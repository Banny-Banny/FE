import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * LocationConsentStep 스타일
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 *
 * 토큰 소스: commons/constants/color.ts
 * 생성 시각: 2025-01-XX
 * 버전: 1.0.0
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    ...Typography.header.h1,
    color: Colors.darkGrey[900],
    marginBottom: 16,
  },
  description: {
    ...Typography.body.body4,
    color: Colors.darkGrey[600],
    marginBottom: 48,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 32,
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

