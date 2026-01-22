# Tasks: 공지사항 페이지

## Feature: 공지사항 페이지

**Status**: 📋 **PLANNING** — 전체 구현 작업 목록

**Overview**: TimeEgg 앱의 공지사항 페이지 구현. 마이페이지 메뉴 리스트에서 공지사항 메뉴를 통해 공지사항 목록을 확인하고, 상세 내용을 조회할 수 있습니다. 검색 및 페이지네이션 기능을 지원합니다. UI 우선 접근 방식으로 Mock 데이터를 사용하여 먼저 UI를 구현하고, 이후 실제 API로 교체합니다.

---

## Phase 1: 기반 구조 및 타입 정의 (Setup)

**Goal**: 공지사항 기능의 기본 구조 및 타입 정의 (UI 우선, Mock 데이터 사용)

**Duration**: 1-2일

**Independent Test**: 폴더 구조가 생성되고, 타입 정의가 완료되며, Mock 데이터가 준비되고, 라우트 상수가 추가됨

### Tasks for Phase 1

#### 1.1 폴더 구조 생성

- [X] T001 [P] Create `components/notice/` directory
- [X] T002 [P] Create `components/notice/components/` directory
- [X] T003 [P] Create `components/notice/hooks/` directory
- [X] T004 [P] Create `app/(tabs)/notices/` directory

#### 1.2 타입 정의

- [X] T005 Create `components/notice/types.ts` with NoticeItem type (id, title, imageUrl, isPinned, createdAt)
- [X] T006 Create `components/notice/types.ts` with NoticeDetail type (id, title, content, imageUrl, isPinned, createdAt, updatedAt)
- [X] T007 Create `components/notice/types.ts` with NoticeListResponse type (success, data: { items, total, limit, offset })
- [X] T008 Create `components/notice/types.ts` with NoticeDetailResponse type (success, data: NoticeDetail)
- [X] T009 Create `components/notice/types.ts` with NoticeListParams type (search?, limit?, offset?)
- [X] T010 Create `components/notice/types.ts` with NoticeListState type (items, total, limit, offset, hasNext, isLoading, error)

#### 1.3 라우트 상수 추가

- [X] T011 Add `NOTICES: '/(tabs)/notices'` to `commons/constants/routes.ts`
- [X] T012 Add `NOTICE_DETAIL: '/(tabs)/notices/[id]'` to `commons/constants/routes.ts`
- [X] T013 Update RouteKey and RoutePath types in `commons/constants/routes.ts` to include NOTICES and NOTICE_DETAIL

#### 1.4 API 엔드포인트 상수 추가

- [X] T014 Add `NOTICES: { LIST: 'api/notices', DETAIL: 'api/notices/{id}' }` to `commons/constants/endpoints.ts`

#### 1.5 기본 스타일 파일 생성

- [X] T015 Create `components/notice/styles.ts` with StyleSheet.create()

---

## Phase 2: 마이페이지 메뉴 추가 (Foundational)

**Goal**: 마이페이지 메뉴 리스트에 공지사항 메뉴 추가

**Duration**: 0.5일

**Independent Test**: 마이페이지에서 공지사항 메뉴가 표시되고, 클릭 시 공지사항 목록 페이지로 이동함

**Dependencies**: Phase 1 완료 필요

### Tasks for Phase 2

#### 2.1 메뉴 리스트 수정

- [X] T016 [US1] Update `components/mypage/components/menu-list/index.tsx` to change "고객 센터" from menuItemLast to menuItem (add divider)
- [X] T017 [US1] Add "공지사항" menu item as menuItemLast (last item, no divider) to `components/mypage/components/menu-list/index.tsx`
- [X] T018 [US1] Add onNoticePress prop to MenuListProps interface in `components/mypage/components/menu-list/index.tsx`
- [X] T019 [US1] Add Pressable handler for notice menu item in `components/mypage/components/menu-list/index.tsx`
- [X] T020 [US1] Update `components/mypage/index.tsx` to add handleNoticePress handler that navigates to notices page
- [X] T021 [US1] Pass onNoticePress prop to MenuList component in `components/mypage/index.tsx`

---

## Phase 3: 공지사항 목록 조회 (User Story 1 - P1)

**Goal**: 마이페이지에서 공지사항 메뉴를 통해 공지사항 목록을 확인할 수 있습니다.

**Duration**: 3-4일

**Independent Test**: 마이페이지에서 공지사항 메뉴를 탭하여 공지사항 목록 페이지로 이동하고, 공지사항 목록이 표시되는지 확인할 수 있습니다.

