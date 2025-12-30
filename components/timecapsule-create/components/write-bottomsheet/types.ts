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

/**
 * 제출 데이터 타입 정의
 */
export interface SubmitContentData {
  /** 참여자 ID */
  participantId: string;
  /** 텍스트 내용 */
  textContent: string;
  /** 사진 파일 배열 */
  photos: File[];
  /** 음악 파일 (선택사항) */
  music: File | null;
  /** 동영상 파일 (선택사항) */
  video: File | null;
}

/**
 * 검증 결과 타입
 */
export interface ValidationResult {
  /** 검증 통과 여부 */
  isValid: boolean;
  /** 에러 메시지 (검증 실패 시) */
  message?: string;
}

/**
 * useSubmitContent Hook 반환 타입
 */
export interface UseSubmitContentReturn {
  /** 콘텐츠 제출 함수 */
  submitContent: (data: UserContentFormData) => Promise<void>;
  /** 제출 중 상태 */
  isSubmitting: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 콘텐츠 검증 함수 */
  validateContent: (data: UserContentFormData) => ValidationResult;
}

/**
 * 폼 데이터 타입 정의 (react-hook-form)
 */
export interface UserContentFormData {
  /** 텍스트 내용 */
  textContent: string;
  /** 사진 URI 배열 */
  photos: string[];
  /** 음악 파일 URI (선택사항) */
  music: string | null;
  /** 동영상 파일 URI (선택사항) */
  video: string | null;
}
