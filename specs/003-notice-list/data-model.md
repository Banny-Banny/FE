# Data Model: 공지사항 페이지

**Feature**: 공지사항 페이지  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entities

### 1. Notice (공지사항)

공지사항의 기본 정보를 나타내는 엔티티입니다.

#### Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | `string` | 공지사항 고유 식별자 (UUID) | Required, Unique |
| `title` | `string` | 공지사항 제목 | Required, Non-empty |
| `content` | `string` | 공지사항 본문 | Required (상세 조회 시만) |
| `imageUrl` | `string \| null` | 공지사항 이미지 URL | Optional |
| `isPinned` | `boolean` | 고정 공지사항 여부 | Required, Default: `false` |
| `createdAt` | `string` | 생성일시 (ISO 8601) | Required |
| `updatedAt` | `string \| null` | 수정일시 (ISO 8601) | Optional |

#### Validation Rules

- `id`: UUID 형식이어야 함
- `title`: 최소 1자 이상이어야 함
- `content`: 상세 조회 시에만 존재하며, 최소 1자 이상이어야 함
- `createdAt`: 유효한 ISO 8601 날짜 형식이어야 함
- `updatedAt`: null이거나 유효한 ISO 8601 날짜 형식이어야 함

#### Relationships

- None (독립적인 엔티티)

#### State Transitions

N/A (읽기 전용 엔티티)

---

### 2. NoticeList (공지사항 목록)

공지사항 목록과 페이지네이션 정보를 포함하는 컬렉션입니다.

#### Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `items` | `Notice[]` | 공지사항 배열 | Required, Array |
| `total` | `number` | 전체 공지사항 개수 | Required, >= 0 |
| `limit` | `number` | 페이지 크기 | Required, Default: 10 |
| `offset` | `number` | 오프셋 | Required, Default: 0 |

#### Validation Rules

- `items`: 배열이어야 하며, 각 항목은 Notice 엔티티의 유효성 검사를 통과해야 함
- `total`: 0 이상의 정수여야 함
- `limit`: 1 이상의 정수여야 함 (기본값: 10)
- `offset`: 0 이상의 정수여야 함
- `items.length`: `limit`보다 작거나 같아야 함 (마지막 페이지 제외)

#### Relationships

- Contains multiple `Notice` entities

#### State Transitions

N/A (읽기 전용 컬렉션)

---

### 3. NoticeListParams (공지사항 목록 조회 파라미터)

공지사항 목록 조회 시 사용하는 쿼리 파라미터입니다.

#### Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `search` | `string \| undefined` | 검색 키워드 (제목/본문) | Optional |
| `limit` | `number \| undefined` | 페이지 크기 | Optional, Default: 10 |
| `offset` | `number \| undefined` | 오프셋 | Optional, Default: 0 |

#### Validation Rules

- `search`: 제공되는 경우 빈 문자열이 아니어야 함
- `limit`: 제공되는 경우 1 이상의 정수여야 함
- `offset`: 제공되는 경우 0 이상의 정수여야 함

---

## API Response Types

### NoticeListResponse

공지사항 목록 API 응답 타입입니다.

```typescript
interface NoticeListResponse {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      title: string;
      imageUrl: string | null;
      isPinned: boolean;
      createdAt: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  };
}
```

### NoticeDetailResponse

공지사항 상세 API 응답 타입입니다.

```typescript
interface NoticeDetailResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string | null;
  };
}
```

---

## Internal Types (프론트엔드)

프론트엔드에서 사용하는 내부 타입입니다. API 응답을 내부 타입으로 변환하여 사용합니다.

### NoticeItem

공지사항 목록에서 사용하는 항목 타입입니다.

```typescript
interface NoticeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
}
```

### NoticeDetail

공지사항 상세에서 사용하는 타입입니다.

```typescript
interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string | null;
}
```

### NoticeListState

공지사항 목록 상태를 관리하는 타입입니다.

```typescript
interface NoticeListState {
  items: NoticeItem[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean; // offset + limit < total
  isLoading: boolean;
  error: string | null;
}
```

---

## Data Transformations

### API Response → Internal Type

API 응답(camelCase)을 내부 타입으로 변환합니다.

```typescript
// NoticeListResponse → NoticeItem[]
function transformNoticeListResponse(response: NoticeListResponse): NoticeItem[] {
  return response.data.items.map(item => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
  }));
}

// NoticeDetailResponse → NoticeDetail
function transformNoticeDetailResponse(response: NoticeDetailResponse): NoticeDetail {
  return {
    id: response.data.id,
    title: response.data.title,
    content: response.data.content,
    imageUrl: response.data.imageUrl,
    isPinned: response.data.isPinned,
    createdAt: response.data.createdAt,
    updatedAt: response.data.updatedAt,
  };
}
```

---

## Mock Data

개발 및 디자인 컨펌을 위한 Mock Data입니다.

### Mock NoticeListResponse

```typescript
const mockNoticeListResponse: NoticeListResponse = {
  success: true,
  data: {
    items: [
      {
        id: "b6803a41-08be-40d5-95c7-68d54c4daf24",
        title: "고정 공지사항",
        imageUrl: null,
        isPinned: true,
        createdAt: "2026-01-21T15:33:13.226Z"
      },
      {
        id: "a2782d8f-4834-4e88-ae48-7e9da25ad150",
        title: "테스트 제목",
        imageUrl: null,
        isPinned: false,
        createdAt: "2026-01-21T15:30:23.803Z"
      },
      // ... 더 많은 항목
    ],
    total: 21,
    limit: 10,
    offset: 0
  }
};
```

### Mock NoticeDetailResponse

```typescript
const mockNoticeDetailResponse: NoticeDetailResponse = {
  success: true,
  data: {
    id: "b6803a41-08be-40d5-95c7-68d54c4daf24",
    title: "고정 공지사항",
    content: "이것은 공지사항 본문 내용입니다.",
    imageUrl: null,
    isPinned: true,
    createdAt: "2026-01-21T15:33:13.226Z",
    updatedAt: null
  }
};
```

---

## Edge Cases Handling

### 빈 목록

```typescript
const emptyNoticeListResponse: NoticeListResponse = {
  success: true,
  data: {
    items: [],
    total: 0,
    limit: 10,
    offset: 0
  }
};
```

### 검색 결과 없음

```typescript
const emptySearchResponse: NoticeListResponse = {
  success: true,
  data: {
    items: [],
    total: 0,
    limit: 10,
    offset: 0
  }
};
```

### 네트워크 오류

```typescript
// React Query의 error 객체 사용
// error.response?.status에 따라 처리
```

---

## Notes

- 모든 날짜는 ISO 8601 형식으로 처리합니다.
- `imageUrl`이 null인 경우 이미지를 표시하지 않습니다.
- `isPinned`가 true인 공지사항은 목록 상단에 고정 표시합니다.
- 페이지네이션은 `offset` 기반으로 구현합니다.
- 검색은 `search` 파라미터를 통해 제목/본문에서 검색합니다.
