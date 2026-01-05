/**
 * components/timecapsule-create/components/step-room/types.ts
 * StepRoom 타입 정의
 */

// ============================================
// 대기실 상태 타입
// ============================================

/** 대기실 상태 */
export type RoomStatus = 'waiting' | 'ready' | 'submitted';

// ============================================
// 참여자 상태 타입
// ============================================

/** 참여자 상태 */
export type ParticipantStatus = 'completed' | 'pending' | 'waiting';

// ============================================
// 참여자 작성 내용 인터페이스
// ============================================

/** 참여자 작성 내용 */
export interface ParticipantContent {
  /** 텍스트 내용 */
  text?: string;
  /** 이미지 URL 배열 */
  images?: string[];
  /** 음성 녹음 URL */
  voiceRecording?: string;
}

// ============================================
// 참여자 인터페이스
// ============================================

/** 참여자 데이터 */
export interface Participant {
  /** 참여자 고유 ID */
  id: string;
  /** 참여자 이름 */
  name: string;
  /** 아바타 이모지 */
  emoji: string;
  /** 작성 상태 */
  status: ParticipantStatus;
  /** 방장 여부 */
  isHost?: boolean;
  /** 본인 여부 */
  isMe?: boolean;
  /** 입장 시간 (ISO 8601 형식) */
  joinedAt?: string;
  /** 작성 내용 (본인 것만 접근 가능) */
  content?: ParticipantContent;
}

// ============================================
// 캡슐대기실 데이터 인터페이스
// ============================================

/** 캡슐대기실 전체 데이터 */
export interface RoomData {
  // ============================================
  // 캡슐 기본 정보 (스텝 인포에서 전달)
  // ============================================

  /** 캡슐 고유 ID (백엔드 생성, 목데이터: 'capsule-001') */
  capsuleId: string;
  /** 캡슐 이름 */
  capsuleName: string;
  /** 개봉일 (예: "2025.06.10") */
  openDate: string;
  /** 최대 인원 */
  maxParticipants: number;
  /** 이미지 슬롯 수 */
  imageSlots: number;
  /** 추가 옵션 */
  additionalOptions: {
    /** 음악 파일 여부 */
    hasMusicFile: boolean;
    /** 영상 추가 여부 */
    hasVideo: boolean;
  };

  // ============================================
  // 방장 정보
  // ============================================

  /** 방장 ID */
  hostId: string;

  // ============================================
  // 작성 마감 정보
  // ============================================

  /** 작성 마감 시간 (ISO 8601 형식) */
  deadline: string;

  // ============================================
  // 상태
  // ============================================

  /** 대기실 상태 */
  status: RoomStatus;
}

// ============================================
// 프로그레스바 데이터 인터페이스
// ============================================

/** 프로그레스바 데이터 */
export interface Progress {
  /** 완료한 참여자 수 */
  completed: number;
  /** 전체 참여자 수 (입장한 사람만) */
  total: number;
  /** 진행률 (0-100) */
  percentage: number;
}

// ============================================
// 대기실 설정 API 타입
// ============================================

/** 1단계) Order 조회 API 응답 타입 (snake_case) */
export interface OrderResponse {
  order: {
    /** 주문 ID (UUID) */
    order_id: string;
    /** 캡슐 ID (UUID) - 2단계에서 사용 */
    capsule_id: string | null;
    /** 초대 코드 */
    invite_code: string | null;
    /** 주문 상태 (PAID 등) */
    status: string;
    /** 총 결제 금액 */
    total_amount: number;
    /** 시간 옵션 (1_YEAR 등) */
    time_option: string;
    /** 커스텀 개봉일 */
    custom_open_at: string | null;
    /** 참여 인원수 */
    headcount: number;
    /** 총 사진 개수 */
    photo_count: number;
    /** 음성 추가 여부 */
    add_music: boolean;
    /** 동영상 추가 여부 */
    add_video: boolean;
    /** 생성 시간 (ISO 8601) */
    created_at: string;
    /** 수정 시간 (ISO 8601) */
    updated_at: string;
  };
  product: {
    /** 상품 ID (UUID) */
    id: string;
    /** 상품 타입 */
    product_type: string;
    /** 상품명 */
    name: string;
    /** 가격 */
    price: number;
    /** 활성화 여부 */
    is_active: boolean;
    /** 최대 미디어 개수 */
    max_media_count: number;
    /** 미디어 타입들 */
    media_types: string[];
  };
}

/** 2단계) Room Settings 조회 API 응답 타입 (snake_case) - 프로젝트 일관성을 위해 변환 없이 그대로 사용 */
export interface RoomSettingsResponse {
  /** 대기실 ID (UUID) */
  room_id: string;
  /** 캡슐 이름 */
  capsule_name: string;
  /** 개봉 날짜 (YYYY-MM-DD) */
  open_date: string;
  /** 총 인원수 */
  max_participants: number;
  /** 1인당 최대 사진 개수 */
  max_images_per_person: number;
  /** 음성 추가 여부 */
  has_music: boolean;
  /** 동영상 추가 여부 */
  has_video: boolean;
}
