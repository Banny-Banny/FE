/**
 * components/customer-service/components/chat-input/attachment-button.tsx
 * 첨부 파일 버튼 컴포넌트 (선택사항)
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { AttachmentButtonProps } from './types';
import { styles } from './styles';
import { Colors } from '@/commons/constants';

/**
 * 첨부 파일 버튼 컴포넌트
 * 
 * @description
 * - 파일 첨부 기능 (선택사항)
 * - Phase 3에서 구현 예정
 */
export function AttachmentButton({ onPress }: AttachmentButtonProps) {
  return (
    <TouchableOpacity style={styles.attachmentButton} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.attachmentButtonContent}>
        <Icon name="image-add-line" size={20} color={Colors.black[500]} />
      </View>
    </TouchableOpacity>
  );
}
