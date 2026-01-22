/**
 * components/notice/components/notice-empty/index.tsx
 * 공지사항 빈 상태 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import type { NoticeEmptyProps } from './types';

export function NoticeEmpty({ isSearchEmpty }: NoticeEmptyProps) {
  const message = isSearchEmpty
    ? '검색 결과가 없습니다.'
    : '공지사항이 없습니다.';

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
