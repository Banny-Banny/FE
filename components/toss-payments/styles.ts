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
    borderBottomWidth: 0.613,
    borderBottomColor: Colors.grey[200],
    pointerEvents: 'none',
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 14,
    width: 43.663,
    height: 43.663,
    backgroundColor: Colors.white[50],
    borderWidth: 1.838,
    borderColor: Colors.black[500],
    borderRadius: 21.8315,
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
    left: 79.98,
    top: 22.8,
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
