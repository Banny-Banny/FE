# Quickstart: 공지사항 페이지

**Feature**: 공지사항 페이지  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## 개발 순서

### Phase 1: Mock Data 기반 UI 개발

1. **타입 정의**
   - `components/notice/types.ts` 생성
   - API 응답 타입 및 내부 타입 정의

2. **Mock Data 생성**
   - `components/notice/hooks/useNotices.ts`에 Mock Data 추가
   - `components/notice/hooks/useNoticeDetail.ts`에 Mock Data 추가

3. **UI 컴포넌트 개발**
   - 공지사항 목록 컴포넌트 (`components/notice/components/notice-list/`)
   - 공지사항 항목 컴포넌트 (`components/notice/components/notice-item/`)
   - 공지사항 상세 컴포넌트 (`components/notice/components/notice-detail/`)
   - 검색 입력 컴포넌트 (`components/notice/components/notice-search/`)
   - 빈 상태 컴포넌트 (`components/notice/components/notice-empty/`)

4. **Feature Container 개발**
   - `components/notice/index.tsx` 생성
   - 목록 및 상세 페이지 컨테이너 구성

5. **라우팅 설정**
   - `app/(tabs)/notices/index.tsx` 생성 (목록 페이지)
   - `app/(tabs)/notices/[id].tsx` 생성 (상세 페이지)
   - `commons/constants/routes.ts`에 경로 추가

6. **메뉴 추가**
   - 마이페이지 메뉴에 공지사항 추가 (`components/mypage/components/menu-list/index.tsx`)
     - "고객 센터" 메뉴를 menuItemLast에서 menuItem으로 변경 (구분선 추가)
     - "공지사항" 메뉴를 menuItemLast로 추가 (마지막 항목, 구분선 없음)
     - 메뉴 순서: 설정 → 결제 내역 → 고객 센터 → 공지사항
     - 클릭 시 공지사항 목록 페이지로 이동

7. **디자인 컨펌**
   - Mock Data 기반 UI를 사용자에게 보여주고 컨펌 받기

### Phase 2: 실제 API 연동

1. **API 엔드포인트 추가**
   - `commons/constants/endpoints.ts`에 공지사항 엔드포인트 추가

2. **React Query 훅 구현**
   - `useNotices` 훅에 실제 API 호출 로직 추가
   - `useNoticeDetail` 훅에 실제 API 호출 로직 추가
   - 페이지네이션 로직 구현 (무한 스크롤)

3. **검색 기능 구현**
   - 디바운싱 적용
   - 검색어 변경 시 API 호출

4. **에러 처리**
   - 네트워크 오류 처리
   - 재시도 로직 구현

5. **로딩 상태 처리**
   - 로딩 인디케이터 표시
   - 스켈레톤 UI (선택사항)

## 파일 구조

```
components/notice/
├── index.tsx                    # Feature Container (목록)
├── types.ts                     # 타입 정의
├── styles.ts                    # Feature 스타일
├── hooks/
│   ├── useNotices.ts           # 공지사항 목록 조회 훅
│   └── useNoticeDetail.ts      # 공지사항 상세 조회 훅
└── components/
    ├── notice-list/
    │   ├── index.tsx
    │   ├── styles.ts
    │   └── types.ts
    ├── notice-item/
    │   ├── index.tsx
    │   ├── styles.ts
    │   └── types.ts
    ├── notice-detail/
    │   ├── index.tsx
    │   ├── styles.ts
    │   └── types.ts
    ├── notice-search/
    │   ├── index.tsx
    │   ├── styles.ts
    │   └── types.ts
    └── notice-empty/
        ├── index.tsx
        ├── styles.ts
        └── types.ts

app/(tabs)/notices/
├── index.tsx                    # 공지사항 목록 페이지
└── [id].tsx                    # 공지사항 상세 페이지
```

## 주요 구현 포인트

### 1. 타입 정의

```typescript
// components/notice/types.ts

// API 응답 타입
export interface NoticeListResponse {
  success: boolean;
  data: {
    items: NoticeItem[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface NoticeDetailResponse {
  success: boolean;
  data: NoticeDetail;
}

// 내부 타입
export interface NoticeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
}

export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string | null;
}
```

### 2. Mock Data 기반 훅

```typescript
// components/notice/hooks/useNotices.ts (Phase 1)

export function useNotices(params?: NoticeListParams) {
  // Mock Data 반환
  const mockData: NoticeListResponse = {
    success: true,
    data: {
      items: [...],
      total: 21,
      limit: 10,
      offset: 0,
    },
  };
  
  return {
    notices: mockData.data.items,
    total: mockData.data.total,
    limit: mockData.data.limit,
    offset: mockData.data.offset,
    hasNext: mockData.data.offset + mockData.data.limit < mockData.data.total,
    isLoading: false,
    error: null,
  };
}
```

### 3. 실제 API 연동 (Phase 2)

```typescript
// components/notice/hooks/useNotices.ts (Phase 2)

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';

export function useNotices(params?: NoticeListParams) {
  const { search, limit = 10, offset = 0 } = params || {};
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notices', search, limit, offset],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      
      const response = await apiClient.get<NoticeListResponse>(
        `/api/notices?${queryParams.toString()}`
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  
  return {
    notices: data?.data.items || [],
    total: data?.data.total || 0,
    limit: data?.data.limit || limit,
    offset: data?.data.offset || offset,
    hasNext: (data?.data.offset || 0) + (data?.data.limit || 0) < (data?.data.total || 0),
    isLoading,
    error: error ? (error instanceof Error ? error.message : '공지사항을 불러오는 중 오류가 발생했습니다.') : null,
    refetch,
  };
}
```

### 4. 검색 디바운싱

```typescript
// components/notice/hooks/useNoticeSearch.ts

import { useState, useEffect } from 'react';

export function useNoticeSearch() {
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
```

### 5. 무한 스크롤 구현

```typescript
// components/notice/components/notice-list/index.tsx

import { FlatList } from 'react-native';

export function NoticeList({ notices, onLoadMore, hasNext, isLoading }) {
  const handleEndReached = () => {
    if (hasNext && !isLoading) {
      onLoadMore();
    }
  };
  
  return (
    <FlatList
      data={notices}
      renderItem={({ item }) => <NoticeItem notice={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<NoticeEmpty />}
    />
  );
}
```

## 체크리스트

### Phase 1: Mock Data 기반 UI 개발
- [ ] 타입 정의 완료
- [ ] Mock Data 생성 완료
- [ ] UI 컴포넌트 개발 완료
- [ ] Feature Container 개발 완료
- [ ] 라우팅 설정 완료
- [ ] 메뉴 추가 완료
- [ ] 디자인 컨펌 완료

### Phase 2: 실제 API 연동
- [ ] API 엔드포인트 추가 완료
- [ ] React Query 훅 구현 완료
- [ ] 페이지네이션 구현 완료
- [ ] 검색 기능 구현 완료 (디바운싱 포함)
- [ ] 에러 처리 구현 완료
- [ ] 재시도 로직 구현 완료
- [ ] 로딩 상태 처리 완료

## 참고 자료

- [Data Model](./data-model.md) - 데이터 모델 상세 정보
- [API Contracts](./contracts/notices-api.yaml) - API 스펙
- [Research](./research.md) - 기술 결정사항
