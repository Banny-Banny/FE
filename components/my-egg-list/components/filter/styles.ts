/**
 * components/my-egg-list/components/filter/styles.ts
 * 이스터에그 목록 필터 스타일 정의
 *
 * 일반적인 필터 UI 패턴 적용:
 * - 버튼은 항상 표시되고 드롭다운은 아래에 나타남
 * - 깔끔하고 세련된 디자인
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    position: 'relative',
    alignItems: 'flex-end',
    zIndex: 1000, // 웹에서도 드롭다운이 다른 요소 위에 표시되도록 높은 z-index
  },

  // ============================================
  // Button
  // ============================================
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    minWidth: 120, // 108 → 120 (텍스트가 한 줄로 표시되도록)
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg, // 16px - 더 작은 모서리
    gap: 6,
  },
  buttonText: {
    ...Typography.body.body8,
    color: Colors.black[500],
    fontSize: 13, // 약간 더 큰 폰트
    flexShrink: 0, // 텍스트가 줄어들지 않도록
  },
  iconContainer: {
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============================================
  // Dropdown
  // ============================================
  dropdownWrapper: {
    position: 'absolute',
    top: 38, // 버튼 바로 아래에 배치
    right: 0,
    zIndex: 1001, // container보다 높은 z-index
    marginTop: 4, // 버튼과 약간의 간격
  },
  dropdown: {
    minWidth: 120, // 버튼과 동일한 너비
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg, // 16px - 버튼과 동일
    overflow: 'hidden',
    // 더 부드러운 그림자 효과
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Android
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.whiteGrey[200], // 선택된 항목 배경 - 약간 더 진하게
  },
  dropdownItemText: {
    ...Typography.body.body8,
    fontSize: 13, // 버튼과 동일한 크기
    color: Colors.black[500],
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontWeight: Typography.header.h4.fontWeight, // SemiBold로 강조
    color: Colors.black[500],
  },
  checkIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.lighter,
    marginHorizontal: 12, // 약간 더 넓은 여백
  },
});

