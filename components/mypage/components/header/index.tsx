/**
 * components/mypage/components/header/index.tsx
 * 마이페이지 헤더 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 161:24062
 * 생성 시각: 2025-01-XX
 *
 * @description
 * - 추후 공통 컴포넌트로 교체 예정
 * - 현재는 마이페이지 전용 헤더 컴포넌트
 * - react-native-remix-icon 사용
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

export function Header() {
  return (
    <View style={styles.container}>
      {/* 왼쪽: 마이페이지 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>마이페이지</Text>
      </View>

      {/* 오른쪽: 아이콘 컨테이너 */}
      <View style={styles.iconContainer}>
        {/* 알림 아이콘 (배지 있음) */}
        <View style={styles.notificationButton}>
          <Icon name={'ri-notification-line' as IconName} size={24} color={Colors.black[500]} />
          {/* 알림 배지 */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>

        {/* X 아이콘 */}
        <View style={styles.settingsButton}>
          <Icon name={'ri-close-line' as IconName} size={20} color={Colors.black[500]} />
        </View>
      </View>
    </View>
  );
}
