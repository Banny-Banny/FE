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
 * - [x] 미리보기 기능 (재생)
 * - [x] 로컬 URI 보관 (S3 업로드는 나중에)
 */

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import { SIZE_LIMITS } from '@/commons/constants/media';
import { formatTime, formatTimeFromMillis } from '@/utils/format';
import { getMimeTypes } from '@/utils';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useAudioPreview } from './hooks/useAudioPreview';
import { useAudioRecorder } from './hooks/useAudioRecorder';
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
 * 오디오 첨부 모달 컴포넌트
 */
export const AudioAttachment: React.FC<AudioAttachmentProps> = ({
  visible,
  onClose,
  onSelectAudio,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const [selectedAudioUri, setSelectedAudioUri] = useState<string | null>(null);
  const [selectedAudioName, setSelectedAudioName] = useState<string>('');

  // 녹음 Hook
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording: stopRecordingHook,
    resetRecording,
  } = useAudioRecorder();

  // 미리보기 Hook
  const {
    isPlaying,
    positionMillis,
    durationMillis,
    togglePlay,
    stop: stopPreview,
    unload: unloadPreview,
  } = useAudioPreview(selectedAudioUri);

  // 모달이 닫힐 때 리셋
  useEffect(() => {
    if (!visible) {
      // 녹음 중이면 중지
      if (isRecording) {
        resetRecording();
      }
      // 미리보기 정리
      unloadPreview();
      // 선택된 오디오 리셋
      setSelectedAudioUri(null);
      setSelectedAudioName('');
    }
  }, [visible, isRecording, resetRecording, unloadPreview]);

  /**
   * 녹음 중지 및 로컬 URI 보관
   */
  const handleStopRecording = async () => {
    const uri = await stopRecordingHook();
    if (uri) {
      setSelectedAudioUri(uri);
      setSelectedAudioName(`recording_${Date.now()}.m4a`);
    }
  };

  /**
   * 파일 선택 및 로컬 URI 보관
   */
  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: getMimeTypes('AUDIO'),
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

        setSelectedAudioUri(asset.uri);
        setSelectedAudioName(asset.name);
      }
    } catch (error) {
      console.error('파일 선택 오류:', error);
      Alert.alert('오류', '파일을 선택할 수 없습니다.');
    }
  };

  /**
   * 확인 버튼 클릭 - 부모에게 전달
   */
  const handleConfirm = () => {
    if (selectedAudioUri && selectedAudioName) {
      onSelectAudio(selectedAudioUri, selectedAudioName);
      onClose();
    }
  };

  /**
   * 다시 선택 (리셋)
   */
  const handleReset = () => {
    unloadPreview();
    setSelectedAudioUri(null);
    setSelectedAudioName('');
    resetRecording();
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

        {/* 탭 버튼 - 미리보기 중일 때는 비활성화 */}
        {!selectedAudioUri && (
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tabButton, activeTab === 'record' && styles.tabButtonActive]}
              onPress={() => setActiveTab('record')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'record' && styles.tabButtonTextActive,
                ]}>
                직접 녹음
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, activeTab === 'upload' && styles.tabButtonActive]}
              onPress={() => setActiveTab('upload')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'upload' && styles.tabButtonTextActive,
                ]}>
                파일 업로드
              </Text>
            </Pressable>
          </View>
        )}

        {/* 컨텐츠 영역 */}
        <View style={styles.content}>
          {selectedAudioUri ? (
            /* 미리보기 영역 */
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>미리보기</Text>
              <Text style={styles.previewFileName} numberOfLines={1}>
                {selectedAudioName}
              </Text>

              {/* 재생 컨트롤 */}
              <View style={styles.playbackContainer}>
                <Pressable style={styles.playButton} onPress={togglePlay}>
                  <Icon
                    name={isPlaying ? 'pause-circle-line' : 'play-circle-line'}
                    size={48}
                    color={Colors.black[500]}
                  />
                </Pressable>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTimeFromMillis(positionMillis)} / {formatTimeFromMillis(durationMillis)}
                  </Text>
                </View>
              </View>

              {/* 액션 버튼 */}
              <View style={styles.actionButtons}>
                <Pressable style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>다시 선택</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmButton, !selectedAudioUri && styles.confirmButtonDisabled]}
                  onPress={handleConfirm}
                  disabled={!selectedAudioUri}>
                  <Text
                    style={[
                      styles.confirmButtonText,
                      !selectedAudioUri && styles.confirmButtonTextDisabled,
                    ]}>
                    확인
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : activeTab === 'record' ? (
            /* 직접 녹음 탭 */
            <View style={styles.recordContent}>
              {/* 타이머 */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
              </View>

              {/* 녹음 버튼 */}
              <Pressable
                style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                onPress={isRecording ? handleStopRecording : startRecording}>
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
