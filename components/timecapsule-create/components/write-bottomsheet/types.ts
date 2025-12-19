/**
 * components/timecapsule-create/components/write-bottomsheet/types.ts
 * UserBottomSheet 관련 타입 정의
 *
 * 체크리스트:
 * - [✓] MediaFile 타입 정의
 * - [✓] UseMediaPickerReturn 타입 정의
 */

/**
 * 미디어 파일 타입 정의
 */
export interface MediaFile {
  /** 파일 URI */
  uri: string;
  /** 미디어 타입 */
  type: 'image' | 'video' | 'audio';
  /** 파일명 */
  name: string;
  /** 파일 크기 (bytes, 선택사항) */
  size?: number;
}

/**
 * useMediaPicker Hook 반환 타입
 */
export interface UseMediaPickerReturn {
  /** 이미지 선택 함수 */
  pickImage: () => Promise<void>;
  /** 비디오 선택 함수 */
  pickVideo: () => Promise<void>;
  /** 오디오 선택 함수 */
  pickAudio: () => Promise<void>;
  /** 전체 선택 중 상태 (하나라도 선택 중이면 true) */
  isPicking: boolean;
  /** 이미지 선택 중 상태 */
  isPickingImage: boolean;
  /** 비디오 선택 중 상태 */
  isPickingVideo: boolean;
  /** 오디오 선택 중 상태 */
  isPickingAudio: boolean;
  /** 에러 메시지 */
  error: string | null;
}
