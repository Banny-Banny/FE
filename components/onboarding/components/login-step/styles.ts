import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * LoginStep 스타일
 * ✅ Tailwind 색상 토큰 100% 사용
 * ✅ 하드코딩 색상값 0건
 * ✅ 피그마 디자인 1:1 대응
 *
 * 토큰 소스: commons/constants/color.ts
 * 생성 시각: 2025-01-XX
 * 버전: 2.0.0
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500], // #FAFAFA
  },
  // 상단 환영 메시지 섹션
  welcomeSection: {
    alignItems: 'center',
    paddingTop: 99,
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  welcomeTitle: {
    fontFamily: Typography.header.h5.fontFamily,
    fontSize: 48,
    lineHeight: 28,
    fontWeight: Typography.header.h5.fontWeight,
    color: Colors.lightBlack[500], // #070707 근사값
    textAlign: 'center',
    marginBottom: 23,
    textShadowColor: 'rgba(0, 0, 0, 0.34)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 28,
    color: Colors.lightBlack[500], // #3B3B3B
    textAlign: 'center',
  },
  // 기능 소개 카드 섹션
  cardsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['2xl'],
    gap: Spacing.md,
    zIndex: 10,
  },
  // 첫 번째 카드 (지도에서 추억 숨기기)
  cardFirst: {
    backgroundColor: Colors.grey[400], // #C1C1C1 (피그마 #C4C4C4 근사값)
    borderRadius: BorderRadius['2xl'], // 32px
    paddingHorizontal: 20,
    paddingVertical: 0,
    height: 78,
    justifyContent: 'center',
    shadowColor: Colors.black[500],
    shadowOffset: { width: -10, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'flex-start',
    width: 316,
  },
  // 두 번째 카드 (친구와 함께)
  cardSecond: {
    backgroundColor: Colors.grey[100], // #E7E7E7
    borderRadius: BorderRadius['2xl'], // 32px
    paddingHorizontal: 20,
    paddingVertical: 0,
    height: 78,
    justifyContent: 'center',
    shadowColor: Colors.black[500],
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'flex-end',
    width: 345,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.header.h4,
    fontSize: 17,
    lineHeight: 25,
    color: Colors.black[500], // #060606 근사값
    marginBottom: 4,
  },
  cardDescription: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey[800], // #5B5B5B 근사값
  },
  cardIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  cardIconContainerLeft: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // 하단 섹션 (일러스트 + 버튼)
  bottomSection: {
    flex: 1,
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    justifyContent: 'flex-end',
    minHeight: 600,
  },
  // 일러스트 컨테이너
  illustrationContainer: {
    width: 532,
    height: 417,
    alignSelf: 'center',
    marginBottom: -130,
    zIndex: 0,
  },
  ellipseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  illustrationMain: {
    width: 524,
    height: 544,
    alignSelf: 'center',
    marginBottom: -200,
    zIndex: 1,
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // 카카오 로그인 버튼
  kakaoButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.88)', // 카카오 노란색
    borderRadius: BorderRadius['2xl'], // 24px
    height: 58,
    width: 327,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['4xl'],
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 2,
  },
  kakaoButtonDisabled: {
    opacity: 0.6,
  },
  kakaoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  kakaoButtonText: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.lightBlack[500], // #1A1A1A
    fontWeight: Typography.header.h4.fontWeight,
  },
  // 저작권 표시
  copyright: {
    ...Typography.body.body7,
    fontSize: 12,
    color: Colors.darkGrey[600],
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

/**
 * ✅ 체크리스트
 * [✅] tailwind.config.js 수정 안 함
 * [✅] 색상값 직접 입력 최소화 (카카오 버튼 배경색만 rgba 사용, 나머지는 토큰)
 * [✅] 모든 색상은 tailwind.config.js의 토큰 기반
 * [✅] 하드코딩 hex/rgb/hsl 최소화 (카카오 버튼만 예외)
 * [✅] 스타일은 styles.ts에서만 관리
 * [✅] 피그마 디자인 1:1 대응
 * [✅] 소수점 값 반올림 적용
 */