**Dependencies**: Phase 1, Phase 2 완료 필요

### Tasks for Phase 3

#### 3.1 공지사항 항목 컴포넌트 (UI 우선 - 하드코딩 데이터)

- [X] T028 [P] [US1] Create `components/notice/components/notice-item/` directory
- [X] T029 [P] [US1] Create `components/notice/components/notice-item/types.ts` with NoticeItemProps type
- [X] T030 [P] [US1] Create `components/notice/components/notice-item/styles.ts` with StyleSheet definitions
- [X] T031 [P] [US1] Create `components/notice/components/notice-item/index.tsx` with title display (하드코딩 샘플 데이터 사용)
- [X] T032 [P] [US1] Add createdAt date formatting to `components/notice/components/notice-item/index.tsx`
- [X] T033 [P] [US1] Add isPinned indicator display to `components/notice/components/notice-item/index.tsx`
- [X] T034 [P] [US1] Add onPress handler to `components/notice/components/notice-item/index.tsx`

#### 3.2 공지사항 목록 컴포넌트 (UI 우선 - 하드코딩 데이터)

- [X] T035 [P] [US1] Create `components/notice/components/notice-list/` directory
- [X] T036 [P] [US1] Create `components/notice/components/notice-list/types.ts` with NoticeListProps type
- [X] T037 [P] [US1] Create `components/notice/components/notice-list/styles.ts` with StyleSheet definitions
- [X] T038 [P] [US1] Create `components/notice/components/notice-list/index.tsx` with FlatList implementation (하드코딩 샘플 배열 사용)
- [X] T039 [P] [US1] Add renderItem function using NoticeItem component to `components/notice/components/notice-list/index.tsx`
- [X] T040 [P] [US1] Add keyExtractor using notice id to `components/notice/components/notice-list/index.tsx`

#### 3.3 빈 상태 컴포넌트 (UI 우선)

- [X] T041 [P] [US1] Create `components/notice/components/notice-empty/` directory
- [X] T042 [P] [US1] Create `components/notice/components/notice-empty/types.ts` with NoticeEmptyProps type
- [X] T043 [P] [US1] Create `components/notice/components/notice-empty/styles.ts` with StyleSheet definitions
- [X] T044 [P] [US1] Create `components/notice/components/notice-empty/index.tsx` with empty state message display
- [X] T045 [P] [US1] Add ListEmptyComponent using NoticeEmpty to `components/notice/components/notice-list/index.tsx`

#### 3.4 Mock Data 생성 (디자인 확인 후 데이터 연결)

- [X] T022 [P] [US1] Create mock data for NoticeListResponse in `components/notice/hooks/useNotices.ts`
- [X] T023 [P] [US1] Add multiple notice items with various isPinned values to mock data in `components/notice/hooks/useNotices.ts`
- [X] T024 [P] [US1] Add empty list mock data case to `components/notice/hooks/useNotices.ts`

#### 3.5 Mock Data 기반 훅 구현 (UI와 데이터 연결)

- [X] T025 [US1] Create `components/notice/hooks/useNotices.ts` with Mock Data implementation
- [X] T026 [US1] Add return type interface (notices, total, limit, offset, hasNext, isLoading, error) to `components/notice/hooks/useNotices.ts`
- [X] T027 [US1] Implement Mock Data return logic in `components/notice/hooks/useNotices.ts`

#### 3.6 Feature Container 구현 (Mock Data 연결)

- [X] T046 [US1] Create `components/notice/index.tsx` as Feature Container for notice list
- [X] T047 [US1] Import useNotices hook in `components/notice/index.tsx`
- [X] T048 [US1] Import NoticeList and NoticeEmpty components in `components/notice/index.tsx`
- [X] T049 [US1] Add loading state handling in `components/notice/index.tsx`
- [X] T050 [US1] Add error state handling in `components/notice/index.tsx`
- [X] T051 [US1] Add handleNoticePress handler for navigation to detail page in `components/notice/index.tsx`

#### 3.7 라우팅 설정

- [X] T052 [US1] Create `app/(tabs)/notices/index.tsx` with routing to NoticeFeature component
- [X] T053 [US1] Add proper imports and default export to `app/(tabs)/notices/index.tsx`

---

## Phase 4: 공지사항 상세 조회 (User Story 3 - P1)

**Goal**: 공지사항 목록에서 특정 공지사항을 선택하여 상세 내용을 확인할 수 있습니다.

