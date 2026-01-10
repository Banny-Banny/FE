/**
 * components/mypage/components/menu-list/index.tsx
 * 메뉴 리스트 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 *
 * Figma 노드 ID: 161:24117
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Colors } from '@/commons/constants';
import { styles } from './styles';

interface MenuListProps {
  onPaymentHistoryPress?: () => void;
}

export function MenuList({ onPaymentHistoryPress }: MenuListProps) {
  return (
    <View style={styles.container}>
      {/* 설정 메뉴 */}
      <View style={styles.menuItem}>
        <Text style={styles.menuText}>설정</Text>
        <View style={styles.iconContainer} collapsable={false}>
          <Icon name="arrow-right-s-line" size={20} color={Colors.black[500]} />
        </View>
      </View>

      {/* 결제 내역 메뉴 */}
      <Pressable style={styles.menuItem} onPress={onPaymentHistoryPress}>
        <Text style={styles.menuText}>결제 내역</Text>
        <View style={styles.iconContainer} collapsable={false}>
          <Icon name="arrow-right-s-line" size={20} color={Colors.black[500]} />
        </View>
      </Pressable>

      {/* 고객 센터 메뉴 (마지막 항목 - 구분선 없음) */}
      <View style={styles.menuItemLast}>
        <Text style={styles.menuText}>고객 센터</Text>
        <View style={styles.iconContainer} collapsable={false}>
          <Icon name="arrow-right-s-line" size={20} color={Colors.black[500]} />
        </View>
      </View>
    </View>
  );
}

