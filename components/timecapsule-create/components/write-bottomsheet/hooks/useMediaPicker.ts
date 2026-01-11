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

import { ALLOWED_EXTENSIONS, MediaType, SIZE_LIMITS } from '@/commons/constants/media';
import { getFileExtension, validateFileExtension } from '@/utils/mediaType';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
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
 * @param maxImagesPerPerson - 1인당 최대 사진 개수 (기본값: 5, 하위 호환성)
 */
export function useMediaPicker(
  onImagesPicked: (uris: string[]) => void,
  onVideoPicked: (uri: string) => void,
  onAudioPicked: (uri: string) => void,
  currentPhotosCount: number = 0,
  hasVideo: boolean = false,
  hasMusic: boolean = false,
  maxImagesPerPerson: number = 5, // ⭐ 추가 (기본값 5로 하위 호환성 유지)
): UseMediaPickerReturn {
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isPickingVideo, setIsPickingVideo] = useState(false);
  const [isPickingAudio, setIsPickingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 로딩 상태 (하나라도 선택 중이면 true)
  const isPicking = isPickingImage || isPickingVideo || isPickingAudio;

  /**
   * 파일 크기 확인 (플랫폼별)
   */
  const getFileSize = async (uri: string): Promise<number> => {
    if (Platform.OS === 'web') {
      try {
        console.log(`🔍 [getFileSize] 웹에서 파일 크기 확인 중: ${uri.substring(0, 50)}...`);
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`fetch 실패: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log(`✅ [getFileSize] 파일 크기: ${blob.size} bytes`);
        return blob.size;
      } catch (error) {
        console.error('❌ [getFileSize] 웹에서 파일 크기 가져오기 실패:', error);
        if (error instanceof TypeError) {
          console.error('  TypeError: CORS 또는 네트워크 문제일 수 있습니다');
        }
        throw new Error('파일 크기를 확인할 수 없습니다.');
      }
    } else {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('파일을 찾을 수 없습니다.');
      }
      return 'size' in fileInfo && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
    }
  };

  /**
   * 파일 검증 (타입 및 크기)
   */
  const validateMediaFile = async (
    uri: string,
    type: MediaType,
    filename?: string,
  ): Promise<void> => {
    // 파일명 추출
    const extractedFilename = filename || uri.split('/').pop() || '';
    const extension = getFileExtension(extractedFilename);

    // 확장자 검증
    if (!validateFileExtension(extractedFilename, type)) {
      const allowedExtensions = ALLOWED_EXTENSIONS[type];
      const allowedFormats = allowedExtensions.join(', ').toUpperCase();
      throw new Error(
        `${
          type === 'IMAGE' ? '이미지' : type === 'VIDEO' ? '동영상' : '음성'
        } 파일은 ${allowedFormats} 형식만 업로드 가능합니다.\n선택한 파일: ${
          extractedFilename || '알 수 없음'
        }`,
      );
    }

    // 파일 크기 검증
    try {
      const fileSize = await getFileSize(uri);
      const sizeLimit = SIZE_LIMITS[type];
      const sizeLimitMB = sizeLimit / (1024 * 1024);

      if (fileSize > sizeLimit) {
        const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
        throw new Error(
          `파일 크기가 너무 큽니다.\n${
            type === 'IMAGE' ? '이미지' : type === 'VIDEO' ? '동영상' : '음성'
          } 파일은 ${sizeLimitMB}MB 이하여야 합니다.\n현재 파일 크기: ${fileSizeMB}MB`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('크기가 너무 큽니다')) {
        throw error;
      }
      // ⭐ 웹 환경에서 파일 크기 확인 실패 시 경고만 하고 계속 진행
      if (Platform.OS === 'web') {
        console.warn(
          `⚠️ [validateMediaFile] 웹에서 파일 크기 검증 실패, 계속 진행: ${extractedFilename}`,
        );
        return; // 검증 실패해도 계속 진행
      }
      throw new Error('파일 크기를 확인할 수 없습니다.');
    }
  };

  /**
   * 이미지 선택 함수
   * - 다중 선택 가능 (최대 maxImagesPerPerson개)
   * - 갤러리에서 선택
   */
  const pickImage = async () => {
    try {
      setIsPickingImage(true);
      setError(null);

      // 최대 개수 체크
      if (currentPhotosCount >= maxImagesPerPerson) {
        Alert.alert('알림', `사진은 최대 ${maxImagesPerPerson}개까지 추가할 수 있습니다.`);
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
      const maxSelectable = maxImagesPerPerson - currentPhotosCount;

      // 이미지 피커 실행
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
        selectionLimit: maxSelectable,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log(`🔍 [pickImage] 이미지 선택 완료: ${result.assets.length}개`);

        // 선택된 이미지 URI 추출
        const selectedUris: string[] = [];
        const validatedAssets = result.assets.map((asset) => ({
          uri: asset.uri,
          filename: asset.fileName || asset.uri.split('/').pop() || '',
        }));

        console.log(
          '📝 [pickImage] 선택된 파일:',
          validatedAssets.map((a) => `${a.filename} (${a.uri.substring(0, 50)}...)`),
        );

        // 최대 개수 재확인
        if (currentPhotosCount + validatedAssets.length > maxImagesPerPerson) {
          Alert.alert(
            '알림',
            `사진은 최대 ${maxImagesPerPerson}개까지 추가할 수 있습니다.\n현재 ${currentPhotosCount}개 선택됨`,
          );
          return;
        }

        // 각 파일 검증 (타입 및 크기)
        for (const asset of validatedAssets) {
          try {
            console.log(`🔍 [pickImage] 파일 검증 중: ${asset.filename}`);
            await validateMediaFile(asset.uri, 'IMAGE', asset.filename);
            selectedUris.push(asset.uri);
            console.log(`✅ [pickImage] 파일 검증 성공: ${asset.filename}`);
          } catch (validationError) {
            const errorMessage =
              validationError instanceof Error ? validationError.message : '파일 검증 실패';
            console.error(`❌ [pickImage] 파일 검증 실패: ${asset.filename} - ${errorMessage}`);
            Alert.alert('파일 검증 실패', `${asset.filename}\n${errorMessage}`);
            // 검증 실패한 파일은 제외하고 계속 진행
          }
        }

        // 검증 통과한 파일만 콜백 호출
        if (selectedUris.length > 0) {
          console.log(`✅ [pickImage] 총 ${selectedUris.length}개 파일 콜백 호출`);
          onImagesPicked(selectedUris);
        } else {
          console.warn('⚠️ [pickImage] 검증 통과한 파일이 없습니다');
        }
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
      mediaTypes: ['videos'],
      allowsMultipleSelection: false,
      quality: 1.0,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const videoUri = asset.uri;
      const filename = asset.fileName || videoUri.split('/').pop() || '';

      console.log(`🔍 [pickVideo] 비디오 선택 완료: ${filename}`);
      console.log(`  URI: ${videoUri.substring(0, 80)}...`);

      try {
        // 파일 검증 (타입 및 크기)
        console.log(`🔍 [pickVideo] 파일 검증 중: ${filename}`);
        await validateMediaFile(videoUri, 'VIDEO', filename);
        console.log(`✅ [pickVideo] 파일 검증 성공: ${filename}`);
        onVideoPicked(videoUri);
      } catch (validationError) {
        const errorMessage =
          validationError instanceof Error ? validationError.message : '파일 검증 실패';
        console.error(`❌ [pickVideo] 파일 검증 실패: ${filename} - ${errorMessage}`);
        Alert.alert('파일 검증 실패', `${filename}\n${errorMessage}`);
      }
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
    // images와 videos를 모두 포함하거나, 추후 expo-document-picker 사용 권장
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
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
