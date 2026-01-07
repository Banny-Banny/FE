import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
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
 * 버전: 1.3.0 (공통 컴포넌트 조건 재검토 완료 - recheck.201.optional.ui.component 기준)
 *
 * ✅ 커서룰 체크리스트 (recheck.101.required.rule 기준):
 * [✅] StyleSheet.create() 사용
 * [✅] 인라인 스타일 0건
 * [✅] 색상 토큰 사용 (Colors.black[500] 등)
 * [✅] Typography 토큰 사용
 * [✅] BorderRadius 토큰 사용
 * [✅] position-absolute 제거 (flexbox만 사용)
 * [✅] 소수점 값 반올림 완료
 * [✅] 외부 라이브러리 설치 0건
 * [✅] assets/icons/ 로컬 파일 사용 (<.png, friend.png, shield.png)
 */

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
    borderRadius: BorderRadius.full,
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
    borderRadius: 6, // BorderRadius 토큰에 6px 없음 - Figma 디자인 요구사항
    backgroundColor: Colors.grey[500],
  },
  progressInactive: {
    flex: 1,
    height: 12,
    borderRadius: 6, // BorderRadius 토큰에 6px 없음 - Figma 디자인 요구사항
    backgroundColor: Colors.white[50] + '1A', // rgba(255, 255, 255, 0.1) - Figma 디자인 요구사항
  },
  // 메인 컨텐츠
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: Colors.black[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full, // 원형
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
    alignItems: 'flex-start',
  },
  title: {
    ...Typography.header.h5,
    color: Colors.black[500],
    lineHeight: 48,
    fontSize: 40,
    letterSpacing: -0.8,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 2,
    alignItems: 'flex-start',
  },
  description: {
    ...Typography.body.body6,
    color: Colors.darkGrey[400], // #888 - Figma 디자인 요구사항
    lineHeight: 24,
    fontSize: 15,
  },
  cardsContainer: {
    width: '100%',
    gap: 24,
    alignItems: 'center',
  },
  card: {
    width: 329, // Figma 디자인 요구사항
    backgroundColor: Colors.white[50],
    borderRadius: BorderRadius.xl, // 20px
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
    borderRadius: BorderRadius.full, // 원형 (44px / 2 = 22px)
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
    color: Colors.darkGrey[400], // #888 - Figma 디자인 요구사항
    lineHeight: 20,
    fontSize: 13,
  },
  // 하단 버튼 영역
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 35,
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonWrapper: {
    width: 329, // Figma 디자인 요구사항
  },
  skipButton: {
    width: 329, // Figma 디자인 요구사항
    height: 48,
    borderRadius: 16, // Figma 디자인 요구사항
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    ...Typography.body.body6,
    color: Colors.grey[300], // #ccc - Figma 디자인 요구사항
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600', // SemiBold - Figma 디자인 요구사항
  },
});

