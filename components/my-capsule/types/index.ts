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
  status: 'WAITING' | 'OPENED' | 'LOCKED';        // 캡슐 상태
  openDate: string;                                // 개봉 날짜 (ISO 8601)
  participantCount: number;                        // 참여 인원 수
  myWriteStatus: boolean;                          // 내 작성 여부
  createdAt: string;                               // 생성 날짜 (ISO 8601)
}

/**
 * 참여중인 타임캡슐 리스트 조회 API 응답 타입 (camelCase)
 */
export interface MyCapsuleListResponse {
  items: MyCapsuleItem[];                          // 캡슐 리스트
}

/**
 * 분류된 캡슐 타입
 * - status와 openDate 기준으로 3가지로 분류
 */
export interface CategorizedCapsules {
  waitingRooms: MyCapsuleItem[];                   // 대기실 (status === "WAITING")
  openedCapsules: MyCapsuleItem[];                 // 열린 캡슐 (status !== "WAITING" && 개봉날짜 과거)
  lockedCapsules: MyCapsuleItem[];                 // 잠긴 캡슐 (status !== "WAITING" && 개봉날짜 미래)
}
