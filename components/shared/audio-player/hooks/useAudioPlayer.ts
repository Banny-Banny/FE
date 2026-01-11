/**
 * useAudioPlayer Hook
 * 오디오 플레이어 비즈니스 로직
 *
 * 미디어 ID 또는 URL을 받아서, URL이면 그대로 사용하고 ID면 URL로 변환한 후 오디오 재생 상태를 관리합니다.
 * expo-audio 사용 (expo-av에서 마이그레이션)
 */

import {
  setAudioModeAsync,
  useAudioPlayerStatus,
  useAudioPlayer as useExpoAudioPlayer,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { getMediaUrl } from '@/utils';

import type { AudioPlayerProps } from '../types';

/**
 * 문자열이 URL인지 확인
 */
const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
};

/**
 * Base64 문자열인지 확인
 */
const isBase64DataUri = (value: string): boolean => {
  return value.startsWith('data:audio/') && value.includes('base64,');
};

/**
 * iOS에서 지원하지 않는 오디오 형식인지 확인
 */
const isUnsupportedFormatOnIOS = (value: string): boolean => {
  if (Platform.OS !== 'ios') return false;

  // webm, ogg 등 iOS에서 지원하지 않는 형식
  const unsupportedFormats = ['webm', 'ogg', 'opus', 'wav'];

  // URL에서 확장자 확인 (쿼리 파라미터 제거 후)
  const urlWithoutQuery = value.split('?')[0];
  if (urlWithoutQuery.includes('.')) {
    const extension = urlWithoutQuery.split('.').pop()?.toLowerCase() || '';
    if (unsupportedFormats.includes(extension)) return true;
  }

  // MIME 타입 확인 (data:audio/webm;... 형식)
  const mimeMatch = value.match(/data:audio\/([^;,]+)/);
  if (mimeMatch) {
    const mimeType = mimeMatch[1].toLowerCase();
    if (unsupportedFormats.some((format) => mimeType.includes(format))) return true;
  }

  return false;
};

/**
 * 서버 URL의 Content-Type을 확인하여 iOS에서 재생 가능한지 체크
 */
const checkAudioCompatibility = async (url: string): Promise<boolean> => {
  if (Platform.OS !== 'ios') return true;

  try {
    // HEAD 요청으로 Content-Type만 확인
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';

    const unsupportedTypes = ['webm', 'ogg', 'opus', 'wav'];
    const isUnsupported = unsupportedTypes.some((type) => contentType.toLowerCase().includes(type));

    if (__DEV__) {
      console.log('[AudioPlayer] Content-Type:', contentType, 'iOS 호환:', !isUnsupported);
    }

    return !isUnsupported;
  } catch (error) {
    // 네트워크 오류 등의 경우 일단 시도해보도록 true 반환
    if (__DEV__) {
      console.warn('[AudioPlayer] Content-Type 확인 실패, 재생 시도:', error);
    }
    return true;
  }
};

/**
 * Base64 문자열을 로컬 파일로 저장 (iOS에서 긴 Base64 문자열 처리)
 */
const saveBase64ToLocalFile = async (base64String: string): Promise<string> => {
  // Base64 문자열에서 헤더 제거 (data:audio/m4a;base64, 부분)
  const base64Data = base64String.includes('base64,')
    ? base64String.split('base64,')[1]
    : base64String;

  // 확장자 추출 (data:audio/m4a;base64, -> m4a)
  let extension = 'm4a'; // 기본값
  const mimeMatch = base64String.match(/data:audio\/([^;]+)/);
  if (mimeMatch) {
    const mimeType = mimeMatch[1];
    // MIME 타입을 확장자로 변환
    if (mimeType.includes('m4a') || mimeType.includes('mp4')) extension = 'm4a';
    else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) extension = 'mp3';
    else if (mimeType.includes('aac')) extension = 'aac';
    else if (mimeType.includes('webm')) extension = 'webm';
  }

  // 임시 디렉토리에 파일 저장 경로 생성
  const fileName = `temp_audio_${Date.now()}.${extension}`;
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  // Base64 데이터를 실제 파일로 쓰기
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (__DEV__) {
    console.log('[AudioPlayer] Base64를 로컬 파일로 저장 완료:', fileUri);
  }

  return fileUri;
};

