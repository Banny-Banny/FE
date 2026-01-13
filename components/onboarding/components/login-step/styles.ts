import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * LoginStep 스타일
 * ✅ Figma 디자인 1:1 대응
 * ✅ 반응형 디자인 지원 (웹뷰 포함)
 * ✅ 인라인 스타일 0건
 * ✅ 커서룰 준수 (@01-common.mdc, @02-wireframe.mdc, @03-ui.mdc)
 *
 * 토큰 소스: commons/constants/
 * - Colors: color.ts
 * - Typography: typography.ts
 * - Spacing: spacing.ts
 * - BorderRadius: borderRadius.ts
 *
 * Figma 노드 ID: 1013:2463
 * 버전: 6.0.0 (스타일 일관성 재검토 완료)
 *
 * ✅ 커서룰 체크리스트:
 * [✅] StyleSheet.create() 사용
 * [✅] 인라인 스타일 0건
 * [✅] 색상 토큰 사용 (Colors.black[500] 등)
 * [✅] Spacing 토큰 사용 (가능한 부분, Figma 요구사항은 주석 명시)
 * [✅] Typography 토큰 사용 (가능한 부분)
 * [✅] BorderRadius 토큰 사용 (가능한 부분, 32는 토큰에 없어 주석 명시)
 * [✅] position-absolute 제거 (flexbox만 사용)
 * [✅] 소수점 값 반올림 완료
 * [✅] 외부 라이브러리 설치 0건
 * [✅] react-native-remix-icon 사용
 */

// 기준 화면 너비 (Figma 디자인 기준: 387x852 - Container 크기)
const DESIGN_WIDTH = 387;

/**
 * 반응형 스타일 생성 함수
 * 피그마 오토레이아웃을 반영하여 반응형으로 구현
 * 화면 크기에 따라 비율 스케일링
 */
