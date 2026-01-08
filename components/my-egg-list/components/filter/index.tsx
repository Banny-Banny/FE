/**
 * components/my-egg-list/components/filter/index.tsx
 * 이스터에그 목록 필터 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * 일반적인 필터 UI 패턴 적용:
 * - 버튼은 항상 표시
 * - 드롭다운은 버튼 아래에 나타남
 * - 선택 시 드롭다운 자동 닫힘
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
  const handleOptionSelect = (option: 'latest' | 'oldest') => {
    onOptionSelect?.(option);
    onPress?.(); // 드롭다운 닫기
  };

  return (
    <View style={styles.container}>
      {/* 필터 버튼 - 항상 표시 */}
      <Pressable
        style={styles.button}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="필터">
        <Text style={styles.buttonText} numberOfLines={1}>
          {selectedOption === 'latest' ? '최신발견순' : '오래된순'}
        </Text>
        <View style={styles.iconContainer}>
          <Icon
            name={isOpen ? ('ri-arrow-up-s-line' as IconName) : ('ri-arrow-down-s-line' as IconName)}
            size={13}
            color={Colors.darkGrey[600]}
          />
        </View>
      </Pressable>

      {/* 드롭다운 메뉴 - 열림 상태일 때만 표시 */}
      {isOpen && (
        <View style={styles.dropdownWrapper}>
          <View style={styles.dropdown}>
            <Pressable
              style={[
                styles.dropdownItem,
                selectedOption === 'latest' && styles.dropdownItemSelected,
              ]}
              onPress={() => handleOptionSelect('latest')}
              accessibilityRole="button"
              accessibilityLabel="최신발견순">
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedOption === 'latest' && styles.dropdownItemTextSelected,
                ]}>
                최신발견순
              </Text>
              {selectedOption === 'latest' && (
                <View style={styles.checkIconContainer}>
                  <Icon name={'ri-check-line' as IconName} size={16} color={Colors.black[500]} />
                </View>
              )}
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={[
                styles.dropdownItem,
                selectedOption === 'oldest' && styles.dropdownItemSelected,
              ]}
              onPress={() => handleOptionSelect('oldest')}
              accessibilityRole="button"
              accessibilityLabel="오래된순">
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedOption === 'oldest' && styles.dropdownItemTextSelected,
                ]}>
                오래된순
              </Text>
              {selectedOption === 'oldest' && (
                <View style={styles.checkIconContainer}>
                  <Icon name={'ri-check-line' as IconName} size={16} color={Colors.black[500]} />
                </View>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

