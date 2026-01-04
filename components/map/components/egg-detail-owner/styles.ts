/**
 * components/map/components/egg-detail-owner/styles.ts
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

  // 헤더 섹션
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 60,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggIcon: {
    width: 48,
    height: 48,
  },
  iconText: {
    position: 'absolute',
    ...Typography.header.h1,
    color: Colors.grey[700],
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Typography.header.h2,
    color: Colors.black[500],
  },
  subtitle: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },

  // 정보 카드 섹션
  infoCardsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.whiteGrey[50],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.lg,
    padding: 16.758,
  },
  infoCardContent: {
    gap: 8,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoCardLabel: {
    ...Typography.body.body3,
    color: Colors.grey[700],
    textTransform: 'uppercase',
  },
  infoCardValue: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },

  // 발견 기록 섹션
  discoverySection: {
    marginBottom: Spacing.xl,
    gap: 12,
  },
  discoveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discoveryTitle: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },
  discoveryEmptyBox: {
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1.5,
    borderColor: Colors.whiteGrey[300],
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  discoveryEmptyText: {
    ...Typography.body.body8,
    color: Colors.grey[700],
    textAlign: 'center',
  },

  // 발견자 리스트
  viewersList: {
    maxHeight: 200,
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1.5,
    borderColor: Colors.whiteGrey[300],
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  viewerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteGrey[200],
  },
  viewerNickname: {
    ...Typography.body.body8,
    color: Colors.black[500],
  },
  viewerDate: {
    ...Typography.body.body9,
    color: Colors.grey[600],
  },

  // 로딩 및 에러 상태
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...Typography.body.body6,
    color: Colors.grey[600],
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  errorText: {
    ...Typography.body.body6,
    color: Colors.red[500],
    textAlign: 'center',
  },
});

