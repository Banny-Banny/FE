/**
 * components/mypage/components/alert/index.tsx
 * alert 컴포넌트
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

export function Alert() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>알림</Text>
    </View>
  );
}