**Duration**: 2-3일

**Independent Test**: 공지사항 목록에서 공지사항 항목을 탭하여 상세 페이지로 이동하고, 공지사항의 제목과 본문이 표시되는지 확인할 수 있습니다.

**Dependencies**: Phase 3 완료 필요

### Tasks for Phase 4

#### 4.1 공지사항 상세 컴포넌트 (UI 우선 - 하드코딩 데이터)

- [X] T060 [P] [US3] Create `components/notice/components/notice-detail/` directory
- [X] T061 [P] [US3] Create `components/notice/components/notice-detail/types.ts` with NoticeDetailProps type
- [X] T062 [P] [US3] Create `components/notice/components/notice-detail/styles.ts` with StyleSheet definitions
- [X] T063 [P] [US3] Create `components/notice/components/notice-detail/index.tsx` with title display (하드코딩 샘플 데이터 사용)
- [X] T064 [P] [US3] Add content display to `components/notice/components/notice-detail/index.tsx`
- [X] T065 [P] [US3] Add createdAt date formatting to `components/notice/components/notice-detail/index.tsx`
- [X] T066 [P] [US3] Add updatedAt date display (if exists) to `components/notice/components/notice-detail/index.tsx`
- [X] T067 [P] [US3] Add imageUrl display (if exists) to `components/notice/components/notice-detail/index.tsx`
- [X] T068 [P] [US3] Add loading state display to `components/notice/components/notice-detail/index.tsx`
- [X] T069 [P] [US3] Add error state display to `components/notice/components/notice-detail/index.tsx`

#### 4.2 Mock Data 생성 (디자인 확인 후 데이터 연결)

- [X] T054 [P] [US3] Create mock data for NoticeDetailResponse in `components/notice/hooks/useNoticeDetail.ts`
- [X] T055 [P] [US3] Add various notice detail samples (with/without imageUrl, with/without updatedAt) to mock data in `components/notice/hooks/useNoticeDetail.ts`

#### 4.3 Mock Data 기반 훅 구현 (UI와 데이터 연결)

- [X] T056 [US3] Create `components/notice/hooks/useNoticeDetail.ts` with Mock Data implementation
- [X] T057 [US3] Add noticeId parameter to `components/notice/hooks/useNoticeDetail.ts`
- [X] T058 [US3] Add return type interface (notice, isLoading, error) to `components/notice/hooks/useNoticeDetail.ts`
- [X] T059 [US3] Implement Mock Data return logic based on noticeId in `components/notice/hooks/useNoticeDetail.ts`

#### 4.4 Feature Container 구현 (Mock Data 연결)

- [X] T070 [US3] Create `components/notice/components/notice-detail-container/index.tsx` as Feature Container for notice detail
- [X] T071 [US3] Import useNoticeDetail hook in `components/notice/components/notice-detail-container/index.tsx`
- [X] T072 [US3] Get noticeId from route params in `components/notice/components/notice-detail-container/index.tsx`
- [X] T073 [US3] Import NoticeDetail component in `components/notice/components/notice-detail-container/index.tsx`
- [X] T074 [US3] Add loading state handling in `components/notice/components/notice-detail-container/index.tsx`
- [X] T075 [US3] Add error state handling in `components/notice/components/notice-detail-container/index.tsx`

#### 4.5 라우팅 설정

- [X] T076 [US3] Create `app/(tabs)/notices/[id].tsx` with routing to NoticeDetailContainer component
- [X] T077 [US3] Add proper imports and default export to `app/(tabs)/notices/[id].tsx`
- [X] T078 [US3] Update handleNoticePress in `components/notice/index.tsx` to navigate with notice id

---

## Phase 5: 공지사항 검색 (User Story 2 - P2)

**Goal**: 공지사항 목록에서 검색 키워드를 입력하여 제목 또는 본문에 해당 키워드가 포함된 공지사항을 찾을 수 있습니다.

**Duration**: 2-3일

**Independent Test**: 공지사항 목록 페이지에서 검색어를 입력하고 검색 결과가 필터링되어 표시되는지 확인할 수 있습니다.

**Dependencies**: Phase 3 완료 필요

### Tasks for Phase 5

#### 5.1 검색 디바운싱 훅 구현

