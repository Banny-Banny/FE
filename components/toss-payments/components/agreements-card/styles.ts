/**
 * components/agreements-card/styles.ts
 *
 * @version 2.1 - Figma Design 정밀 구현 (node 429:368)
 * @figma-node 429:368 (Container19)
 * @figma-size 345×259px
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 1px 단위 정확히 반영
 * - [x] 패딩 17px 정확히 적용
 * - [x] 전체 동의 섹션 높이 57px
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';
import { sharedStyles } from '../shared/styles';

export const styles = StyleSheet.create({
  // 카드 컨테이너
  // Figma: Container19 (345×259px)
  // minHeight 제거하여 내용물에 맞게 높이 자동 조정
  agreementsCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey[300], // Figma: #e5e7eb
  },

  cardBorder: sharedStyles.cardBorder,

  // 전체 동의 섹션
  // Figma: CheckboxItem (429:370) - 311.016×56.992px
  // 패딩: 좌우 17px, 내부 컨텐츠 세로 가운데 정렬
  allAgreeRow: {
    paddingHorizontal: 17, // Figma: 정확히 17px
    height: 57, // Figma: 56.992px ≈ 57px (고정 높이)
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200], // Figma: #e0e0e0
    justifyContent: 'center', // 내부 컨텐츠 세로 가운데 정렬
  },

  // 체크박스 + 텍스트 행
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Figma: 체크박스와 텍스트 간격 약 10px
  },

  // 전체 동의 체크박스 (큰 사이즈)
  // Figma: Icon (429:402, 429:436) - 28×28px
  checkbox: {
    width: 28, // Figma: 정확히 28px
    height: 28, // Figma: 정확히 28px
    backgroundColor: Colors.white[50],
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.black[500], // Figma: #0a0a0a
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxBorder: {
    display: 'none', // border는 checkbox에 직접 적용
  },

  checkboxChecked: {
    backgroundColor: Colors.white[50],
    borderColor: Colors.black[500],
    borderWidth: 1.5,
  },

  // 전체 동의 체크마크
  checkboxCheckmark: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16, // 체크마크 크기
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    includeFontPadding: false,
  },

  // 개별 약관 체크박스 (작은 사이즈)
  // Figma: Icon (429:414, 429:418) - 24×24px
  checkboxSmall: {
    width: 24, // Figma: 정확히 24px
    height: 24, // Figma: 정확히 24px
    backgroundColor: Colors.white[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.darkGrey[500], // 개별 약관은 약간 더 연한 색
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxSmallChecked: {
    backgroundColor: Colors.white[50],
    borderColor: Colors.darkGrey[500],
    borderWidth: 1,
  },

  // 개별 약관 체크마크 (작은 사이즈)
  checkboxCheckmarkSmall: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // 더 작은 체크마크
    lineHeight: 14,
    fontWeight: '700',
    color: Colors.darkGrey[500],
    includeFontPadding: false,
  },

  // "전체 동의" 텍스트
  // Figma: Text (429:374)
  allAgreeText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18, // Figma: 정확히 18px
    lineHeight: 24, // Figma: 정확히 24px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.3125,
  },

  // 개별 약관 리스트
  // Figma: Container18 (429:376) - 311.016×159.994px
  agreementsList: {
    paddingHorizontal: 17, // Figma: 정확히 17px
    paddingTop: 8, // 전체동의와 첫 약관 사이 간격
    paddingBottom: 8, // 마지막 약관과 카드 하단 간격
  },

  // 각 약관 행
  // Figma: CheckboxItem1/2/3 (429:377, 429:385, 429:393)
  agreementRow: {
    height: 48, // Figma: 47.992px ≈ 48px (고정 높이)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 약관 텍스트
  // Figma: Text (429:408, 429:412, 429:417)
  agreementText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // Figma: 정확히 14px
    lineHeight: 20, // Figma: 정확히 20px
    fontWeight: '700',
    color: Colors.grey[800], // Figma: #585858
    letterSpacing: -0.1504,
  },

  // 화살표 버튼
  // Figma: IconBackgroundImage (429:381, 429:389, 429:397)
  chevronButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 화살표 아이콘
  chevronText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.grey[500],
    includeFontPadding: false,
  },
});

