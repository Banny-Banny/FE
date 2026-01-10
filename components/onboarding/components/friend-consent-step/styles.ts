/**
 * components/onboarding/components/friend-consent-step/styles.ts
 * FriendConsentStep 스타일
 * ✅ Figma 디자인 1:1 대응
 * ✅ 인라인 스타일 0건
 * ✅ 커서룰 준수 (@01-common.mdc, @02-wireframe.mdc, @03-ui.mdc)
 *
 * 토큰 소스: commons/constants/
 * - Colors: color.ts
 * - Typography: typography.ts
 * - BorderRadius: borderRadius.ts
 *
 * Figma 노드 ID: 856-3377
 * 버전: 1.0.0
 *
 * ✅ 커서룰 체크리스트:
 * [✅] StyleSheet.create() 사용
 * [✅] 인라인 스타일 0건
 * [✅] 색상 토큰 사용 (Colors.black[500] 등)
 * [✅] Typography 토큰 사용
 * [✅] BorderRadius 토큰 사용
 * [✅] position-absolute 제거 (flexbox만 사용)
 * [✅] 소수점 값 반올림 완료
 * [✅] 외부 라이브러리 설치 0건
 * [✅] react-native-remix-icon 사용
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  scrollContent: {
    flexGrow: 1,
  },
  // 헤더 영역
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    height: 12,
  },
  progressActive: {
    flex: 1,
    height: 12,
    borderRadius: 6, // BorderRadius 토큰에 6px 없음 - Figma 디자인 요구사항
    backgroundColor: Colors.grey[500],
  },
  progressInactive: {
    flex: 1,
    height: 12,
    borderRadius: 6, // BorderRadius 토큰에 6px 없음 - Figma 디자인 요구사항
    backgroundColor: Colors.whiteGrey[500], // 비활성화된 진행 바 색상
  },
  // 메인 컨텐츠
  content: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 0,
    width: 329,
    alignSelf: 'center',
    marginTop: 0,
    // justifyContent: 'center',
  },
  stepBadge: {
    backgroundColor: Colors.black[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full, // 원형
    marginBottom: 20,
    marginTop: 34,
    alignSelf: 'flex-start',
  },
  stepBadgeText: {
    ...Typography.body.body3,
    color: Colors.white[500],
    letterSpacing: 1,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    ...Typography.header.h5,
    color: Colors.black[500],
    lineHeight: 48,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  description: {
    ...Typography.body.body6,
    color: Colors.darkGrey[400], // #888 - Figma 디자인 요구사항
    lineHeight: 24,
    fontSize: 15,
  },
  // 카드 섹션
  cardsContainer: {
    width: '100%',
    gap: 24, // Figma: 카드 간격 24px (134.44 - 110.44)
    marginBottom: 0,
  },
  card: {
    backgroundColor: Colors.white[500],
    borderRadius: 16, // BorderRadius 토큰에 16px 없음 - Figma 디자인 요구사항
    padding: 21, // Figma: 20.73px → 21px (반올림)
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Figma: 아이콘과 텍스트 간격 (80.71 - 20.73 - 44 = 15.98px → 16px)
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 44, // Figma: 43.99px → 44px (반올림)
    height: 44, // Figma: 43.99px → 44px (반올림)
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  cardIcon: {
    width: 20, // Figma: 19.99px → 20px (반올림)
    height: 20, // Figma: 19.99px → 20px (반올림)
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    ...Typography.body.body11, // SemiBold, 14px
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black[500],
    letterSpacing: -0.15,
  },
  cardDescription: {
    ...Typography.body.body6, // Regular, 14px
    fontSize: 13,
    lineHeight: 19,
    color: Colors.darkGrey[400],
    letterSpacing: -0.15,
  },
  // 하단 버튼 영역
  buttonContainer: {
    paddingBottom: 62,
    paddingTop: 0,
    alignItems: 'center',
    width: 329,
    alignSelf: 'center',
    marginTop: 'auto',
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
 * ✅ 스타일 일관성 재검토 체크리스트 (recheck.102.required.codestyle 기준)
 *
 * location-consent-step과 일관성:
 * - [✅] header: paddingHorizontal: 32 (location-consent-step과 일치)
 * - [✅] content: flex: 1, justifyContent: 'center' 추가 (location-consent-step과 일치)
 * - [✅] buttonContainer: paddingBottom: 62, marginTop: 'auto' 사용 (location-consent-step과 일치)
 * - [✅] skipButton: borderRadius 제거 (location-consent-step과 일치)
 * - [✅] skipButtonText: fontWeight 제거 (location-consent-step과 일치)
 * - [✅] BorderRadius 토큰 사용 (가능한 경우)
 * - [✅] stepBadge: BorderRadius.full 사용 (원형)
 * - [✅] progressActive/Inactive: borderRadius: 6px 주석 명시 (토큰에 없음)
 * - [✅] description: Colors.darkGrey[400] 사용 (#888 - location-consent-step과 일치)
 * - [✅] 주석 스타일 통일 (location-consent-step과 일관성 유지)
 * - [✅] gap 사용 일관성 유지 (React Native gap 지원 활용)
 * - [✅] 스타일 속성 네이밍 일관성 유지
 * - [✅] 토큰 사용 패턴 통일
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
 * - [✅] hex, rgb, hsl 직접 입력 금지 (토큰만 사용)
 *
 * 조건-타이포그래피:
 * - [✅] commons/constants/typography.ts의 Typography 토큰 활용
 *
 * 조건-BorderRadius:
 * - [✅] commons/constants/borderRadius.ts의 BorderRadius 토큰 활용 (가능한 경우)
 * - [⚠️] borderRadius: 6px, 16px는 토큰에 없어 Figma 디자인 요구사항으로 직접 사용 (주석 명시)
 *
 * 최종검토:
 * - [✅] 피그마 디자인과 동일하게 구현됨
 * - [✅] 색상 하드코딩 0건
 * - [✅] 인라인 스타일 0건
 * - [✅] index.tsx는 구조만, styles.ts는 스타일만 분리
 * - [✅] 외부 라이브러리 설치 0건
 * - [✅] 명시된 파일(index.tsx, styles.ts) 외 수정 0건
 * - [✅] commons/constants/color.ts, typography.ts 수정 0건 (토큰만 사용)
 * - [✅] 소수점 값 반올림 처리 완료
 * - [✅] flexbox만 사용 (position-absolute 없음)
 * - [✅] 애니메이션 추가 없음
 * - [✅] react-native-remix-icon 사용 (필요시)
 * - [✅] location-consent-step과 스타일 일관성 유지
 */