- [X] T079 [P] [US2] Create `components/notice/hooks/useNoticeSearch.ts` with debounce logic
- [X] T080 [P] [US2] Add searchTerm state to `components/notice/hooks/useNoticeSearch.ts`
- [X] T081 [P] [US2] Add debouncedSearchTerm state to `components/notice/hooks/useNoticeSearch.ts`
- [X] T082 [P] [US2] Implement 300ms debounce using useEffect in `components/notice/hooks/useNoticeSearch.ts`
- [X] T083 [P] [US2] Add return interface (searchTerm, debouncedSearchTerm, setSearchTerm) to `components/notice/hooks/useNoticeSearch.ts`

#### 5.2 검색 입력 컴포넌트

- [X] T084 [P] [US2] Create `components/notice/components/notice-search/` directory
- [X] T085 [P] [US2] Create `components/notice/components/notice-search/types.ts` with NoticeSearchProps type
- [X] T086 [P] [US2] Create `components/notice/components/notice-search/styles.ts` with StyleSheet definitions
- [X] T087 [P] [US2] Create `components/notice/components/notice-search/index.tsx` with TextInput implementation
- [X] T088 [P] [US2] Add placeholder text to `components/notice/components/notice-search/index.tsx`
- [X] T089 [P] [US2] Add onChangeText handler to `components/notice/components/notice-search/index.tsx`
- [X] T090 [P] [US2] Add clear button functionality to `components/notice/components/notice-search/index.tsx`

#### 5.3 검색 기능 통합

- [X] T091 [US2] Import useNoticeSearch hook in `components/notice/index.tsx`
- [X] T092 [US2] Import NoticeSearch component in `components/notice/index.tsx`
- [X] T093 [US2] Add NoticeSearch component above NoticeList in `components/notice/index.tsx`
- [X] T094 [US2] Pass searchTerm and setSearchTerm to NoticeSearch component in `components/notice/index.tsx`
- [X] T095 [US2] Update useNotices hook call to include search parameter in `components/notice/index.tsx`
- [X] T096 [US2] Update Mock Data filtering logic to support search in `components/notice/hooks/useNotices.ts`

#### 5.4 검색 결과 없음 처리

- [X] T097 [US2] Add search empty state message to `components/notice/components/notice-empty/index.tsx`
- [X] T098 [US2] Add isSearchEmpty prop to NoticeEmptyProps in `components/notice/components/notice-empty/types.ts`
- [X] T099 [US2] Update NoticeList to pass isSearchEmpty prop to NoticeEmpty in `components/notice/components/notice-list/index.tsx`

---

## Phase 6: 공지사항 무한 스크롤 (User Story 4 - P2)

**Goal**: 공지사항 목록을 스크롤하여 더 많은 공지사항을 자동으로 불러올 수 있습니다.

**Duration**: 2-3일

**Independent Test**: 공지사항 목록을 스크롤하여 하단에 도달하면 다음 페이지의 공지사항이 자동으로 로드되는지 확인할 수 있습니다.

**Dependencies**: Phase 3 완료 필요

### Tasks for Phase 6

#### 6.1 Mock Data 기반 무한 스크롤 구현

- [X] T100 [US4] Update useNotices hook to support offset parameter in `components/notice/hooks/useNotices.ts`
- [X] T101 [US4] Add offset state management to `components/notice/index.tsx`
- [X] T102 [US4] Add hasNext calculation logic in `components/notice/index.tsx`
- [X] T103 [US4] Add handleLoadMore function for infinite scroll in `components/notice/index.tsx`
- [X] T104 [US4] Update Mock Data to support pagination (limit: 10) in `components/notice/hooks/useNotices.ts`

#### 6.2 무한 스크롤 UI 구현

- [X] T105 [US4] Add onEndReached handler to FlatList in `components/notice/components/notice-list/index.tsx`
- [X] T106 [US4] Add onEndReachedThreshold prop (0.5) to FlatList in `components/notice/components/notice-list/index.tsx`
- [X] T107 [US4] Pass onLoadMore and hasNext props to NoticeList component in `components/notice/index.tsx`
- [X] T108 [US4] Add loading indicator at bottom when loading more in `components/notice/components/notice-list/index.tsx`

---

## Phase 7: 실제 API 연동 (Polish & Cross-cutting)

**Goal**: Mock Data를 제거하고 실제 API 호출로 교체하며, 에러 처리 및 로딩 상태를 개선합니다.

**Duration**: 3-4일

**Dependencies**: Phase 3, Phase 4, Phase 5, Phase 6 완료 필요

### Tasks for Phase 7

#### 7.1 React Query 훅 구현 (목록)

