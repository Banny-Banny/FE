/**
 * components/shared/audio-attachment/hooks/useAudioRecorder.ts
 * 오디오 녹음 Hook (녹음과 로컬 URI 생성만 담당)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] expo-av 사용
 * - [x] API 호출 제외 (로컬 URI만 반환)
 * - [x] 녹음 시간 타이머 구현
 */

import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface UseAudioRecorderReturn {
  /** 녹음 중 여부 */
  isRecording: boolean;
  /** 녹음 시간 (초) */
  recordingDuration: number;
  /** 녹음 시작 */
  startRecording: () => Promise<void>;
  /** 녹음 중지 및 로컬 URI 반환 */
  stopRecording: () => Promise<string | null>;
  /** 녹음 리셋 */
  resetRecording: () => Promise<void>;
}

/**
 * 오디오 녹음 Hook
 * 녹음과 로컬 URI 생성만 담당하고, API 호출은 제외
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
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

  /**
   * 녹음 시작
   */
  const startRecording = async (): Promise<void> => {
    try {
      // 이미 녹음 중이면 무시
      if (isRecording) {
        console.warn('녹음이 이미 진행 중입니다.');
        return;
      }

      // 권한 요청
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '마이크 접근 권한이 필요합니다.');
        return;
      }

      // 기존 녹음기가 남아있으면 정리 (상태 동기화 문제 방지)
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (cleanupError) {
          // 정리 오류는 무시 (이미 정리된 상태일 수 있음)
          console.warn('기존 녹음기 정리 중 오류 (무시됨):', cleanupError);
        }
        setRecording(null);
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
      // 오류 발생 시 상태 리셋
      setRecording(null);
      setIsRecording(false);
    }
  };

  /**
   * 녹음 중지 및 로컬 URI 반환
   * S3 업로드는 하지 않고 로컬 URI만 반환
   */
  const stopRecording = async (): Promise<string | null> => {
    if (!recording) {
      return null;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecording(null);
      setIsRecording(false);

      return uri || null;
    } catch (error) {
      console.error('녹음 중지 오류:', error);
      Alert.alert('오류', '녹음을 중지할 수 없습니다.');
      return null;
    }
  };

  /**
   * 녹음 리셋
   */
  const resetRecording = async (): Promise<void> => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        // 정리 오류는 무시 (이미 정리된 상태일 수 있음)
        console.warn('녹음기 정리 중 오류 (무시됨):', error);
      }
    }
    setRecording(null);
    setIsRecording(false);
    setRecordingDuration(0);
  };

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
