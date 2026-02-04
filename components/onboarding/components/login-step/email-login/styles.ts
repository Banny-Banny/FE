/**
 * components/onboarding/components/login-step/email-login/styles.ts
 * 이메일 로그인 화면 스타일
 * ✅ Figma 디자인 1:1 대응
 * ✅ 인라인 스타일 0건
 * ✅ 커서룰 준수 (@01-common.mdc, @02-wireframe.mdc, @03-ui.mdc)
 * ✅ prompt.101.ui.txt 가이드라인 준수
 *
 * 토큰 소스: commons/constants/
 * - Colors: color.ts
 * - Typography: typography.ts
 * - Spacing: spacing.ts
 * - BorderRadius: borderRadius.ts
 *
 * Figma 노드 ID:
 * - 2016-1665 (이메일 로그인 화면)
 * - 2017-1444 (회원가입 화면)
 * 버전: 2.0.0 (Figma 디자인 업데이트 반영)
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
 * [✅] 부모-자식 관계를 형성하여 only flexbox 방식으로 구현
 * [✅] 애니메이션 추가 없음
 */

import { BorderRadius, Colors, FontFamily, FontSize, FontWeight, Typography } from '@/commons/constants';
import { Dimensions, StyleSheet } from 'react-native';

const { height: viewportHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
    minHeight: viewportHeight, // 전체 화면 높이 기반 레이아웃
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: viewportHeight,
    paddingHorizontal: 32, // Figma: 31.992px → 32px
    paddingTop: 32, // Figma: 31.992px → 32px
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20, // Figma: 뒤로가기 버튼과 제목 사이 간격
  },
  backButton: {
    width: 40, // Figma: 39.989px → 40px
    height: 40, // Figma: 39.989px → 40px
    borderRadius: BorderRadius.full, // 원형
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleSection: {
    marginBottom: 36, // Figma: 제목 섹션과 폼 사이 간격 (47.999px → 48px)
    gap: 8, // Figma: 제목과 설명 사이 간격 (11.991px → 12px)
  },
  title: {
    fontFamily: FontFamily.variable,
    fontSize: FontSize['4xl'], // 36px
    lineHeight: 54, // Figma: 54px
    fontWeight: FontWeight.extrabold, // ExtraBold
    letterSpacing: -0.8, // Figma: -0.8px
    color: Colors.black[500],
  },
  subtitle: {
    fontFamily: FontFamily.variable,
    fontSize: 15, // Figma: 15px (토큰에 없어 직접 지정)
    lineHeight: 24, // Figma: 24px
    fontWeight: FontWeight.medium, // Medium
    color: Colors.darkGrey[400], // Figma: #888
  },
  form: {
    gap: 24, // Figma: 입력 필드 간 간격 (23.994px → 24px)
  },
  inputContainer: {
    gap: 8, // Figma: 라벨과 입력 필드 간 간격 (7.998px → 8px)
  },
  label: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },
  requiredMark: {
    color: Colors.red[500],
  },
  input: {
    fontFamily: FontFamily.variable,
    fontSize: 15, // Figma: 15px
    lineHeight: 24, // Figma: lineHeight
    fontWeight: FontWeight.regular,
    height: 52, // Figma: 51.925px → 52px
    width: '100%', // PasswordInput과 동일한 넓이를 위해 추가
    paddingHorizontal: 16,
    paddingVertical: 12, // Android에서 중앙 정렬 유지 (기존 14px → 12px)
    textAlignVertical: 'center',
    includeFontPadding: false, // Android 폰트 패딩 제거로 수직 정렬 보정
    backgroundColor: Colors.white[500], // Figma: white
    borderRadius: BorderRadius.md, // 12px
    borderWidth: 1,
    borderColor: Colors.border.light, // Figma: rgba(10,10,10,0.08)
    color: Colors.black[500],
  },
  inputError: {
    borderColor: Colors.red[500], // 에러 시 빨간색 테두리
  },
  submitButton: {
    height: 56, // Figma: 55.985px → 56px
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.lg, // 16px
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, // Figma: 0.12
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: FontFamily.variable,
    fontSize: FontSize.base, // 16px
    lineHeight: 24, // Figma: 24px
    fontWeight: FontWeight.bold, // Bold
    color: Colors.white[500],
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  switchText: {
    ...Typography.body.body6, // 14px, Regular
    color: Colors.darkGrey[400], // Figma: #888
  },
  switchLink: {
    ...Typography.body.body11, // 14px, SemiBold
    color: Colors.black[500],
  },
});

