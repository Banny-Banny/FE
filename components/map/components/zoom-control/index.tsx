/**
 * ZoomControl Component
 * 지도 확대/축소 컨트롤 버튼
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/commons/constants';

interface ZoomControlProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
}

export function ZoomControl({
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn = true,
  canZoomOut = true,
}: ZoomControlProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, !canZoomIn && styles.buttonDisabled]}
        onPress={onZoomIn}
        disabled={!canZoomIn}
        accessibilityRole="button"
        accessibilityLabel="확대">
        <Text style={[styles.buttonText, !canZoomIn && styles.buttonTextDisabled]}>+</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={[styles.button, !canZoomOut && styles.buttonDisabled]}
        onPress={onZoomOut}
        disabled={!canZoomOut}
        accessibilityRole="button"
        accessibilityLabel="축소">
        <Text style={[styles.buttonText, !canZoomOut && styles.buttonTextDisabled]}>−</Text>
      </Pressable>
      {onReset && (
        <>
          <View style={styles.divider} />
          <Pressable
            style={styles.button}
            onPress={onReset}
            accessibilityRole="button"
            accessibilityLabel="줌 리셋">
            <Text style={styles.buttonText}>⌂</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -60 }],
    backgroundColor: Colors.white[500],
    borderRadius: 8,
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white[500],
  },
  buttonDisabled: {
    backgroundColor: Colors.whiteGrey[300],
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black[500],
  },
  buttonTextDisabled: {
    color: Colors.grey[500],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.whiteGrey[400],
  },
});
