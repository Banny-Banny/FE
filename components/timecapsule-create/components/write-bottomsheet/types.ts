/**
 * components/timecapsule-create/components/write-bottomsheet/types.ts
 * UserBottomSheet 관련 타입 정의
 *
 * 체크리스트:
 * - [✓] MediaFile 타입 정의
 * - [✓] UseMediaPickerReturn 타입 정의
 */

import type { Participant, RoomSettingsResponse } from '../step-room/types';

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
  submitContent: (data: UserContentFormData, capsuleId: string) => Promise<void>;
  /** 제출 중 상태 */
  isSubmitting: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 콘텐츠 검증 함수 */
  validateContent: (data: UserContentFormData) => ValidationResult;
  /** ⭐ 업로드 진행 상태 메시지 */
  uploadProgress: string;
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
  /** 초대 코드 (처음 참여 시만, 선택사항) */
  inviteCode?: string;
}

/**
 * UserBottomSheet Props 인터페이스
 */

/** UserBottomSheet Props */
export interface UserBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  participant: Participant;
  /** ⭐ 캡슐 ID (대기실 생성 시 받은 capsule_id) */
  capsuleId: string;
  /** 초대 코드 (게스트용, 처음 참여 시 필요) */
  inviteCode?: string;
  onSave?: (content: any) => Promise<void>;
  /** 대기실 설정값 (옵션, 없으면 기본값 사용) */
  roomSettings?: RoomSettingsResponse | null;
}

/**
 * ========================================
 * 타임캡슐 콘텐츠 제출 API 타입 정의
 * ========================================
 */

/**
 * 타임캡슐 콘텐츠 제출 API 요청 타입 (FormData)
 * ⭐ 백엔드 API 명세에 따라 multipart/form-data 형식으로 파일을 직접 전송
 * 
 * 실제 구현에서는 React Native의 FormData를 직접 사용하며,
 * 다음 필드들을 포함합니다:
 * - text_message: string (필수)
 * - invite_code?: string (선택)
 * - images: File[] (선택, 최대 5개) - FormData.append('images', {...})로 여러 번 추가
 * - music: File (선택, add_music: true인 경우만)
 * - video: File (선택, add_video: true인 경우만)
 * 
 * 참고: React Native에서는 File 객체 대신 { uri, type, name } 형태의 객체를 사용합니다.
 */
export interface ContentSubmitFormData {
  /** ✅ 필수! 빈 문자열 불가 */
  text_message: string;
  /** 초대 코드 (선택) */
  invite_code?: string;
  /** 이미지 파일 배열 (선택, 최대 photo_count개) */
  images?: File[];
  /** 음악 파일 (선택, add_music: true인 경우만) */
  music?: File;
  /** 비디오 파일 (선택, add_video: true인 경우만) */
  video?: File;
}

/**
 * ⚠️ 사용 중단: 이 타입은 더 이상 사용되지 않습니다.
 * 백엔드 API가 multipart/form-data 형식으로 파일을 직접 받도록 변경되었습니다.
 * 
 * @deprecated ContentSubmitFormData 또는 FormData를 직접 사용하세요.
 */
export interface ContentSubmitRequest {
  /** ✅ 필수! 빈 문자열 불가 */
  text_message: string;
  /** 초대 코드 (선택) */
  invite_code?: string;
  /** ⭐ 이미지 mediaId 배열 (선택) - 더 이상 사용하지 않음 */
  image_ids?: string[];
  /** ⭐ 음악 mediaId (선택) - 더 이상 사용하지 않음 */
  music_id?: string;
  /** ⭐ 비디오 mediaId (선택) - 더 이상 사용하지 않음 */
  video_id?: string;
}

/**
 * 타임캡슐 콘텐츠 제출 API 응답 데이터 타입
 */
export interface ContentSubmitResponseData {
  /** 슬롯 ID (UUID) */
  slot_id: string;
  /** 사용자 ID (UUID) */
  user_id: string;
  /** 작성 상태 */
  status: 'PENDING' | 'COMPLETED';
  /** 업로드된 이미지 개수 (0-5) */
  uploaded_images: number;
  /** 음악 파일 업로드 여부 */
  uploaded_music: boolean;
  /** 비디오 파일 업로드 여부 */
  uploaded_video: boolean;
}

/**
 * 타임캡슐 콘텐츠 제출 API 응답 타입 (snake_case)
 */
export interface ContentSubmitResponse {
  /** 요청 성공 여부 */
  success: boolean;
  /** 제출 결과 데이터 */
  data: ContentSubmitResponseData;
}

/**
 * 타임캡슐 콘텐츠 제출 API 에러 응답 타입
 */
export interface ContentSubmitErrorResponse {
  success: false;
  /** 에러 코드 */
  error: string;
  /** 에러 메시지 */
  message: string;
}
