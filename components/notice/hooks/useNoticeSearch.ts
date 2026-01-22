/**
 * components/notice/hooks/useNoticeSearch.ts
 * 공지사항 검색 디바운싱 훅
 *
 * @description
 * - 검색어 입력 디바운싱 처리
 * - 300ms 디바운스 적용
 */

import { useEffect, useState } from 'react';

/**
 * 검색 훅 반환 타입
 */
export interface UseNoticeSearchReturn {
  /** 현재 검색어 */
  searchTerm: string;
  /** 디바운스된 검색어 */
  debouncedSearchTerm: string;
  /** 검색어 설정 함수 */
  setSearchTerm: (term: string) => void;
}

/**
 * 공지사항 검색 디바운싱 훅
 *
 * @returns 검색어 상태 및 디바운스된 검색어
 */
export function useNoticeSearch(): UseNoticeSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
}