- [X] T109 [P] Remove Mock Data from `components/notice/hooks/useNotices.ts`
- [X] T110 [P] Update `components/notice/hooks/useNotices.ts` to use React Query useQuery
- [X] T111 [P] Import useQuery from @tanstack/react-query in `components/notice/hooks/useNotices.ts`
- [X] T112 [P] Import apiClient from @/utils/apiClient in `components/notice/hooks/useNotices.ts`
- [X] T113 [P] Add queryKey with search, limit, offset parameters in `components/notice/hooks/useNotices.ts`
- [X] T114 [P] Implement queryFn with GET /api/notices API call in `components/notice/hooks/useNotices.ts`
- [X] T115 [P] Add query parameter building logic (search, limit, offset) in `components/notice/hooks/useNotices.ts`
- [X] T116 [P] Add staleTime (60s) and gcTime (5min) configuration in `components/notice/hooks/useNotices.ts`
- [X] T117 [P] Add error handling and transformation in `components/notice/hooks/useNotices.ts`
- [X] T118 [P] Add refetch function to return value in `components/notice/hooks/useNotices.ts`

#### 7.2 React Query 훅 구현 (상세)

- [X] T119 [P] Remove Mock Data from `components/notice/hooks/useNoticeDetail.ts`
- [X] T120 [P] Update `components/notice/hooks/useNoticeDetail.ts` to use React Query useQuery
- [X] T121 [P] Import useQuery from @tanstack/react-query in `components/notice/hooks/useNoticeDetail.ts`
- [X] T122 [P] Import apiClient from @/utils/apiClient in `components/notice/hooks/useNoticeDetail.ts`
- [X] T123 [P] Add queryKey with noticeId parameter in `components/notice/hooks/useNoticeDetail.ts`
- [X] T124 [P] Implement queryFn with GET /api/notices/{id} API call in `components/notice/hooks/useNoticeDetail.ts`
- [X] T125 [P] Add staleTime (60s) and gcTime (5min) configuration in `components/notice/hooks/useNoticeDetail.ts`
- [X] T126 [P] Add error handling and transformation in `components/notice/hooks/useNoticeDetail.ts`
- [X] T127 [P] Add refetch function to return value in `components/notice/hooks/useNoticeDetail.ts`

#### 7.3 무한 스크롤 API 연동 (useInfiniteQuery)

- [X] T128 [US4] Update useNotices to use useInfiniteQuery for infinite scroll in `components/notice/hooks/useNotices.ts`
- [X] T129 [US4] Import useInfiniteQuery from @tanstack/react-query in `components/notice/hooks/useNotices.ts`
- [X] T130 [US4] Implement getNextPageParam logic (offset 기반) in `components/notice/hooks/useNotices.ts`
- [X] T131 [US4] Update return value to flatten pages data in `components/notice/hooks/useNotices.ts`
- [X] T132 [US4] Update handleLoadMore to use fetchNextPage in `components/notice/index.tsx`
- [X] T133 [US4] Add isFetchingNextPage state handling in `components/notice/index.tsx`

#### 7.4 에러 처리 및 재시도

- [X] T134 [P] Add error message display component to `components/notice/components/notice-list/index.tsx`
- [X] T135 [P] Add retry button functionality to error display in `components/notice/components/notice-list/index.tsx`
- [X] T136 [P] Add error message display component to `components/notice/components/notice-detail/index.tsx`
- [X] T137 [P] Add retry button functionality to error display in `components/notice/components/notice-detail/index.tsx`
- [X] T138 [P] Handle infinite scroll error state in `components/notice/components/notice-list/index.tsx`

#### 7.5 로딩 상태 개선

- [X] T139 [P] Add loading indicator component to `components/notice/components/notice-list/index.tsx`
- [X] T140 [P] Add loading indicator component to `components/notice/components/notice-detail/index.tsx`
- [X] T141 [P] Add skeleton UI for notice list items (optional) in `components/notice/components/notice-list/index.tsx`

#### 7.6 고정 공지사항 정렬

- [X] T142 [US1] Add isPinned sorting logic (pinned items first) in `components/notice/hooks/useNotices.ts` (API 응답에서 정렬된 데이터를 받거나 클라이언트에서 정렬)

---

## Dependencies

### User Story Completion Order

1. **Phase 1 (Setup)** → 모든 Phase의 기반
2. **Phase 2 (Foundational)** → Phase 3의 전제 조건
3. **Phase 3 (US1 - 목록 조회)** → 독립적으로 완료 가능, MVP 범위
4. **Phase 4 (US3 - 상세 조회)** → Phase 3 완료 필요
5. **Phase 5 (US2 - 검색)** → Phase 3 완료 필요
6. **Phase 6 (US4 - 무한 스크롤)** → Phase 3 완료 필요
7. **Phase 7 (API 연동)** → Phase 3, 4, 5, 6 완료 필요

