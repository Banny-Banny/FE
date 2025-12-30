/**
 * components/map/components/egg-detail/styles.ts
 * 이스터에그 상세 정보 스타일 정의
 *
 * 체크리스트:
 * - [x] StyleSheet.create() 사용
 * - [x] 색상 토큰만 사용 (하드코딩 최소화)
 * - [x] Figma 디자인 기반
 * - [x] 인라인 스타일 0건
 * - [x] egg-form과 일관성 있는 스타일 구조
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // 헤더
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.header.h2,
    color: Colors.black[500],
    marginBottom: Spacing.sm,
  },

  // 메타 정보
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    ...Typography.body.body7,
    color: Colors.grey[700],
  },
  distanceText: {
    ...Typography.body.body7,
    color: Colors.grey[700],
  },

  // 상태 배지
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  lockedBadge: {
    backgroundColor: Colors.grey[200],
  },
  unlockedBadge: {
    backgroundColor: Colors.green[50],
  },
  statusText: {
    ...Typography.body.body8,
    color: Colors.grey[800],
  },
  unlockedStatusText: {
    ...Typography.body.body8,
    color: Colors.green[700],
  },

  // 내용 섹션
  contentSection: {
    marginBottom: Spacing.lg,
  },
  contentText: {
    ...Typography.body.body4,
    color: Colors.black[500],
  },

  // 미디어 섹션
  mediaSection: {
    marginBottom: Spacing.lg,
  },
  mediaTitle: {
    ...Typography.body.body11,
    color: Colors.black[500],
    marginBottom: Spacing.md,
  },
  mediaContainer: {
    gap: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.whiteGrey[300],
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  videoContainer: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.whiteGrey[300],
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },

  // 상품 정보 섹션
  productSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteGrey[300],
  },
  productTitle: {
    ...Typography.body.body11,
    color: Colors.black[500],
    marginBottom: Spacing.sm,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },
  productPrice: {
    ...Typography.body.body1,
    color: Colors.black[500],
  },

  // 조회 정보
  viewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  viewText: {
    ...Typography.body.body7,
    color: Colors.grey[700],
  },

  // 빈 상태 (사용되지 않지만 일관성을 위해 유지)
  emptyState: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyStateText: {
    ...Typography.body.body6,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});

