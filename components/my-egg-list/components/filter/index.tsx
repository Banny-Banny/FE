/**
 * components/my-egg-list/components/filter/index.tsx
 * 이스터에그 목록 필터 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 161:29272 (닫힘), 1129:2616 (열림)
 * 생성 시각: 2025-01-XX
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { Colors } from '@/commons/constants';
import { styles } from './styles';

interface FilterProps {
  isOpen?: boolean;
  selectedOption?: 'latest' | 'oldest';
  onPress?: () => void;
  onOptionSelect?: (option: 'latest' | 'oldest') => void;
}

export function Filter({
  isOpen = false,
  selectedOption = 'latest',
  onPress,
  onOptionSelect,
}: FilterProps) {
  return (
    <View style={styles.container}>
      {!isOpen ? (
        <Pressable
          style={styles.button}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="필터">
          <Text style={styles.buttonText}>
            {selectedOption === 'latest' ? '최신발견순' : '오래된순'}
          </Text>
          <View style={styles.iconContainer}>
            <Icon
              name={'ri-arrow-down-s-line' as IconName}
              size={12}
              color={Colors.black[500]}
            />
          </View>
        </Pressable>
      ) : (
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdown}>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                onOptionSelect?.('latest');
                onPress?.();
              }}
              accessibilityRole="button"
              accessibilityLabel="최신발견순">
              <Text style={styles.dropdownItemText}>최신발견순</Text>
              {selectedOption === 'latest' && (
                <View style={styles.dropdownIconContainer}>
                  <Icon
                    name={'ri-check-line' as IconName}
                    size={14}
                    color={Colors.black[500]}
                  />
                </View>
              )}
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                onOptionSelect?.('oldest');
                onPress?.();
              }}
              accessibilityRole="button"
              accessibilityLabel="오래된순">
              <Text style={styles.dropdownItemText}>오래된순</Text>
              {selectedOption === 'oldest' && (
                <View style={styles.dropdownIconContainer}>
                  <Icon
                    name={'ri-check-line' as IconName}
                    size={14}
                    color={Colors.black[500]}
                  />
                </View>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

