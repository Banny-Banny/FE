/**
 * components/notice/components/notice-search/index.tsx
 * 공지사항 검색 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, TextInput 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import type { NoticeSearchProps } from './types';

export function NoticeSearch({ searchTerm, onChangeText }: NoticeSearchProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="ri-search-line" size={20} color={Colors.grey[500]} />
        <TextInput
          style={styles.input}
          placeholder="공지사항 검색"
          placeholderTextColor={Colors.grey[500]}
          value={searchTerm}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.length > 0 && (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Icon name="ri-close-line" size={20} color={Colors.grey[500]} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
