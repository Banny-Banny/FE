/**
 * components/notice/components/notice-detail/types.ts
 * 공지사항 상세 컴포넌트 Props 타입 정의
 */

import type { NoticeDetail } from '../../types';

/**
 * 공지사항 상세 컴포넌트 Props
 */
export interface NoticeDetailProps {
  /** 공지사항 상세 정보 */
  notice: NoticeDetail | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 재시도 함수 */
  onRetry?: () => void;
}
