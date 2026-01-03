/**
 * components/shared/audio-attachment/index.tsx
 * 오디오 첨부 모달 컴포넌트
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] Modal 공통 컴포넌트 사용 (disableAnimation)
 * - [x] react-native-remix-icon 사용
 * - [x] 색상 토큰만 사용 (하드코딩 금지)
 * - [x] 인라인 스타일 0건
 * - [x] styles.ts에서만 스타일 선언
 * - [x] 직접 녹음 기능 (expo-av)
 * - [x] 파일 업로드 기능 (expo-document-picker)
 */

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import { SIZE_LIMITS } from '@/commons/constants/media';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';

export interface AudioAttachmentProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 오디오 파일 선택 완료 콜백 */
  onSelectAudio: (uri: string, name: string) => void;
}

type TabType = 'record' | 'upload';

/**
 * 시간 포맷팅 함수 (초를 MM:SS 형식으로)
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 오디오 첨부 모달 컴포넌트
 */
export const AudioAttachment: React.FC<AudioAttachmentProps> = ({
  visible,
  onClose,
  onSelectAudio,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 녹음 시간 업데이트
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  // 모달 닫을 때 녹음 중이면 중지
  useEffect(() => {
    if (!visible && isRecording) {
      stopRecording();
    }
  }, [visible]);

  /**
   * 녹음 시작
   */
  const startRecording = async () => {
    try {
      // 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '마이크 접근 권한이 필요합니다.');
        return;
      }

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 녹음 시작
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('녹음 시작 오류:', error);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  /**
   * 녹음 중지
   */
  const stopRecording = async () => {
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        // 녹음된 파일 선택 완료
        onSelectAudio(uri, `recording_${Date.now()}.m4a`);
        onClose();
      }

      setRecording(null);
      setIsRecording(false);
      setRecordingDuration(0);
    } catch (error) {
      console.error('녹음 중지 오류:', error);
      Alert.alert('오류', '녹음을 중지할 수 없습니다.');
    }
  };

  /**
   * 파일 선택
   */
  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        // 파일 크기 검증 (20MB)
        const maxSize = SIZE_LIMITS.AUDIO;
        if (asset.size && asset.size > maxSize) {
          const sizeLimitMB = maxSize / (1024 * 1024);
          Alert.alert('파일 크기 초과', `파일 크기는 최대 ${sizeLimitMB}MB입니다.`);
          return;
        }

        onSelectAudio(asset.uri, asset.name);
        onClose();
      }
    } catch (error) {
      console.error('파일 선택 오류:', error);
      Alert.alert('오류', '파일을 선택할 수 없습니다.');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={340}
      height="auto"
      padding={0}
      closeOnBackdropPress={true}
      disableAnimation={true}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>음성 첨부</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Icon name="close-line" size={20} color={Colors.black[500]} />
          </Pressable>
        </View>

        {/* 탭 버튼 */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, activeTab === 'record' && styles.tabButtonActive]}
            onPress={() => setActiveTab('record')}>
            <Text
              style={[styles.tabButtonText, activeTab === 'record' && styles.tabButtonTextActive]}>
              직접 녹음
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'upload' && styles.tabButtonActive]}
            onPress={() => setActiveTab('upload')}>
            <Text
              style={[styles.tabButtonText, activeTab === 'upload' && styles.tabButtonTextActive]}>
              파일 업로드
            </Text>
          </Pressable>
        </View>

        {/* 컨텐츠 영역 */}
        <View style={styles.content}>
          {activeTab === 'record' ? (
            /* 직접 녹음 탭 */
            <View style={styles.recordContent}>
              {/* 타이머 */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
              </View>

              {/* 녹음 버튼 */}
              <Pressable
                style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                onPress={isRecording ? stopRecording : startRecording}>
                <Icon
                  name={isRecording ? 'stop-circle-line' : 'mic-line'}
                  size={32}
                  color={isRecording ? Colors.white[50] : Colors.grey[500]}
                />
              </Pressable>

              {/* 안내 텍스트 */}
              <Text style={styles.hintText}>
                {isRecording ? '녹음 중... 버튼을 눌러 중지' : '버튼을 눌러 녹음을 시작하세요'}
              </Text>
            </View>
          ) : (
            /* 파일 업로드 탭 */
            <View style={styles.uploadContent}>
              <Pressable style={styles.uploadButton} onPress={pickAudioFile}>
                <Icon name="file-upload-line" size={32} color={Colors.grey[500]} />
                <Text style={styles.uploadButtonTitle}>파일 선택하기</Text>
                <Text style={styles.uploadButtonSubtitle}>MPEG, AAC (Max 20MB)</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AudioAttachment;
