/**
 * commons/components/bottom-sheet/styles.ts
 * BottomSheet 공통 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 최소화)
 * - [✓] Figma 디자인 기반
 * - [✓] 드래그 가능
 * - [✓] 내부 스크롤 지원
 */

import { Colors, Spacing } from '@/commons/constants';
import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Modal 컨테이너
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // 검은색 반투명 배경 (dim overlay)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // Colors.black[500] with 50% opacity
  },

  // 바텀시트 컨테이너
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // height는 동적으로 애니메이션됨
    backgroundColor: Colors.white[100],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'column',
  },

  // 드래그 핸들 컨테이너
  handleContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },

  // 드래그 핸들
  handle: {
    width: 48,
    height: 4,
    backgroundColor: Colors.grey[300], // 더 진한 회색으로 변경하여 가시성 향상
    borderRadius: 9999,
  },

  // 스크롤뷰
  scrollView: {
    flex: 1,
  },

  // 스크롤뷰 컨텐츠
  scrollViewContent: {
    flexGrow: 1,
  },

  // 하단 고정 영역 (footer)
  footer: {
    backgroundColor: Colors.white[100],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.white[200],
  },
});
