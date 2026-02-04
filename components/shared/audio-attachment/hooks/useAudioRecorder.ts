/**
 * components/shared/audio-attachment/hooks/useAudioRecorder.ts
 * 오디오 녹음 Hook (녹음과 로컬 URI 생성만 담당)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] expo-audio 사용 (expo-av에서 마이그레이션)
 * - [x] API 호출 제외 (로컬 URI만 반환)
 * - [x] 녹음 시간 타이머 구현
 */

import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioRecorder as useExpoAudioRecorder,
  type RecordingOptions,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

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
 * 플랫폼별 녹음 설정
 *
 * 문제: 백엔드가 audio/webm을 지원하지 않음
 * 해결:
 * - iOS/Android: m4a로 녹음 (네이티브 지원)
 * - 웹: 브라우저가 지원하는 형식으로 녹음 후 서버에서 변환 필요
 *      또는 mp3로 녹음 시도 (일부 브라우저 지원)
 */
const getRecordingOptions = (): RecordingOptions => {
  if (Platform.OS === 'web') {
    // 웹에서는 브라우저가 지원하는 형식 사용
    // 대부분의 브라우저는 webm을 지원하지만, 백엔드가 받지 않음
    // 일단 HIGH_QUALITY 프리셋 사용 (브라우저가 알아서 선택)
    if (__DEV__) {
    }
    return RecordingPresets.HIGH_QUALITY;
  }

  // iOS/Android: m4a로 녹음
  return {
    ...RecordingPresets.HIGH_QUALITY,
    extension: '.m4a',
  };
};

/**
 * 오디오 녹음 Hook
 * 녹음과 로컬 URI 생성만 담당하고, API 호출은 제외
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [recordingDuration, setRecordingDuration] = useState(0);
  const isPreparing = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // expo-audio의 useAudioRecorder hook 사용 (플랫폼별 설정 적용)
  const recordingOptions = getRecordingOptions();
  const recorder = useExpoAudioRecorder(recordingOptions);
  const recorderState = useAudioRecorderState(recorder);

  // 녹음 시간 업데이트
  useEffect(() => {
    if (recorderState.isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 녹음이 중지되면 시간 리셋
      if (!recorderState.isRecording) {
        setRecordingDuration(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recorderState.isRecording]);

  /**
   * 녹음 시작
   */
  const startRecording = async (): Promise<void> => {
    // 중복 호출 방지
    if (isPreparing.current || recorderState.isRecording) {
      return;
    }
    isPreparing.current = true;

    try {
      // 권한 확인
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert('권한 필요', '마이크 접근 권한이 필요합니다.');
        return;
      }

      // 오디오 모드 설정
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'doNotMix',
      });

      // 녹음 준비 및 시작
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      Alert.alert('오류', '녹음을 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      isPreparing.current = false;
    }
  };

  /**
   * 녹음 중지 및 로컬 URI 반환
   * S3 업로드는 하지 않고 로컬 URI만 반환
   */
  const stopRecording = async (): Promise<string | null> => {
    try {
      await recorder.stop();
      const uri = recorder.uri;

      if (__DEV__ && uri) {
        // URI에서 확장자 추출
        const extension = uri.split('.').pop()?.split('?')[0].toLowerCase();
      }

      // 녹음 종료 후 오디오 모드 복구 (다른 재생 기능에 영향 방지)
      await setAudioModeAsync({ allowsRecording: false });

      return uri || null;
    } catch (error) {
      return null;
    }
  };

  /**
   * 녹음 리셋
   */
  const resetRecording = async (): Promise<void> => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
      }
    } catch (e) {
      // 정리 오류는 무시 (이미 정리된 상태일 수 있음)
    }
    setRecordingDuration(0);
  };

  return {
    isRecording: recorderState.isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
