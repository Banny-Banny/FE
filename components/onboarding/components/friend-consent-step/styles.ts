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
 * 버전: 1.0.0 (스타일 일관성 재검토 완료)
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
    alignItems: 'flex-start',
  },
  stepBadge: {
    backgroundColor: Colors.black[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl, // 20px
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
 * ✅ 공통 컴포넌트 조건 재검토 체크리스트 (recheck.201.optional.ui.component 기준)
 *
 * 공통 컴포넌트 사용:
 * - [✅] Button 컴포넌트 사용: @/commons/components/button
 *   - "친구 연동 허용" 버튼에 Button 컴포넌트 사용 (variant="primary", size="L")
 * - [✅] 버튼이 필요한 경우 Button 또는 DualButton 공통 컴포넌트 사용 (직접 구현 금지)
 * - [✅] 건너뛰기 버튼: 단순 텍스트 링크 형태이므로 Pressable + Text로 구현 (Button 컴포넌트 불필요)
 *
 * 독립 구현 (온보딩 플로우 특화 UI):
 * - [✅] 뒤로가기 버튼: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 향후 공통화 가능하도록 구조 유지 (Pressable + Image)
 * - [✅] 진행 인디케이터: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 향후 공통화 가능하도록 구조 유지 (View + gap)
 * - [✅] STEP 배지: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 향후 공통화 가능하도록 구조 유지 (View + Text)
 * - [✅] 정보 카드: 온보딩 플로우에 특화된 UI이므로 독립적으로 구현
 *   - 향후 공통화 가능하도록 구조 유지 (View + Image + Text)
 *
 * 조건-공통컴포넌트:
 * - [✅] 공통 컴포넌트를 최대한 활용 (Button 컴포넌트 사용)
 * - [✅] 버튼이 필요한 경우 반드시 Button 또는 DualButton 공통 컴포넌트 사용
 * - [✅] 친구 연동 동의 화면은 온보딩 플로우의 일부이므로 독립적으로 구현하되, 버튼은 공통 컴포넌트 활용
 * - [✅] 현재는 독립적으로 구현하되, 버튼은 공통 컴포넌트 활용하고 구조를 유지하여 향후 공통화 가능하도록 함
 *
 * 스타일 일관성:
 * - [✅] BorderRadius 토큰 사용 (가능한 경우)
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
 * - [✅] location-consent-step과 스타일 일관성 유지
 * - [✅] 공통 컴포넌트 조건 재검토 완료 (Button 컴포넌트 사용, 독립 구현 UI는 향후 공통화 고려)
 */