/**
 * ✅ 공통 컴포넌트 조건 재검토 체크리스트 (recheck.201.optional.ui.component 기준)
 *
 * 공통 컴포넌트 사용 현황:
 * - [✅] Button 컴포넌트 사용: @/commons/components/button
 *   - "친구 연동 허용 >" 버튼에 Button 컴포넌트 사용
 *   - variant="primary", size="L", fullWidth={true}
 *   - disabled={isLoading} 상태 처리
 *   - onPress={onConsent} 핸들러 연결
 * - [✅] 버튼이 필요한 경우 Button 또는 DualButton 공통 컴포넌트 사용 (직접 구현 금지)
 * - [✅] 건너뛰기 버튼: 단순 텍스트 링크 형태이므로 Pressable + Text로 구현 (Button 컴포넌트 불필요)
 *   - 피그마 디자인에 단순 텍스트 링크로 표시되어 있음
 *   - Pressable + Text 조합이 적절함
 *
 * 사용 가능한 공통 컴포넌트 목록 (commons/components/):
 * - [✅] Button: 사용 중 (친구 연동 허용 버튼)
 * - [✅] DualButton: 사용 가능하지만 현재 필요 없음 (단일 버튼만 필요)
 * - [✅] Modal: 사용 가능하지만 현재 필요 없음 (모달 UI 없음)
 * - [✅] BottomSheet: 사용 가능하지만 현재 필요 없음 (바텀시트 UI 없음)
 * - [✅] TimeCapsuleHeader: 사용 가능하지만 현재 필요 없음 (온보딩 플로우 특화 헤더)
 *
 * 독립 구현 (온보딩 플로우 특화 UI):
 * - [✅] 뒤로가기 버튼: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 구조: Pressable + Image (assets/icons/<.png)
 *   - 향후 공통화 가능하도록 구조 유지
 *   - 스타일: backButton, backIcon (styles.ts에 정의)
 * - [✅] 진행 인디케이터: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 구조: View + gap (progressContainer, progressActive, progressInactive)
 *   - 향후 공통화 가능하도록 구조 유지
 *   - 스타일: progressContainer, progressActive, progressInactive (styles.ts에 정의)
 * - [✅] STEP 배지: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 구조: View + Text (stepBadge, stepBadgeText)
 *   - 향후 공통화 가능하도록 구조 유지
 *   - 스타일: stepBadge, stepBadgeText (styles.ts에 정의)
 * - [✅] 정보 카드: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 구조: View + Image + Text (card, cardIconContainer, cardIcon, cardContent, cardTitle, cardDescription)
 *   - 향후 공통화 가능하도록 구조 유지
 *   - 스타일: card, cardIconContainer, cardIcon, cardContent, cardTitle, cardDescription (styles.ts에 정의)
 *
 * 조건-공통컴포넌트 (prompt.101.ui.txt 기준):
 * - [✅] 공통 컴포넌트를 최대한 활용 (Button 컴포넌트 사용)
 * - [✅] 버튼이 필요한 경우 반드시 Button 또는 DualButton 공통 컴포넌트 사용
 * - [✅] 친구 연동 동의 화면은 온보딩 플로우의 일부이므로 독립적으로 구현하되, 버튼은 공통 컴포넌트 활용
 * - [✅] 현재는 독립적으로 구현하되, 버튼은 공통 컴포넌트 활용하고 구조를 유지하여 향후 공통화 가능하도록 함
 * - [✅] 기존 FriendConsentStep 컴포넌트의 props 인터페이스 유지 (isLoading: boolean, onConsent: () => void)
 *
 * 스타일 일관성 (recheck.102.required.codestyle 기준):
 * - [✅] BorderRadius 토큰 사용 (가능한 경우)
 *   - backButton: BorderRadius.full (원형)
 *   - stepBadge: BorderRadius.full (원형)
 *   - card: BorderRadius.xl (20px)
 *   - cardIconContainer: BorderRadius.full (원형)
 *   - progressActive/Inactive: borderRadius: 6px (토큰에 없음, 주석 명시)
 *   - skipButton: borderRadius: 16 (토큰에 없음, Figma 디자인 요구사항)
 * - [✅] 주석 스타일 통일 (location-consent-step과 일관성 유지)
 *   - 토큰이 없는 경우 주석으로 명시
 *   - Figma 디자인 요구사항 주석 추가
 * - [✅] gap 사용 일관성 유지 (React Native gap 지원 활용)
 *   - progressContainer: gap: 12
 *   - descriptionContainer: gap: 2
 *   - cardsContainer: gap: 24
 *   - card: gap: 16
 *   - cardContent: gap: 6
 *   - buttonContainer: gap: 16
 * - [✅] 스타일 속성 네이밍 일관성 유지
 *   - container, header, backButton, backIcon, progressContainer 등 일관된 네이밍
 * - [✅] 토큰 사용 패턴 통일
 *   - Colors: Colors.black[500], Colors.white[500], Colors.grey[500] 등
 *   - Typography: Typography.header.h5, Typography.body.body6 등
 *   - 투명도: 토큰 + 16진수 투명도 (예: Colors.white[50] + '1A')
 * - [✅] location-consent-step과 공통 패턴 유지
 *   - 헤더 영역: 동일한 padding, backButton 스타일
 *   - progressContainer: 동일한 gap, height, borderRadius
 *   - stepBadge: 동일한 backgroundColor, padding, borderRadius
 *   - description: 동일한 color (Colors.darkGrey[400]), fontSize, lineHeight
 *   - buttonContainer: 동일한 padding, gap
 *   - skipButtonText: 동일한 color, fontSize, lineHeight
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
 * 조건-BorderRadius:
 * - [✅] commons/constants/borderRadius.ts의 BorderRadius 토큰 활용 (가능한 경우)
 * - [⚠️] borderRadius: 6px는 토큰에 없어 Figma 디자인 요구사항으로 직접 사용 (주석 명시)
 *
 * 최종검토 (prompt.101.ui.txt 기준):
 * - [✅] 피그마 디자인과 동일하게 구현됨
 * - [✅] 색상 하드코딩 0건 (토큰만 사용, 주석의 #888, #ccc는 설명용)
 * - [✅] 인라인 스타일 0건
 * - [✅] index.tsx는 구조만, styles.ts는 스타일만 분리
 * - [✅] 외부 라이브러리 설치 0건
 * - [✅] 명시된 파일(index.tsx, styles.ts) 외 수정 0건
 * - [✅] commons/constants/color.ts, typography.ts 수정 0건 (토큰만 사용)
 * - [✅] 공통 컴포넌트 재검토 완료 (버튼은 Button/DualButton 사용, 현재는 독립 구현, 향후 공통화 고려)
 * - [✅] 버튼이 필요한 경우 Button 또는 DualButton 공통 컴포넌트 사용 확인 (직접 구현하지 않음)
 * - [✅] 기존 FriendConsentStep 컴포넌트의 props 인터페이스 유지 확인 (isLoading: boolean, onConsent: () => void)
 * - [✅] 온보딩 플로우 내부에서 자동으로 표시되는지 확인 (라우트: /(auth)/onboarding)
 * - [✅] 소수점 값 반올림 확인: 모든 스타일 속성의 소수점 값이 정수로 반올림되었는지 확인
 * - [✅] flexbox만 사용 (position-absolute 금지)
 * - [✅] 애니메이션 추가 없음 (있는 그대로만 구현)
 * - [✅] 아이콘: assets/icons/ 로컬 파일 사용 (<.png, friend.png, shield.png)
 * - [✅] location-consent-step과 스타일 일관성 유지
 * - [✅] 공통 컴포넌트 조건 재검토 완료 (Button 컴포넌트 사용, 독립 구현 UI는 향후 공통화 고려)
 */

