/**
 * components/customer-service/components/chat-input/text-input.tsx
 * 채팅 텍스트 입력 필드 컴포넌트
 */

import React from 'react';
import { TextInput, View } from 'react-native';
import { TextInputProps as Props } from './types';
import { styles } from './styles';
import { Colors, Typography } from '@/commons/constants';

/**
 * 채팅 텍스트 입력 필드 컴포넌트
 * 
 * @description
 * - 네이버 톡톡 스타일의 입력창
 * - 멀티라인 지원
 * - 자동 높이 조절
 */
export function ChatTextInput({
  value,
  onChangeText,
  placeholder = '메시지를 입력하세요',
  onSubmitEditing,
}: Props) {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey[500]}
        multiline
        maxLength={1000}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
      />
    </View>
  );
}
