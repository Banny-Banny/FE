/**
 * components/notice/components/notice-list/index.tsx
 * 공지사항 목록 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import React from 'react';
import { FlatList, View } from 'react-native';
import { NoticeItem } from '../notice-item';
import { styles } from './styles';
import type { NoticeListProps } from './types';

export function NoticeList({ notices, onNoticePress, ListEmptyComponent }: NoticeListProps) {
  const renderItem = ({ item }: { item: typeof notices[0] }) => {
    return <NoticeItem notice={item} onPress={onNoticePress} />;
  };

  const keyExtractor = (item: typeof notices[0]) => item.id;

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}
