/**
 * components/notice/components/notice-list/types.ts
 * 공지사항 목록 컴포넌트 Props 타입 정의
 */

import type { NoticeItem } from '../../types';

export interface NoticeListProps {
  /** 공지사항 목록 데이터 */
  notices: NoticeItem[];
  /** 항목 클릭 핸들러 */
  onNoticePress: (noticeId: string) => void;
  /** 빈 상태 컴포넌트 */
  ListEmptyComponent?: React.ComponentType;
}
