/**
 * 공지사항 관련 타입 정의
 */

/**
 * 공지사항 목록 항목 타입
 */
export interface NoticeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
}

/**
 * 공지사항 상세 타입
 */
export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * 공지사항 목록 API 응답 타입
 */
export interface NoticeListResponse {
  success: boolean;
  data: {
    items: NoticeItem[];
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * 공지사항 상세 API 응답 타입
 */
export interface NoticeDetailResponse {
  success: boolean;
  data: NoticeDetail;
}

/**
 * 공지사항 목록 조회 파라미터 타입
 */
export interface NoticeListParams {
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * 공지사항 목록 상태 타입
 */
export interface NoticeListState {
  items: NoticeItem[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
}
