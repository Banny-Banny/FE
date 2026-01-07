/**
 * components/onboarding/components/location-consent-step/styles.ts
 * LocationConsentStep 스타일
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건 (투명도는 토큰 + 16진수 투명도로 처리)
 *
 * 토큰 소스: commons/constants/color.ts
 * 생성 시각: 2025-01-XX
 * 버전: 1.0.0
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  // 헤더 영역
  header: {
    paddingTop: 24,
    paddingHorizontal: 32,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    height: 12,
  },
  progressActive: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.grey[500],
  },
  progressInactive: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white[50] + '1A', // rgba(255, 255, 255, 0.1) - Figma 디자인 요구사항
  },
  // 메인 컨텐츠
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'flex-start',
  },
  stepBadge: {
    backgroundColor: Colors.black[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  stepBadgeText: {
    ...Typography.body.body3,
    color: Colors.white[500],
    letterSpacing: 0.6,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    ...Typography.header.h5,
    color: Colors.black[500],
    lineHeight: 48,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 2,
  },
  description: {
    ...Typography.body.body6,
    color: Colors.grey[800],
    lineHeight: 24,
  },
  cardsContainer: {
    width: '100%',
    gap: 24,
  },
  card: {
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.black[500] + '0A', // rgba(10, 10, 10, 0.04) - Figma 디자인 요구사항
    padding: 21,
    flexDirection: 'row',
    gap: 16,
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.whiteGrey[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 20,
    height: 20,
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    ...Typography.header.h2,
    color: Colors.black[500],
    lineHeight: 24,
  },
  cardDescription: {
    ...Typography.body.body6,
    color: Colors.grey[800],
    lineHeight: 20,
    fontSize: 13,
  },
  // 하단 버튼 영역
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 35,
    gap: 16,
    alignItems: 'center',
  },
  skipButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    ...Typography.body.body6,
    color: Colors.grey[300],
    fontSize: 15,
    lineHeight: 23,
  },
});

/**
 * ✅ 커서룰 재검토 체크리스트 (prompt.101.ui.txt 기준)
 *
 * 조건-커서룰:
 * - [✅] @01-common.mdc: 파일 제한 준수, 라이브러리 설치 금지, 독립 컴포넌트 구조
 * - [✅] @02-wireframe.mdc: StyleSheet 사용, flexbox만 사용 (position-absolute 없음)
 * - [✅] @03-ui.mdc: 인라인 스타일 금지, 색상 토큰 사용, Typography 토큰 사용
 *
 * 조건-스타일시스템:
 * - [✅] React Native StyleSheet 사용
 * - [✅] StyleSheet.create() 방식으로 styles.ts 작성
 * - [✅] 인라인 스타일 0건
 * - [✅] 모든 스타일은 styles.ts에서만 선언
 * - [✅] flexbox만 사용 (position-absolute 없음)
 * - [✅] 애니메이션 추가 없음
 *
 * 조건-색상토큰:
 * - [✅] commons/constants/color.ts의 Colors 토큰 활용
 * - [✅] 투명도가 필요한 경우 토큰 + 16진수 투명도 사용 (rgba 하드코딩 없음)
 * - [✅] hex, rgb, hsl 직접 입력 금지 (토큰만 사용)
 *
 * 조건-타이포그래피:
 * - [✅] commons/constants/typography.ts의 Typography 토큰 활용
 *
 * 최종검토:
 * - [✅] 피그마 디자인과 동일하게 구현됨
 * - [✅] 색상 하드코딩 0건 (투명도는 토큰 + 16진수 투명도로 처리)
 * - [✅] 인라인 스타일 0건
 * - [✅] index.tsx는 구조만, styles.ts는 스타일만 분리
 * - [✅] 외부 라이브러리 설치 0건
 * - [✅] 명시된 파일(index.tsx, styles.ts) 외 수정 0건
 * - [✅] commons/constants/color.ts, typography.ts 수정 0건 (토큰만 사용)
 * - [✅] 소수점 값 반올림 처리 완료
 * - [✅] flexbox만 사용 (position-absolute 없음)
 * - [✅] 애니메이션 추가 없음
 * - [✅] react-native-remix-icon 사용 (필요시)
 */

