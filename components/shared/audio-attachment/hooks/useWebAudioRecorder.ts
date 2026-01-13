/**
 * components/shared/audio-attachment/hooks/useWebAudioRecorder.ts
 * 웹 전용 오디오 녹음 Hook (MP3 형식)
 * 
 * vmsg 라이브러리 사용하여 브라우저에서 직접 MP3 생성
 * iOS 호환 가능한 형식으로 녹음
 */

import { useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';

interface UseWebAudioRecorderReturn {
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
 * 웹 전용 오디오 녹음 Hook (MP3 형식)
 * vmsg 라이브러리를 사용하여 iOS 호환 가능한 MP3 생성
 */
export const useWebAudioRecorder = (): UseWebAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorderRef = useRef<any>(null);

  if (Platform.OS !== 'web') {
    throw new Error('useWebAudioRecorder는 웹 환경에서만 사용 가능합니다.');
  }

  /**
   * 녹음 시작
   */
  const startRecording = async (): Promise<void> => {
    if (isRecording) {
      return;
    }

    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // vmsg 동적 import (웹 전용)
      const vmsg = await import('vmsg');

      // 녹음 시작
      recorderRef.current = new vmsg.default.Recorder({
        wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
      });

      await recorderRef.current.init();
      recorderRef.current.startRecording();

      setIsRecording(true);
      setRecordingDuration(0);

      // 녹음 시간 타이머 시작
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      Alert.alert('오류', '마이크 접근 권한이 필요합니다.');
    }
  };

  /**
   * 녹음 중지 및 MP3 Blob URL 반환
   */
  const stopRecording = async (): Promise<string | null> => {
    if (!isRecording || !recorderRef.current) {
      return null;
    }

    try {
      // 타이머 정지
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // 녹음 중지 및 MP3 Blob 생성
      const blob = await recorderRef.current.stopRecording();
      setIsRecording(false);

      // Blob을 URL로 변환
      const url = URL.createObjectURL(blob);

      return url;
    } catch (error) {
      setIsRecording(false);
      return null;
    }
  };

  /**
   * 녹음 리셋
   */
  const resetRecording = async (): Promise<void> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (recorderRef.current) {
      try {
        if (isRecording) {
          await recorderRef.current.stopRecording();
        }
      } catch (error) {
        // 정리 오류 무시
      }
      recorderRef.current = null;
    }

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