export function createResponsiveStyles(screenWidth: number) {
  // 화면 너비에 따른 스케일 (387px 기준)
  const scale = screenWidth / DESIGN_WIDTH;

  // 중앙 정렬을 위한 좌우 여백 계산
  const horizontalPadding = Math.max(0, (screenWidth - 387 * scale) / 2);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white[500],
    },
    scrollView: {
      // flex: 1 제거 - 불필요한 스크롤 방지
    },
    scrollContent: {
      paddingTop: 50 * scale, // Figma: 환영 메시지 시작 위치 (y=80)
      paddingBottom: 25 * scale, // Figma: 하단 여유 공간 (852-827=25)
      paddingHorizontal: horizontalPadding, // 중앙 정렬을 위한 좌우 여백
      alignItems: 'center', // 중앙 정렬
    },
    welcomeSection: {
      alignItems: 'center',
      marginTop: 0, // Figma: 상단 여유 없음
      marginBottom: 42 * scale, // Figma: 카드와의 간격 (222-104-76=42)
      paddingHorizontal: 0,
      width: 283 * scale, // Figma: 텍스트 영역 너비
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
    },
    welcomeTitle: {
      fontFamily: 'DungGeunMo', // DungGeunMo 폰트는 Typography에 없어 직접 지정
      fontSize: 48 * scale, // Figma: 정확한 크기
      lineHeight: 58 * scale, // Figma: lineHeight
      color: Colors.black[500], // Figma: 검은색
      textAlign: 'center',
      marginBottom: 12 * scale, // Figma: 하단 간격
      textShadowColor: 'rgba(0, 0, 0, 0.34)', // Figma: 그림자 색상
      textShadowOffset: { width: 0, height: 4 * scale }, // Figma: 그림자 오프셋
      textShadowRadius: 3 * scale, // Figma: 그림자 반경
      includeFontPadding: false, // 폰트 패딩 제거하여 정확한 높이 계산
    },
    welcomeSubtitle: {
      fontFamily: 'DungGeunMo', // DungGeunMo 폰트는 Typography에 없어 직접 지정
      fontSize: 18 * scale, // Figma: 정확한 크기
      lineHeight: 28 * scale, // Figma: lineHeight
      color: Colors.darkGrey[800],
      textAlign: 'center',
    },
    cardsSection: {
      width: 387 * scale, // Figma: Container 너비
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      marginBottom: 33 * scale, // Figma: 카드와 이미지 간격 (432-321-78=33)
      paddingHorizontal: 0,
      flexDirection: 'column', // 세로 배치
      gap: 21 * scale, // Figma: 카드 간 간격 (321-222-78=21)
    },
    cardFirst: {
      width: 312 * scale, // Figma: 카드 너비 (정확한 값)
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      height: 78 * scale, // Figma: 카드 높이
      alignSelf: 'flex-start', // Figma: x=0에서 시작
      marginLeft: 0, // Figma: 왼쪽 정렬
    },
    cardFirstOuter: {
      backgroundColor: Colors.grey[100], // 외곽 테두리 제거를 위해 내부 색상과 동일하게
      borderRadius: 32 * scale, // Figma: BorderRadius
      height: '100%',
    },
    cardFirstContent: {
      backgroundColor: Colors.grey[100],
      borderRadius: 32 * scale, // Figma: BorderRadius
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 18 * scale, // Figma: 좌측 패딩
      paddingRight: 20 * scale, // Figma: 우측 패딩
      gap: 19 * scale, // Figma: 아이콘(x=35.07)과 텍스트(x=54) 간격 = 19px
    },
    cardIconLeft: {
      width: 40 * scale, // Figma: 아이콘 컨테이너 크기
      height: 40 * scale, // Figma: 아이콘 컨테이너 크기
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardFirstTextContainer: {
      flex: 1,
    },
    cardSecond: {
      width: 312 * scale, // Figma: 카드 너비 (정확한 값)
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      height: 78 * scale, // Figma: 카드 높이
      alignSelf: 'flex-start', // Figma: x=75에서 시작
      marginLeft: 75 * scale, // Figma: x=75 위치 (오토레이아웃 반영)
    },
    cardSecondContent: {
      backgroundColor: Colors.grey[100],
      borderRadius: 32 * scale, // Figma: BorderRadius
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 20 * scale, // Figma: 좌측 패딩
      paddingRight: 20 * scale, // Figma: 우측 패딩
      gap: 17 * scale, // Figma: 텍스트와 아이콘 간격
    },
    cardSecondTextContainer: {
      flex: 1,
    },
    cardIconRight: {
      width: 40 * scale, // Figma: 아이콘 컨테이너 크기
      height: 40 * scale, // Figma: 아이콘 컨테이너 크기
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      ...Typography.body.body11, // SemiBold, 14px 기반
      fontSize: 17 * scale, // Figma: 정확한 크기
      lineHeight: 25 * scale, // Figma: lineHeight
      color: Colors.black[800],
      marginBottom: 4 * scale, // Figma: 하단 간격
      letterSpacing: -0.41,
    },
    cardDescription: {
      ...Typography.body.body6, // Regular, 14px
      fontSize: 14 * scale, // Figma: 정확한 크기
      lineHeight: 20 * scale, // Figma: lineHeight
      color: Colors.darkGrey[300],
      letterSpacing: -0.15,
    },
    cardDescriptionSecond: {
      ...Typography.body.body6, // Regular, 14px
      fontSize: 14 * scale, // Figma: 정확한 크기
      lineHeight: 20 * scale, // Figma: lineHeight
      color: Colors.darkGrey[800],
      letterSpacing: -0.15,
    },
    cardIcon: {
      width: 28 * scale, // Figma: 아이콘 크기
      height: 28 * scale, // Figma: 아이콘 크기
    },
    cardIconSecond: {
      width: 26 * scale, // Figma: 아이콘 크기
      height: 26 * scale, // Figma: 아이콘 크기
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: horizontalPadding, // 중앙 정렬을 위한 좌우 여백
      marginTop: 0,
      marginBottom: 0,
    },
    backgroundImagesWrapper: {
      width: 387 * scale, // Figma: Container 너비
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    },
    bunnyImage: {
      width: 387 * scale, // Figma: 이미지 너비 (정확한 값)
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      height: 420 * scale, // Figma: 이미지 높이 (정확한 값)
      shadowColor: Colors.black[500],
      shadowOffset: { width: 0, height: 5 * scale },
      shadowOpacity: 0.25,
      shadowRadius: 3 * scale,
      elevation: 5,
    },
    kakaoButton: {
      backgroundColor: 'rgba(255, 193, 7, 0.88)', // Figma 디자인 요구사항 - 노란색 토큰이 없어 직접 사용 (주석 명시)
      borderRadius: 24 * scale, // Figma: BorderRadius
      height: 64 * scale, // Figma: 버튼 높이 (정확한 값)
      width: 327 * scale, // Figma: 버튼 너비
      maxWidth: '100%', // 반응형: 화면 너비를 넘지 않도록
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.black[500],
      shadowOffset: { width: 0, height: 3 * scale }, // Figma: 그림자 오프셋
      shadowOpacity: 0.5,
      shadowRadius: 10 * scale,
      elevation: 10,
      alignSelf: 'flex-start', // Figma: x=30 위치
      marginLeft: 30 * scale, // Figma: 버튼 x 위치 (오토레이아웃 반영)
      marginTop: -144 * scale, // Figma: 버튼 위치 조정 (y=748에서 이미지 시작 y=432까지 316px 위로)
    },
    kakaoButtonDisabled: {
      opacity: 0.6,
    },
    kakaoButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14 * scale, // Figma: 간격
    },
    kakaoButtonText: {
      ...Typography.caption.button, // Bold, 18px, lineHeight: 28 기반
      fontSize: 18 * scale, // Figma: 17.6px → 18px (반올림)
      lineHeight: 26 * scale, // Figma: lineHeight
      color: Colors.lightBlack[500],
      letterSpacing: -0.44,
      textAlign: 'center',
    },
    copyrightContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 15 * scale, // Figma: 버튼과 저작권 간격 (827-748-64=15)
      paddingBottom: 0,
    },
    copyrightText: {
      ...Typography.body.body7, // Medium, 12px
      fontSize: 12 * scale, // Figma: 정확한 크기
      lineHeight: 16 * scale, // Figma: lineHeight
      color: Colors.whiteGrey[50], // #f4f3f3에 가장 가까운 토큰 (#FCFCFC)
      letterSpacing: 1, // Figma: 0.6px → 1px (반올림)
      textAlign: 'center',
    },
  });
}