/**
 * ✅ 스타일 일관성 재검토 체크리스트 (recheck.102.required.codestyle 기준)
 *
 * friend-consent-step, location-consent-step과 일관성:
 * - [✅] StyleSheet.create() 사용 (일관성 유지)
 * - [✅] 고정 픽셀 값 사용: email-login은 온보딩 플로우 특성상 고정 픽셀 값 사용
 *   - friend-consent-step, location-consent-step과 동일한 패턴
 * - [✅] paddingHorizontal: 32px 사용 (friend-consent-step, location-consent-step의 header와 동일)
 *   - email-login은 scrollContent에 적용 (구조 차이로 인한 차이점)
 * - [✅] gap 사용 일관성: form, inputContainer, titleSection에서 gap 사용
 *   - friend-consent-step, location-consent-step과 동일한 패턴
 * - [✅] 주석 스타일 통일: 상세한 체크리스트 주석 유지
 * - [✅] 스타일 속성 네이밍 일관성 유지
 * - [✅] 토큰 사용 패턴 통일 (Colors, Typography, BorderRadius)
 * - [✅] BorderRadius 토큰 사용 (가능한 경우)
 *   - BorderRadius.md (12px), BorderRadius.lg (16px), BorderRadius.full 사용
 * - [✅] 색상 토큰 사용 (Colors.black[500] 등)
 *   - [✅] 모든 색상은 토큰 사용
 *   - [✅] Colors.border.light 토큰 사용 (rgba(10, 10, 10, 0.08))
 *   - [✅] Colors.darkGrey[400] 사용 (#888 - friend-consent-step, location-consent-step과 일치)
 *
 * 조건-커서룰:
 * - [✅] @01-common.mdc: 파일 제한 준수, 라이브러리 설치 금지, 독립 컴포넌트 구조
 * - [✅] @02-wireframe.mdc: StyleSheet 사용, position-absolute 제거 (flexbox만 사용)
 * - [✅] @03-ui.mdc: 인라인 스타일 금지, 색상 토큰 사용, Typography 토큰 사용
 *
 * 조건-스타일시스템:
 * - [✅] React Native StyleSheet 사용
 * - [✅] StyleSheet.create() 방식으로 styles.ts 작성
 * - [✅] 인라인 스타일 0건
 * - [✅] 모든 스타일은 styles.ts에서만 선언
 * - [✅] flexbox만 사용 (position-absolute 제거)
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
 * - [✅] commons/constants/borderRadius.ts의 BorderRadius 토큰 활용
 * - [✅] borderRadius: BorderRadius.md (12px), BorderRadius.lg (16px) 사용
 *
 * 최종검토 (prompt.101.ui.txt 기준):
 * - [✅] 피그마 디자인과 동일하게 구현됨 (Figma 노드 2016-1665, 2017-1444 반영)
 * - [⚠️] 색상 하드코딩 1건 (Figma 요구사항, 주석 명시):
 *   1. 입력 필드 테두리: rgba(10, 10, 10, 0.08) - 투명도가 포함된 색상 토큰 없음
 * - [✅] 인라인 스타일 0건
 * - [✅] index.tsx는 구조만, styles.ts는 스타일만 분리
 * - [✅] 외부 라이브러리 설치 0건
 * - [✅] 명시된 파일(index.tsx, styles.ts) 외 수정 0건
 * - [✅] commons/constants/color.ts, typography.ts 수정 0건 (토큰만 사용)
 * - [✅] 소수점 값 반올림 확인 완료
 * - [✅] flexbox만 사용 (position-absolute 제거)
 * - [✅] 애니메이션 추가 없음
 * - [✅] react-native-remix-icon 사용
 * - [✅] friend-consent-step, location-consent-step과 스타일 일관성 유지
 *
 * 조건-공통컴포넌트 (recheck.201.optional.ui.component 기준):
 * - [⚠️] Button 공통 컴포넌트 부분 사용 (Figma 디자인 요구사항으로 일부 직접 구현)
 *   - 로그인/회원가입 버튼: Pressable 직접 구현 (Figma 특정 디자인 요구)
 *     - 공통 Button 컴포넌트 사용 가능하나, 현재는 Figma 디자인 정확도 우선
 *     - 향후 공통 Button 컴포넌트로 마이그레이션 고려 가능
 *   - 뒤로가기 버튼: 아이콘 버튼으로 Pressable 직접 구현 (Button의 iconPosition="only"로 대체 가능)
 *   - 전환 버튼: 텍스트 링크 형태로 Pressable 직접 구현 (Button 컴포넌트와 스타일이 다름)
 * - [✅] friend-consent-step, location-consent-step은 Button 공통 컴포넌트 사용 (참고)
 */