### Parallel Execution Opportunities

**Phase 1 내에서:**
- T001-T004: 폴더 구조 생성 (병렬 가능)
- T005-T010: 타입 정의 (순차적이지만 빠르게 완료 가능)

**Phase 3 내에서:**
- T028-T034: NoticeItem 컴포넌트 (UI 우선, 병렬 가능)
- T035-T040: NoticeList 컴포넌트 (UI 우선, 병렬 가능)
- T041-T045: NoticeEmpty 컴포넌트 (UI 우선, 병렬 가능)
- T022-T024: Mock Data 생성 (UI 완성 후, 병렬 가능)
- T025-T027: Mock Data 훅 구현 (Mock Data 생성 후, 순차적)

**Phase 4 내에서:**
- T060-T069: NoticeDetail 컴포넌트 (UI 우선, 병렬 가능)
- T054-T055: Mock Data 생성 (UI 완성 후, 병렬 가능)
- T056-T059: Mock Data 훅 구현 (Mock Data 생성 후, 순차적)

**Phase 5 내에서:**
- T079-T083: 검색 훅 (병렬 가능)
- T084-T090: 검색 컴포넌트 (병렬 가능)

**Phase 7 내에서:**
- T109-T118: 목록 API 연동 (Mock Data 제거 포함, 병렬 가능)
- T119-T127: 상세 API 연동 (Mock Data 제거 포함, 병렬 가능)
- T128-T133: 무한 스크롤 API 연동 (useInfiniteQuery, 병렬 가능)
- T134-T142: 에러 처리 및 로딩 상태 (병렬 가능)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Phase 1 + Phase 2 + Phase 3만 구현하면 MVP 완성**

- ✅ 기본 구조 및 타입 정의
- ✅ 마이페이지 메뉴 추가
- ✅ 공지사항 목록 조회 (Mock Data)
- ✅ 공지사항 상세 조회 (Mock Data)

이 MVP로 사용자는 공지사항을 확인할 수 있으며, 디자인 컨펌을 받을 수 있습니다.

### Incremental Delivery

1. **Week 1**: Phase 1-3 완료 (MVP)
2. **Week 2**: Phase 4-6 완료 (검색, 무한 스크롤 추가)
3. **Week 3**: Phase 7 완료 (실제 API 연동)

---

## Task Summary

- **Total Tasks**: 143 tasks
- **Phase 1 (Setup)**: 15 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **Phase 3 (US1 - 목록 조회)**: 32 tasks
- **Phase 4 (US3 - 상세 조회)**: 25 tasks
- **Phase 5 (US2 - 검색)**: 21 tasks
- **Phase 6 (US4 - 무한 스크롤)**: 9 tasks
- **Phase 7 (API 연동)**: 35 tasks (Mock Data 제거 포함)

### Independent Test Criteria

- **Phase 1**: 폴더 구조 생성 및 타입 정의 완료 확인
- **Phase 2**: 마이페이지에서 공지사항 메뉴 표시 및 네비게이션 동작 확인
- **Phase 3**: 공지사항 목록 UI 컴포넌트가 하드코딩 데이터로 먼저 표시되고, 이후 Mock Data로 정상 표시되는지 확인
- **Phase 4**: 공지사항 상세 UI 컴포넌트가 하드코딩 데이터로 먼저 표시되고, 이후 Mock Data로 정상 표시되는지 확인
- **Phase 5**: 검색어 입력 시 필터링된 결과가 표시되는지 확인
- **Phase 6**: 무한 스크롤 시 다음 페이지가 자동으로 로드되는지 확인
- **Phase 7**: 실제 API 호출이 정상 동작하고 에러 처리가 되는지 확인

---

## Notes

- 모든 컴포넌트는 StyleSheet.create()를 사용하여 스타일을 정의합니다.
- 모든 색상은 `@/commons/constants`의 Colors 토큰을 사용합니다.
- 모든 스타일은 인라인 스타일을 사용하지 않습니다.
- Feature Slice Architecture 패턴을 엄격히 따릅니다.
- **UI 우선 접근 방식**: UI 컴포넌트를 먼저 구현하고(하드코딩 샘플 데이터 사용), 디자인 확인 후 Mock Data를 연결하고, 최종적으로 실제 API로 전환합니다.
