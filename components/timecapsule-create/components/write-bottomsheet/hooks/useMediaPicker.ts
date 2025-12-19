/**
 * components/timecapsule-create/components/write-bottomsheet/hooks/useMediaPicker.ts
 * 미디어 파일 선택 Hook
 *
 * 체크리스트:
 * - [✓] expo-image-picker 사용
 * - [✓] pickImage 함수 구현 (다중 선택, 최대 5개)
 * - [✓] pickVideo 함수 구현 (단일 선택)
 * - [✓] pickAudio 함수 구현 (단일 선택)
 * - [✓] 로딩 상태 관리
 * - [✓] 에러 상태 관리
 * - [✓] 권한 처리
 */

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { UseMediaPickerReturn } from '../types';

/**
 * 미디어 파일 선택을 위한 Hook
 *
 * @param onImagesPicked - 이미지 선택 완료 시 콜백 (URI 배열)
 * @param onVideoPicked - 비디오 선택 완료 시 콜백 (URI)
 * @param onAudioPicked - 오디오 선택 완료 시 콜백 (URI)
 * @param currentPhotosCount - 현재 선택된 사진 개수 (최대 개수 체크용)
 * @param hasVideo - 이미 비디오가 선택되어 있는지 여부
 * @param hasMusic - 이미 음악이 선택되어 있는지 여부
 */
export function useMediaPicker(
  onImagesPicked: (uris: string[]) => void,
  onVideoPicked: (uri: string) => void,
  onAudioPicked: (uri: string) => void,
  currentPhotosCount: number = 0,
  hasVideo: boolean = false,
  hasMusic: boolean = false,
): UseMediaPickerReturn {
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isPickingVideo, setIsPickingVideo] = useState(false);
  const [isPickingAudio, setIsPickingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 로딩 상태 (하나라도 선택 중이면 true)
  const isPicking = isPickingImage || isPickingVideo || isPickingAudio;

  /**
   * 이미지 선택 함수
   * - 다중 선택 가능 (최대 5개)
   * - 갤러리에서 선택
   */
  const pickImage = async () => {
    try {
      setIsPickingImage(true);
      setError(null);

      // 최대 개수 체크
      if (currentPhotosCount >= 5) {
        Alert.alert('알림', '사진은 최대 5개까지 추가할 수 있습니다.');
        return;
      }

      // 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          '권한 필요',
          '사진을 선택하려면 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.',
          [{ text: '확인' }],
        );
        return;
      }

      // 선택 가능한 최대 개수 계산
      const maxSelectable = 5 - currentPhotosCount;

      // 이미지 피커 실행
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
        selectionLimit: maxSelectable,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // 선택된 이미지 URI 추출
        const selectedUris = result.assets.map((asset) => asset.uri);

        // 최대 개수 재확인
        if (currentPhotosCount + selectedUris.length > 5) {
          Alert.alert(
            '알림',
            `사진은 최대 5개까지 추가할 수 있습니다.\n현재 ${currentPhotosCount}개 선택됨`,
          );
          return;
        }

        // 콜백 호출
        onImagesPicked(selectedUris);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '이미지 선택 중 오류가 발생했습니다.';
      setError(errorMessage);
      Alert.alert('오류', errorMessage);
    } finally {
      setIsPickingImage(false);
    }
  };

  /**
   * 비디오 선택 함수
   * - 단일 선택 (최대 1개)
   * - 갤러리에서 선택
   */
  const pickVideo = async () => {
    try {
      setIsPickingVideo(true);
      setError(null);

      // 이미 비디오가 있으면 교체 확인
      if (hasVideo) {
        Alert.alert('동영상 교체', '이미 동영상이 있습니다. 교체하시겠습니까?', [
          { text: '취소', style: 'cancel', onPress: () => setIsPickingVideo(false) },
          {
            text: '교체',
            onPress: async () => {
              await proceedVideoPick();
            },
          },
        ]);
        return;
      }

      await proceedVideoPick();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '동영상 선택 중 오류가 발생했습니다.';
      setError(errorMessage);
      Alert.alert('오류', errorMessage);
    } finally {
      setIsPickingVideo(false);
    }
  };

  /**
   * 비디오 선택 실행 (내부 함수)
   */
  const proceedVideoPick = async () => {
    // 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        '권한 필요',
        '동영상을 선택하려면 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.',
        [{ text: '확인' }],
      );
      return;
    }

    // 비디오 피커 실행
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 1.0,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const videoUri = result.assets[0].uri;
      onVideoPicked(videoUri);
    }
  };

  /**
   * 오디오 선택 함수
   * - 단일 선택 (최대 1개)
   * - 파일 피커에서 선택
   *
   * 참고: expo-image-picker는 오디오 파일을 직접 지원하지 않으므로
   * MediaTypeOptions.All을 사용하거나, 추후 expo-document-picker로 대체 가능
   */
  const pickAudio = async () => {
    try {
      setIsPickingAudio(true);
      setError(null);

      // 이미 음악이 있으면 교체 확인
      if (hasMusic) {
        Alert.alert('음악 교체', '이미 음악이 있습니다. 교체하시겠습니까?', [
          { text: '취소', style: 'cancel', onPress: () => setIsPickingAudio(false) },
          {
            text: '교체',
            onPress: async () => {
              await proceedAudioPick();
            },
          },
        ]);
        return;
      }

      await proceedAudioPick();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '음악 선택 중 오류가 발생했습니다.';
      setError(errorMessage);
      Alert.alert('오류', errorMessage);
    } finally {
      setIsPickingAudio(false);
    }
  };

  /**
   * 오디오 선택 실행 (내부 함수)
   */
  const proceedAudioPick = async () => {
    // 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        '권한 필요',
        '음악을 선택하려면 갤러리 접근 권한이 필요합니다.\n설정에서 권한을 허용해주세요.',
        [{ text: '확인' }],
      );
      return;
    }

    // 오디오 파일 선택
    // 참고: expo-image-picker는 오디오를 직접 지원하지 않으므로
    // All 옵션을 사용하거나, 추후 expo-document-picker 사용 권장
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const audioUri = result.assets[0].uri;

      // 파일 확장자 검증 (간단한 체크)
      const isAudioFile =
        audioUri.toLowerCase().endsWith('.mp3') ||
        audioUri.toLowerCase().endsWith('.m4a') ||
        audioUri.toLowerCase().endsWith('.wav') ||
        audioUri.toLowerCase().endsWith('.aac');

      if (!isAudioFile) {
        Alert.alert('알림', '지원하는 오디오 파일 형식은 mp3, m4a, wav, aac입니다.');
        return;
      }

      onAudioPicked(audioUri);
    }
  };

  return {
    pickImage,
    pickVideo,
    pickAudio,
    isPicking,
    isPickingImage,
    isPickingVideo,
    isPickingAudio,
    error,
  };
}
