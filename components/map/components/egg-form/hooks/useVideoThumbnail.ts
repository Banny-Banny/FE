/**
 * components/map/components/egg-form/hooks/useVideoThumbnail.ts
 * 동영상 썸네일 추출 Hook
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] 동영상 썸네일 추출 기능
 * - [x] 첫 프레임 또는 지정된 시간의 썸네일 생성
 */

import * as VideoThumbnails from 'expo-video-thumbnails';

/**
 * 동영상 썸네일 추출 Hook
 */
export const useVideoThumbnail = () => {
  /**
   * 동영상 썸네일 추출
   * @param videoUri 동영상 파일 URI
   * @param time 추출할 시간 (밀리초, 기본값: 0 - 첫 프레임)
   * @returns 썸네일 URI 또는 null
   */
  const generateThumbnail = async (videoUri: string, time: number = 0): Promise<string | null> => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time,
        quality: 0.8,
      });
      return uri;
    } catch (error) {
      console.log('동영상 썸네일 추출 오류:', error);
      return null;
    }
  };

  return {
    generateThumbnail,
  };
};