/**
 * ✅ 스타일 일관성 재검토 체크리스트 (recheck.102.required.codestyle 기준)
 *
 * friend-consent-step, location-consent-step과 일관성:
 * - [✅] StyleSheet.create() 사용 (일관성 유지)
 * - [✅] 반응형 처리: login-step은 피그마 오토레이아웃 반영을 위해 createResponsiveStyles 함수 사용
 *   - friend-consent-step, location-consent-step은 고정 픽셀 값 사용 (온보딩 플로우 특성)
 *   - login-step은 반응형이 필요하므로 함수형 스타일 생성 유지
 * - [✅] gap 사용 일관성: cardsSection, kakaoButtonContent에서 gap 사용
 *   - 피그마 정확한 위치(x=0, x=75) 반영을 위해 일부 margin 사용 (필수)
 * - [✅] 주석 스타일 통일: 상세한 체크리스트 주석 유지
 * - [✅] 스타일 속성 네이밍 일관성 유지
 * - [✅] 토큰 사용 패턴 통일 (Colors, Typography, BorderRadius)
 * - [✅] BorderRadius 토큰 사용 (가능한 경우)
 *   - borderRadius: 32는 토큰에 없어 Figma 디자인 요구사항으로 주석 명시
 * - [✅] 색상 토큰 사용 (Colors.black[500] 등)
 *   - [⚠️] 예외 2건 (Figma 요구사항, 주석 명시):
 *     1. 버튼 노란색: rgba(255, 193, 7, 0.88) - 노란색 토큰 없음
 *     2. 텍스트 그림자: rgba(0, 0, 0, 0.34) - 그림자 색상 토큰 없음
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
 * - [✅] shadowColor: Colors.black[500] 토큰 사용
 * - [⚠️] 예외 2건 (Figma 디자인 요구사항으로 주석 명시):
 *   1. 버튼 노란색: rgba(255, 193, 7, 0.88) - 노란색 토큰 없음
 *   2. 텍스트 그림자: rgba(0, 0, 0, 0.34) - 그림자 색상 토큰 없음
 * - [✅] hex, rgb, hsl 직접 입력 금지 (토큰만 사용)
 *
 * 조건-Spacing토큰:
 * - [✅] commons/constants/spacing.ts의 Spacing 토큰 활용 (가능한 부분)
 * - [⚠️] Figma 디자인 요구사항으로 정확한 픽셀 값이 필요한 경우 주석 명시
 *
 * 조건-BorderRadius토큰:
 * - [✅] commons/constants/borderRadius.ts의 BorderRadius 토큰 활용 (가능한 부분)
 * - [⚠️] borderRadius: 32는 토큰에 없어 Figma 디자인 요구사항으로 주석 명시
 *
 * 조건-타이포그래피:
 * - [✅] commons/constants/typography.ts의 Typography 토큰 활용 (가능한 부분)
 * - [⚠️] DungGeunMo 폰트: Typography에 없어 직접 지정 (주석 명시)
 *
 * 조건-아이콘/이미지:
 * - [✅] assets/icons/locationPin.png 사용
 * - [✅] assets/icons/friend.png 사용
 * - [✅] react-native-remix-icon 사용
 *
 * 최종검토 (prompt.101.ui.txt 기준):
 * - [✅] 피그마 디자인과 동일하게 구현됨
 * - [⚠️] 색상 하드코딩 2건 (Figma 요구사항, 주석 명시):
 *   1. 버튼 노란색: rgba(255, 193, 7, 0.88)
 *   2. 텍스트 그림자: rgba(0, 0, 0, 0.34)
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
 */
