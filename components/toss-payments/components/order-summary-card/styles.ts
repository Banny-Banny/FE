/**
 * components/order-summary-card/styles.ts
 *
 * @version 2.1 - Figma Design 정밀 구현 (node 429:322)
 * @figma-node 429:322 (Container13)
 * @figma-size 345×244px
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 1px 단위 정확히 반영
 * - [x] 패딩 17px 정확히 적용
 * - [x] 섹션 간 간격 정밀 구현
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';
import { sharedStyles } from '../shared/styles';

export const styles = StyleSheet.create({
  // 카드 컨테이너
  // Figma: Container13 (345×244px)
  // minHeight 제거하여 내용물에 맞게 높이 자동 조정
  orderSummaryCard: {
    width: '100%',
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey[300], // Figma: #e5e7eb
  },

  cardBorder: sharedStyles.cardBorder,

  cardContent: {
    position: 'relative',
    width: '100%',
    // flex: 1 제거하여 내용물 크기에 맞게 조정
    justifyContent: 'space-between', // 합계를 하단에 고정
  },

  // 헤더 섹션 (주문 상품)
  // Figma: Container (429:324) - 310.997×27.998px
  // 패딩: 좌우 17px, 상단 17px
  orderSummaryHeader: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 8, // 헤더와 참여 인원 사이 간격 8px
  },

  // 제목 "주문 상품"
  // Figma: Text (429:327)
  orderSummaryTitle: {
    fontFamily: 'Pretendard Variable',
    fontSize: 20, // Figma: 정확히 20px
    lineHeight: 28, // Figma: 정확히 28px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.4492,
  },

  // 참여 인원 섹션
  // Figma: Container2 (429:330) - 310.997×36.999px
  // 하단 테두리만 있음 (stroke #e0e0e0)
  participantRow: {
    paddingHorizontal: 17,
    height: 37, // Figma: 36.999px ≈ 37px
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200], // Figma: #e0e0e0
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // "참여 인원" 라벨
  // Figma: Text (429:334)
  participantLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // Figma: 정확히 14px
    lineHeight: 20, // Figma: 정확히 20px
    fontWeight: '700',
    color: Colors.grey[500], // Figma: #666666
    letterSpacing: -0.1504,
  },

  // "4명" 값
  // Figma: Text (429:336)
  participantValue: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // Figma: 정확히 14px
    lineHeight: 20, // Figma: 정확히 20px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.1504,
  },

  // 상단 컨텐츠 영역 (헤더 + 참여인원 + 아이템)
  topContent: {
    flex: 0, // 내용물 크기만큼만 차지
  },

  // 아이템 리스트 섹션
  // Figma: Container11 (429:337) - 310.997×75.980px
  // 3개 아이템: 사진, 음악, 동영상
  itemsList: {
    paddingHorizontal: 17,
    paddingTop: 12, // 참여 인원과 아이템 리스트 사이 간격 12px
    paddingBottom: 12, // 아이템 리스트와 합계 사이 간격 12px
    gap: 8, // 아이템 간 세로 간격
  },

  // 각 아이템 행
  // Figma: 각 Container (429:338, 429:346, 429:354)
  itemRow: {
    minHeight: 20, // Figma: 19.993px ≈ 20px
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 아이템 라벨 + 상세 정보 컨테이너
  itemLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 라벨과 상세 정보 사이 간격
  },

  // 아이템 라벨 (사진, 음악, 동영상)
  // Figma: Text (429:341, 429:349, 429:357)
  itemLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // Figma: 정확히 14px
    lineHeight: 20, // Figma: 정확히 20px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.1504,
  },

  // 아이템 상세 정보 (500원 x 3개, 1,000원 등)
  // Figma: Text (429:343, 429:351, 429:359)
  itemDetail: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12, // Figma: 정확히 12px
    lineHeight: 16, // Figma: 정확히 16px
    fontWeight: '700',
    color: Colors.grey[400], // Figma: #999999
    letterSpacing: 0,
  },

  // 아이템 가격
  // Figma: Text (429:345, 429:353, 429:361)
  itemPrice: {
    fontFamily: 'Pretendard Variable',
    fontSize: 14, // Figma: 정확히 14px
    lineHeight: 20, // Figma: 정확히 20px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.1504,
  },

  // 합계 섹션
  // Figma: Container12 (429:362) - 310.997×36.999px
  // 상단 테두리 있음 (stroke #e0e0e0)
  totalRow: {
    paddingHorizontal: 17,
    paddingTop: 12, // 아이템 리스트와 합계 사이 간격
    paddingBottom: 17, // 하단 여백 (상단 헤더의 paddingTop과 동일)
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200], // Figma: #e0e0e0
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // "합계" 라벨
  // Figma: Text (429:365)
  totalLabel: {
    fontFamily: 'Pretendard Variable',
    fontSize: 16, // Figma: 정확히 16px
    lineHeight: 24, // Figma: 정확히 24px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.3125,
  },

  // 합계 금액 "4,000원"
  // Figma: Text (429:367)
  totalPrice: {
    fontFamily: 'Pretendard Variable',
    fontSize: 18, // Figma: 정확히 18px
    lineHeight: 19.8, // Figma: 정확히 19.8px
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.7995,
  },
});

