/**
 * components/notice/components/notice-search/types.ts
 * 공지사항 검색 컴포넌트 Props 타입 정의
 */

export interface NoticeSearchProps {
  /** 검색어 */
  searchTerm: string;
  /** 검색어 변경 핸들러 */
  onChangeText: (text: string) => void;
}
