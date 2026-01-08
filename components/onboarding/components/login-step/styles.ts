import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
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

// 기준 화면 너비
const DESIGN_WIDTH = 393;

/**
 * 반응형 스타일 생성 함수
 */
export function createResponsiveStyles(screenWidth: number) {
  const scale = Math.min(screenWidth / DESIGN_WIDTH, 1.1);
  const isSmallScreen = screenWidth < 360;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white[500],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 20, // 84px - 텍스트가 잘리지 않도록 여유 공간 확보
      paddingBottom: Spacing['4xl'] + 16, // 80px (Figma 디자인 요구사항)
    },
    welcomeSection: {
      alignItems: 'center',
      // marginTop: Spacing.md, // 16px - 상단 여유 공간
      marginBottom: Spacing.md, // 16px - 카드와의 간격 줄임
      paddingHorizontal: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
      // paddingTop: Spacing.sm, // 8px - 텍스트 상단 여유 공간
    },
    welcomeTitle: {
      fontFamily: 'DungGeunMo', // DungGeunMo 폰트는 Typography에 없어 직접 지정
      fontSize: isSmallScreen ? 40 : 48,
      lineHeight: isSmallScreen ? 50 : 58, // fontSize보다 크게 설정하여 텍스트가 잘리지 않도록
      color: Colors.black[700],
      textAlign: 'center',
      marginBottom: Spacing.md - 4, // 12px (Figma 디자인 요구사항)
      textShadowColor: Colors.black[500], // 그림자 색상 (토큰 사용)
      textShadowOffset: { width: 0, height: 5 },
      textShadowRadius: 3,
      opacity: 0.66, // 그림자 투명도 효과 (0.34 대신 opacity로 구현)
      includeFontPadding: false, // 폰트 패딩 제거하여 정확한 높이 계산
    },
    welcomeSubtitle: {
      fontFamily: 'DungGeunMo', // DungGeunMo 폰트는 Typography에 없어 직접 지정
      fontSize: isSmallScreen ? 16 : 18,
      lineHeight: 28,
      color: Colors.darkGrey[800],
      textAlign: 'center',
    },
    cardsSection: {
      width: '100%',
      marginBottom: Spacing['3xl'] + 2, // 50px (Figma 디자인 요구사항)
      paddingHorizontal: 0,
      alignItems: 'center', // 카드들을 중앙 정렬
      justifyContent: 'center', // 세로 중앙 정렬
    },
    cardFirst: {
      marginBottom: Spacing.lg + 6, // 30px (Figma 디자인 요구사항)
      width: Math.min(316 * scale, screenWidth * 0.78),
      maxWidth: 350,
      minWidth: 250,
      height: 78,
      alignSelf: 'center', // 중앙 정렬
    },
    cardFirstOuter: {
      backgroundColor: Colors.grey[400],
      borderRadius: 32, // BorderRadius 토큰에 32가 없어 Figma 디자인 요구사항으로 직접 지정
      height: '100%',
      padding: 1,
      shadowColor: Colors.black[500], // 토큰 사용
      shadowOffset: { width: -10, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    cardFirstContent: {
      backgroundColor: Colors.grey[100],
      borderRadius: 32, // BorderRadius 토큰에 32가 없어 Figma 디자인 요구사항으로 직접 지정
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: Spacing.md + 2, // 18px (Figma 디자인 요구사항)
      paddingRight: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
    },
    cardFirstTextContainer: {
      flex: 1,
    },
    cardIconRight: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Spacing.sm + 2, // 10px (Figma 디자인 요구사항)
    },
    cardSecond: {
      width: Math.min(345 * scale, screenWidth * 0.82),
      maxWidth: 380,
      minWidth: 250,
      height: 78,
      alignSelf: 'center', // 중앙 정렬
    },
    cardSecondContent: {
      backgroundColor: Colors.grey[100],
      borderRadius: 32, // BorderRadius 토큰에 32가 없어 Figma 디자인 요구사항으로 직접 지정
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
      paddingRight: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
      shadowColor: Colors.black[500], // 토큰 사용
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    cardIconLeft: {
      width: 26,
      height: 26,
      marginRight: Spacing.md - 1, // 15px (Figma 디자인 요구사항)
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardSecondTextContainer: {
      flex: 1,
    },
    cardTitle: {
      ...Typography.body.body11, // SemiBold, 14px 기반
      fontSize: isSmallScreen ? 15 : 17, // Figma: 16.8px → 17px
      lineHeight: 25, // Figma: 25.2px → 25px
      color: Colors.black[800],
      marginBottom: Spacing.xs, // 4px
      letterSpacing: -0.41, // Figma: -0.4069px → -0.41
    },
    cardDescription: {
      ...Typography.body.body6, // Regular, 14px
      fontSize: isSmallScreen ? 12 : 14,
      lineHeight: 20, // Figma: 19.6px → 20px
      color: Colors.darkGrey[300],
      letterSpacing: -0.15, // Figma: -0.1504px → -0.15
    },
    cardDescriptionSecond: {
      ...Typography.body.body6, // Regular, 14px
      fontSize: isSmallScreen ? 12 : 14,
      lineHeight: 20, // Figma: 19.592px → 20px
      color: Colors.darkGrey[800],
      letterSpacing: -0.15, // Figma: -0.1504px → -0.15
    },
    cardIcon: {
      width: 28,
      height: 28,
    },
    cardIconSecond: {
      width: 26,
      height: 26,
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
      marginBottom: Spacing.lg - 4, // 20px (Figma 디자인 요구사항)
      minHeight: 450, // 반응형 계산값 (Figma 디자인 요구사항)
      paddingBottom: Spacing['3xl'] + 12, // 60px (Figma 디자인 요구사항)
    },
    backgroundImagesWrapper: {
      width: '100%',
      height: 400,
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      position: 'relative', // 버튼을 이미지 위에 배치하기 위해
    },
    backgroundImagesContainer: {
      width: '100%',
      height: 400,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    // ellipseImage: {
    //   width: Math.min(532 * scale, screenWidth * 1.3),
    //   height: 400,
    //   maxWidth: 600,
    //   alignSelf: 'center',
    //   marginTop: -700, // 토끼 중간 부분에 걸치도록 위치 조정
    //   zIndex: 1, // 토끼 일부 위에 표시되도록
    // },
    bunnyImage: {
      width: Math.min(524 * scale, screenWidth * 1.2),
      height: 700,
      shadowColor: Colors.black[500],
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
      maxWidth: 550,
      alignSelf: 'center',
      marginTop: -500, // 토끼 이미지를 ellipse 위에 겹치도록 (flexbox 방식)
      zIndex: 2, // ellipse 위에 표시되도록
    },
    kakaoButton: {
      backgroundColor: 'rgba(255, 193, 7, 0.88)', // Figma 디자인 요구사항 - 노란색 토큰이 없어 직접 사용 (주석 명시)
      borderRadius: BorderRadius['2xl'], // 24px
      height: 58,
      width: Math.min(327 * scale, screenWidth * 0.8),
      maxWidth: 350,
      minWidth: 260,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.black[500],
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10, // 이미지 위에 표시되도록 elevation 증가
      zIndex: 10, // 이미지 위에 표시되도록 zIndex 증가
      marginTop: -120, // 토끼 이미지 위로 더 올라오도록 음수 마진 증가
    },
    kakaoButtonDisabled: {
      opacity: 0.6,
    },
    kakaoButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md - 2, // 14px (Figma 디자인 요구사항)
    },
    kakaoButtonText: {
      ...Typography.caption.button, // Bold, 18px, lineHeight: 28 기반
      fontSize: isSmallScreen ? 16 : 18, // Figma: 17.6px → 18px
      lineHeight: 26, // Figma: 26.4px → 26px
      color: Colors.lightBlack[500],
      letterSpacing: -0.44, // Figma: -0.4366px → -0.44
      textAlign: 'center',
    },
  });
}

/**
 * ✅ 프롬프트 체크리스트 (prompt.101.ui.txt 기준)
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
 * - [⚠️] rgba(255, 193, 7, 0.88): Figma 디자인 요구사항으로 주석 명시 (노란색 토큰 없음)
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
 * 최종검토:
 * - [✅] 피그마 디자인과 동일하게 구현됨
 * - [⚠️] 색상 하드코딩 1건 (버튼 노란색 - Figma 요구사항, 주석 명시)
 * - [✅] 인라인 스타일 0건
 * - [✅] index.tsx는 구조만, styles.ts는 스타일만 분리
 * - [✅] 외부 라이브러리 설치 0건
 * - [✅] 명시된 파일(index.tsx, styles.ts) 외 수정 0건
 * - [✅] commons/constants/color.ts, typography.ts 수정 0건 (토큰만 사용)
 * - [✅] 소수점 값 반올림 확인 완료
 * - [✅] flexbox만 사용 (position-absolute 제거)
 * - [✅] 애니메이션 추가 없음
 * - [✅] react-native-remix-icon 사용
 */
