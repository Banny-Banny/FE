/**
 * components/map/components/map-view/index.tsx
 * 실제 지도가 그려지는 부분 (View)
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MapViewProps } from './types';
import { styles } from './styles';

export const MapView: React.FC<MapViewProps> = ({ region, onRegionChange }) => {
  // TODO: 실제 지도 WebView 또는 네이티브 맵 구현
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>지도 로딩 중...</Text>
        <Text style={styles.loadingText}>
          위치: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

