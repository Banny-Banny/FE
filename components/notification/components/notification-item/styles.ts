/**
 * components/notification/components/notification-item/styles.ts
 * 알림 아이템 스타일
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 17,
    paddingBottom: 17,
    paddingHorizontal: 17,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  notificationItemRead: {
    opacity: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconContainerRead: {
    backgroundColor: Colors.whiteGrey[50],
  },
  iconText: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    color: Colors.lightBlack[500],
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    gap: 4,
    alignSelf: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    flexShrink: 0,
  },
  titleTextContainer: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  titleText: {
    ...Typography.header.h4,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -1,
    color: Colors.black[500],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: Colors.black[500],
    marginLeft: 'auto',
  },
  descriptionContainer: {
    width: '100%',
    minWidth: 0,
    flexShrink: 0,
  },
  descriptionText: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.black[500],
    opacity: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: 0,
    flexShrink: 0,
  },
  timeTextContainer: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  timeText: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.grey[500],
  },
  deleteButton: {
    height: 24,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  deleteButtonText: {
    ...Typography.body.body5,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.grey[500],
  },
});

