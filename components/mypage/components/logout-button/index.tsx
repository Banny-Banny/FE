/**
 * components/mypage/components/logout-button/index.tsx
 * 로그아웃 버튼 컴포넌트
 *
 * 체크리스트:
 * - [✓] 공통 Button 컴포넌트 사용
 * - [✓] JSX 구조만 작성
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 *
 * Figma 노드 ID: 535-893
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from '@/commons/components/button';
import { styles } from './styles';
import { LogoutButtonProps } from './types';

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <View style={styles.container}>
      <Button
        label="로그아웃"
        variant="secondary"
        size="M"
        onPress={onPress}
        fullWidth={true}
      />
    </View>
  );
}

