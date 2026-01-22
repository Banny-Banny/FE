# Research: 공지사항 페이지

**Feature**: 공지사항 페이지  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Tasks

### 1. API 응답 구조 분석

**Task**: 공지사항 API 응답 구조 분석 및 데이터 모델 설계

**Findings**:

#### 공지사항 목록 API (`GET /api/notices`)

**응답 구조**:
```typescript
{
  success: boolean;
  data: {
    items: Array<{
      id: string;              // UUID 형식
      title: string;          // 공지사항 제목
      imageUrl: string | null; // 이미지 URL (선택사항)
      isPinned: boolean;       // 고정 여부
      createdAt: string;       // ISO 8601 형식 (예: "2026-01-21T15:33:13.226Z")
    }>;
    total: number;            // 전체 공지사항 개수
    limit: number;           // 페이지 크기 (기본값: 10)
    offset: number;          // 오프셋 (기본값: 0)
  };
}
```

**쿼리 파라미터**:
- `search` (string, optional): 검색 키워드 (제목/본문)
- `limit` (number, optional): 한 페이지에 표시할 아이템 수 (기본값: 10)
- `offset` (number, optional): 건너뛸 아이템 수 (기본값: 0)

**Decision**: limit을 10으로 고정하여 사용 (사용자 요구사항)

**Rationale**: 
- API 응답 구조가 명확하게 정의되어 있음
- 페이지네이션 정보(total, limit, offset)가 포함되어 있어 무한 스크롤 구현에 적합
- isPinned 필드를 통해 고정 공지사항을 구분할 수 있음

**Alternatives considered**: 
- limit을 동적으로 변경하는 옵션도 있었으나, 사용자 요구사항에 따라 10으로 고정

---

#### 공지사항 상세 API (`GET /api/notices/{id}`)

**응답 구조**:
```typescript
{
  success: boolean;
  data: {
    id: string;                // UUID 형식
    title: string;            // 공지사항 제목
    content: string;          // 공지사항 본문
    imageUrl: string | null;  // 이미지 URL (선택사항)
    isPinned: boolean;        // 고정 여부
    createdAt: string;        // ISO 8601 형식
    updatedAt: string | null; // 수정일 (선택사항)
  };
}
```

**Decision**: API 응답 구조 그대로 사용

**Rationale**:
- 필요한 모든 필드가 포함되어 있음
- content 필드를 통해 본문 내용을 확인할 수 있음
- updatedAt이 null일 수 있어 수정되지 않은 공지사항을 구분 가능

**Alternatives considered**: N/A

---

### 2. React Query 사용 패턴

**Task**: 기존 프로젝트의 React Query 사용 패턴 분석

**Findings**:

프로젝트에서 `@tanstack/react-query`를 사용하여 서버 상태를 관리하고 있습니다.

**기존 패턴** (`components/customer-service/hooks/useInquiries.ts` 참고):
- `useQuery`를 사용하여 데이터 조회
- `queryKey`에 필터링/정렬 파라미터 포함
- `queryFn`에서 `apiClient.get` 사용
- `enabled` 옵션으로 인증 상태 확인
- `staleTime`, `gcTime` 설정으로 캐싱 관리
- API 응답(camelCase)을 내부 타입(snake_case)로 변환하는 패턴 사용

**Decision**: 기존 패턴을 그대로 따름

**Rationale**:
- 프로젝트 전반에 일관된 패턴 적용
- 인증 자동 처리 및 에러 핸들링이 이미 구현되어 있음
- 타입 변환 로직이 명확함

**Alternatives considered**: 
- 새로운 패턴 도입 고려했으나, 기존 패턴 유지가 일관성 측면에서 유리

---

### 3. 페이지네이션 구현 방식

**Task**: 무한 스크롤 vs 페이지 번호 방식 결정

**Findings**:

프로젝트의 다른 기능들을 확인한 결과, 무한 스크롤 방식을 주로 사용하고 있습니다.

**Decision**: 무한 스크롤 방식 사용

**Rationale**:
- 모바일 앱에서 더 자연스러운 UX
- 기존 프로젝트 패턴과 일관성 유지
- React Query의 `useInfiniteQuery`를 활용 가능

**Alternatives considered**: 
- 페이지 번호 방식도 고려했으나, 모바일 앱 특성상 무한 스크롤이 더 적합

---

### 4. 검색 디바운싱 구현

**Task**: 검색어 입력 디바운싱 전략 결정

**Findings**:

사용자 요구사항에 따라 검색어 입력에 디바운싱을 적용해야 합니다.

**Decision**: `lodash.debounce` 또는 커스텀 훅 사용

**Rationale**:
- 불필요한 API 호출 방지
- 사용자 경험 향상 (타이핑 중 API 호출 방지)
- 네트워크 리소스 절약

**Alternatives considered**: 
- 실시간 검색도 고려했으나, 디바운싱 적용이 더 효율적

**Implementation**: 
- React Hook의 `useDebounce` 또는 `useDebouncedCallback` 사용
- 디바운스 시간: 300-500ms 권장

---

### 5. 에러 처리 및 재시도 패턴

**Task**: 네트워크 오류 시 재시도 로직 구현 방식 결정

**Findings**:

프로젝트의 `apiClient`는 이미 에러 인터셉터를 통해 401 에러를 처리하고 있습니다.

**Decision**: React Query의 `retry` 옵션과 커스텀 에러 UI 사용

**Rationale**:
- React Query의 기본 재시도 기능 활용
- 사용자에게 명확한 에러 메시지 표시
- 재시도 버튼을 통한 수동 재시도 옵션 제공

**Alternatives considered**: 
- 자동 재시도만 사용하는 방식도 고려했으나, 사용자 제어 옵션 제공이 더 나은 UX

**Implementation**:
- React Query의 `retry: 3` 설정
- 에러 발생 시 에러 메시지와 재시도 버튼 표시
- `refetch` 함수를 통한 수동 재시도

---

### 6. UI 개발 방식

**Task**: Mock Data 기반 UI 개발 후 데이터 바인딩 방식 결정

**Findings**:

사용자 요구사항에 따라 먼저 mock data로 UI를 구성한 후 실제 데이터를 바인딩하는 방식으로 진행합니다.

**Decision**: Mock Data → UI 구성 → 데이터 바인딩 순서로 진행

**Rationale**:
- 디자인 컨펌을 먼저 받을 수 있음
- 데이터 구조를 명확히 파악한 후 구현 가능
- 단계별 개발로 리스크 감소

**Implementation**:
1. Mock Data 생성 (API 응답 구조 기반)
2. UI 컴포넌트 개발 (Mock Data 사용)
3. 디자인 컨펌 받기
4. 실제 API 연동 및 데이터 바인딩

---

## Summary

모든 연구 작업이 완료되었으며, 다음 결정사항들이 확정되었습니다:

1. **API 응답 구조**: 제공된 구조 그대로 사용
2. **React Query 패턴**: 기존 프로젝트 패턴 따름
3. **페이지네이션**: 무한 스크롤 방식 사용
4. **검색 디바운싱**: 300-500ms 디바운스 적용
5. **에러 처리**: React Query retry + 커스텀 에러 UI
6. **UI 개발**: Mock Data → UI → 데이터 바인딩 순서

다음 단계: Phase 1 - Design & Contracts
