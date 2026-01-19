/**
 * components/customer-service/components/connection-status/index.tsx
 * 연결 상태 표시 컴포넌트
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import { ConnectionStatusProps } from './types';

/**
 * 연결 상태 표시 컴포넌트
 * 
 * @description
 * - connecting: 연결 중 (로딩)
 * - connected: 연결됨 (녹색)
 * - disconnected: 연결 끊김 (회색)
 * - error: 오류 (빨간색)
 */
export function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          icon: 'loader-4-line',
          text: '연결 중...',
          color: Colors.grey[500],
        };
      case 'connected':
        return {
          icon: 'wifi-line',
          text: '연결됨',
          color: Colors.green[500],
        };
      case 'disconnected':
        return {
          icon: 'wifi-off-line',
          text: '연결 끊김',
          color: Colors.grey[500],
        };
      case 'error':
        return {
          icon: 'error-warning-line',
          text: '연결 오류',
          color: Colors.red[500],
        };
      default:
        return {
          icon: 'wifi-off-line',
          text: '연결 끊김',
          color: Colors.grey[500],
        };
    }
  };

  const config = getStatusConfig();
  const showReconnect = (status === 'disconnected' || status === 'error') && onReconnect;

  return (
    <View style={styles.container}>
      <Icon name={config.icon as any} size={12} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
      {showReconnect && (
        <Text style={styles.reconnectText} onPress={onReconnect}>
          {' • '}재연결
        </Text>
      )}
    </View>
  );
}