export interface UseAudioPlayerReturn {
  // 상태
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  progressValue: ReturnType<typeof useSharedValue<number>>;
  hasAudio: boolean;
  error: Error | null;

  // 핸들러
  handleTogglePlay: () => Promise<void>;

  // 스타일
  progressBarStyle: { width: string };
}

/**
 * 오디오 플레이어 비즈니스 로직 훅
 */
export const useAudioPlayer = ({
  mediaId,
  onPlayStateChange,
  onError,
}: AudioPlayerProps): UseAudioPlayerReturn => {
  // 오디오 URL 상태
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const localFileUriRef = useRef<string | null>(null); // Base64에서 변환된 로컬 파일 경로

  // mediaId가 URL인지 ID인지 판단하여 URL로 변환
  useEffect(() => {
    if (!mediaId) {
      setUrl(null);
      setError(null);
      return;
    }

    // 이미 URL이면 그대로 사용
    if (isUrl(mediaId)) {
      setUrl(mediaId);
      setError(null);
      return;
    }

    // ID인 경우 URL로 변환
    const convertMediaId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const convertedUrl = await getMediaUrl(mediaId);
        setUrl(convertedUrl);
        setError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('미디어 URL 변환 실패');
        if (__DEV__) {
          console.error('[AudioPlayer] 미디어 URL 변환 실패:', err);
        }
        setError(err);
        onError?.(err);
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    convertMediaId();
  }, [mediaId, onError]);

  // 오디오 모드 설정 (iOS 무음 모드에서도 재생하기 위해 필수)
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true, // 무음 모드에서도 소리 재생
          shouldPlayInBackground: false,
          interruptionMode: 'doNotMix',
        });
      } catch (error) {
        if (__DEV__) {
          console.error('[AudioPlayer] 오디오 모드 설정 실패:', error);
        }
      }
    };

    configureAudio();
  }, []);

  // Base64 문자열인 경우 iOS에서 로컬 파일로 변환
  const [audioSource, setAudioSource] = useState<string | null>(null);
  useEffect(() => {
    if (!url) {
      setAudioSource(null);
      // 로컬 파일 정리
      if (localFileUriRef.current) {
        FileSystem.deleteAsync(localFileUriRef.current, { idempotent: true }).catch(console.error);
        localFileUriRef.current = null;
      }
      return;
    }

    const processUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1단계: URL 확장자로 먼저 체크
        if (isUnsupportedFormatOnIOS(url)) {
          const unsupportedError = new Error(
            'iOS에서 지원하지 않는 오디오 형식입니다. 웹에서 녹음된 파일은 iOS에서 재생할 수 없습니다.',
          );
          if (__DEV__) {
            console.error('[AudioPlayer] iOS 미지원 형식 (URL 확장자):', url);
          }
          setError(unsupportedError);
          onError?.(unsupportedError);
          setAudioSource(null);
          setIsLoading(false);
          return;
        }

        // 2단계: 서버 URL인 경우 Content-Type 체크 (http/https로 시작하는 경우만)
        if (Platform.OS === 'ios' && (url.startsWith('http://') || url.startsWith('https://'))) {
          const isCompatible = await checkAudioCompatibility(url);
          if (!isCompatible) {
            const unsupportedError = new Error(
              'iOS에서 지원하지 않는 오디오 형식입니다. 웹에서 녹음된 파일은 iOS에서 재생할 수 없습니다.',
            );
            if (__DEV__) {
              console.error('[AudioPlayer] iOS 미지원 형식 (Content-Type):', url);
            }
            setError(unsupportedError);
            onError?.(unsupportedError);
            setAudioSource(null);
            setIsLoading(false);
            return;
          }
        }

        // 3단계: Base64 문자열인 경우 iOS에서 로컬 파일로 저장
        let finalUrl = url;
        if (isBase64DataUri(url) && Platform.OS === 'ios') {
          if (__DEV__) {
            console.log('[AudioPlayer] iOS: Base64 문자열 감지, 로컬 파일로 변환 중...');
          }
          finalUrl = await saveBase64ToLocalFile(url);
          localFileUriRef.current = finalUrl; // 나중에 정리하기 위해 저장
        }

        setAudioSource(finalUrl);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('오디오 URL 처리 실패');
        if (__DEV__) {
          console.error('[AudioPlayer] 오디오 URL 처리 오류:', error);
        }
        setError(err);
        onError?.(err);
        setAudioSource(null);
      } finally {
        setIsLoading(false);
      }
    };

    processUrl();
  }, [url, onError]);

  // expo-audio의 useAudioPlayer hook 사용
  const player = useExpoAudioPlayer(audioSource, {
    updateInterval: 100, // 더 촘촘한 업데이트
  });

  // 재생 상태 구독
  const status = useAudioPlayerStatus(player);

  // 상태 동기화 및 에러 처리
  useEffect(() => {
    if (!status.isLoaded) {
      // 로딩 중이거나 에러 상태
      if (__DEV__) {
        console.log('[AudioPlayer] 상태:', {
          isLoaded: status.isLoaded,
          isBuffering: status.isBuffering,
        });
      }
      return;
    }

    // 재생 완료 시
    if (status.didJustFinish) {
      player.seekTo(0); // 재생바 초기화
      onPlayStateChange?.(false);
    }
  }, [status, player, onPlayStateChange]);

  // 에러 처리 - 재생 실패 시 handleTogglePlay의 catch 블록에서 처리됨

  // 재생/일시정지 토글
  const handleTogglePlay = async () => {
    if (!player || !status.isLoaded) {
      return;
    }

    try {
      if (status.playing) {
        player.pause();
        onPlayStateChange?.(false);
      } else {
        player.play();
        onPlayStateChange?.(true);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('재생 토글 실패');
      if (__DEV__) {
        console.error('[AudioPlayer] 재생 토글 오류:', err);
      }
      setError(err);
      onError?.(err);
    }
  };

  // 재생 상태가 변경될 때 콜백 호출
  useEffect(() => {
    if (status.isLoaded) {
      onPlayStateChange?.(status.playing);
    }
  }, [status.playing, status.isLoaded, onPlayStateChange]);

  // progress 계산 (초 단위로 변환)
  const currentTime = useMemo(() => status.currentTime || 0, [status.currentTime]);
  const duration = useMemo(() => status.duration || 0, [status.duration]);
  const progress = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration],
  );
  const progressValue = useSharedValue(progress);

  // progress 값이 변경될 때마다 업데이트
  useEffect(() => {
    progressValue.value = progress;
  }, [progress, progressValue]);

  // 동적 width를 위한 animated style 계산
  const progressBarStyle = useMemo(
    () => ({
      width: `${progress * 100}%`,
    }),
    [progress],
  );

  // 로딩 상태는 status.isBuffering 또는 !status.isLoaded로 판단
  const isLoadingState = isLoading || (!status.isLoaded && audioSource !== null);

  // 오디오 존재 여부
  const hasAudio = Boolean(mediaId);

  // 정리 함수
  useEffect(() => {
    return () => {
      // 로컬 파일 정리
      if (localFileUriRef.current) {
        FileSystem.deleteAsync(localFileUriRef.current, { idempotent: true }).catch(console.error);
        localFileUriRef.current = null;
      }
    };
  }, []);

  return {
    isLoading: isLoadingState,
    isPlaying: status.playing || false,
    currentTime,
    duration,
    progress,
    progressValue,
    hasAudio,
    error,
    handleTogglePlay,
    progressBarStyle,
  };
};
