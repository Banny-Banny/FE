/**
 * toss-payments/styles.ts
 * 메인 Container 스타일만 포함
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[50],
  },

  // ============================================
  // 헤더
  // ============================================
  header: {
    width: '100%',
    height: 73,
  },

  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 73,
  },

  headerBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 73,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    pointerEvents: 'none',
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 14,
    width: 44,
    height: 44,
    backgroundColor: Colors.white[50],
    borderWidth: 2,
    borderColor: Colors.black[500],
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  backButtonText: {
    ...Typography.body.body4,
    fontSize: 26,
    color: Colors.black[500],
    includeFontPadding: false,
  },

  headerTitle: {
    position: 'absolute',
    left: 80,
    top: 23,
    ...Typography.header.h1,
    color: Colors.darkGrey[900],
  },

  // ============================================
  // 스크롤 영역
  // ============================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
