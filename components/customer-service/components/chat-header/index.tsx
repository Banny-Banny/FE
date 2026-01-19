/**
 * components/customer-service/components/chat-header/index.tsx
 * 채팅 헤더 컴포넌트
 */

import { Colors } from '@/commons/constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ConnectionStatus } from '../connection-status';
import { styles } from './styles';
import { ChatHeaderProps } from './types';

/**
 * 채팅 헤더 컴포넌트
 * 
 * @description
 * - 관리자 정보 및 연결 상태 표시
 * - 뒤로가기 버튼 포함
 * - 네이버 톡톡 스타일 구현
 */
export function ChatHeader({
  title = '고객센터',
  connectionStatus,
  onBack,
}: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
        <Icon name="arrow-left-line" size={24} color={Colors.black[500]} />
      </TouchableOpacity>

      {/* 제목 섹션 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        <ConnectionStatus status={connectionStatus} />
      </View>
    </View>
  );
}
