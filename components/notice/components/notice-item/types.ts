/**
 * components/notice/components/notice-item/types.ts
 * 공지사항 항목 컴포넌트 Props 타입 정의
 */

import type { NoticeItem } from '../../types';

export interface NoticeItemProps {
  /** 공지사항 항목 데이터 */
  notice: NoticeItem;
  /** 항목 클릭 핸들러 */
  onPress: (noticeId: string) => void;
}
