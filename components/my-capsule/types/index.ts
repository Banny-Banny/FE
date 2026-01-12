/**
 * components/my-capsule/types/index.ts
 * 내 캡슐 API 응답 타입 정의
 */

/**
 * 참여중인 타임캡슐 아이템 (camelCase)
 * API 응답: GET /api/me/capsules
 */
export interface MyCapsuleItem {
  id: string;                                      // 캡슐 ID (UUID)
  title: string;                                   // 캡슐 제목
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED' | 'BURIED';  // 캡슐 상태
  openDate: string;                                // 개봉 날짜 (ISO 8601)
  participantCount: number;                        // 참여 인원 수
  completedCount: number;                          // 작성 완료한 참여자 수
  myWriteStatus: boolean;                          // 내 작성 여부
  deadline: string;                                // 제출 마감 시간 (ISO 8601)
  createdAt: string;                               // 생성 날짜 (ISO 8601)
  location?: {                                      // 방장이 제출한 위치 (선택적)
    latitude: number;                              // 위도
    longitude: number;                              // 경도
  };
}

/**
 * 참여중인 타임캡슐 리스트 조회 API 응답 타입 (camelCase)
 */
export interface MyCapsuleListResponse {
  items: MyCapsuleItem[];                          // 캡슐 리스트
}

/**
 * 분류된 캡슐 타입
 * - status 값 기준으로 3가지로 분류
 */
export interface CategorizedCapsules {
  waitingRooms: MyCapsuleItem[];                   // 대기실 (status === "WAITING")
  openedCapsules: MyCapsuleItem[];                 // 열린 캡슐 (status === "COMPLETED" || status === "EXPIRED")
  lockedCapsules: MyCapsuleItem[];                 // 잠긴 캡슐 (status === "BURIED")
}

/**
 * 타임캡슐 상세 조회 API 응답 타입 (camelCase)
 */

/**
 * 작성자 정보
 */
export interface Author {
  id: string;                    // 사용자 ID
  name: string;                  // 사용자 이름
  emoji: string;                 // 사용자 이모지
  profileImg?: string;           // 프로필 이미지 URL (선택적)
}

/**
 * 이미지 미디어
 */
export interface ImageMedia {
  id: string;                    // 이미지 ID (media_id)
  url: string;                   // 이미지 URL (비동기로 가져옴)
  thumbnailUrl?: string;         // 썸네일 URL (선택적)
  objectKey?: string;            // S3 object key (선택적)
}

/**
 * 비디오 미디어
 */
export interface VideoMedia {
  id: string;                    // 비디오 ID (media_id)
  url: string;                   // 비디오 URL (비동기로 가져옴)
  thumbnailUrl: string;          // 비디오 썸네일 URL
  objectKey?: string;            // S3 object key (선택적)
}

/**
 * 오디오 미디어
 */
export interface AudioMedia {
  id: string;                    // 오디오 ID (media_id)
  title: string;                 // 오디오 제목
  url: string;                   // 오디오 URL (비동기로 가져옴)
  objectKey?: string;            // S3 object key (선택적)
}

/**
 * 슬롯 콘텐츠
 */
export interface SlotContent {
  text?: string;                 // 텍스트 메시지 (선택적)
  images?: ImageMedia[];          // 이미지 배열 (선택적)
  video?: VideoMedia;             // 비디오 정보 (선택적)
  audio?: AudioMedia;             // 오디오 정보 (선택적)
}

/**
 * 캡슐 슬롯
 */
export interface CapsuleSlot {
  slotId: string;                // 슬롯 ID
  author: Author;                // 작성자 정보
  isWritten: boolean;            // 작성 여부
  content?: SlotContent;         // 콘텐츠 정보 (작성된 경우만)
}

/**
 * 캡슐 통계 정보
 */
export interface CapsuleStats {
  totalSlots: number;             // 전체 슬롯 수
  filledSlots: number;            // 작성된 슬롯 수
  emptySlots: number;             // 빈 슬롯 수
}

/**
 * 타임캡슐 상세 조회 API 응답
 */
export interface OpenedCapsuleDetailResponse {
  id: string;                     // 캡슐 ID (UUID)
  title: string;                  // 캡슐 제목
  headcount: number;              // 참여 인원 수
  isLocked: boolean;              // 잠김 여부 (true: 잠김, false: 열림)
  slots: CapsuleSlot[];           // 슬롯 배열 (headcount만큼)
  stats?: CapsuleStats;           // 통계 정보 (선택적)
}
