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

import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

export function Header() {
  const navigation = useNavigation();

  const handleNotificationPress = () => {
    navigation.push(ROUTES.ALARM, { from: 'mypage' });
  };

  const handleClosePress = () => {
    navigation.toHome();
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* 왼쪽: 마이페이지 타이틀 */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>마이페이지</Text>
        </View>

        {/* 오른쪽: 아이콘 컨테이너 */}
        <View style={styles.iconContainer}>
          {/* 알림 아이콘 */}
          <Pressable
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            accessibilityRole="button"
            accessibilityLabel="알림">
            <Icon name={'ri-notification-line' as IconName} size={24} color={Colors.black[500]} />
          </Pressable>

          {/* X 아이콘 */}
          <Pressable
            style={styles.closeButton}
            onPress={handleClosePress}
            accessibilityRole="button"
            accessibilityLabel="닫기">
            <Icon name={'ri-close-line' as IconName} size={20} color={Colors.black[500]} />
          </Pressable>
        </View>
      </View>
      {/* border-bottom line (화면 양끝까지 확장) */}
      <View style={styles.borderLine} />
    </View>
  );
}
