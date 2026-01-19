# Tasks: 고객센터 페이지

## Feature: 고객센터 페이지

**Status**: 📋 **PLANNING** — 전체 구현 작업 목록

**Overview**: TimeEgg 앱의 고객센터 페이지 구현. 네이버 톡톡처럼 관리자와 실시간 채팅을 통해 문의할 수 있는 기능을 제공합니다. UI 우선 접근 방식으로 Mock 데이터를 사용하여 먼저 UI를 구현하고, 이후 실제 API 및 WebSocket으로 교체합니다.

---

## Phase 0: 기반 구조 및 타입 정의 (Setup)

**Goal**: 고객센터 기능의 기본 구조 및 타입 정의 (UI 우선, Mock 데이터 사용)

**Duration**: 2-3일

**Independent Test**: 폴더 구조가 생성되고, 타입 정의가 완료되며, Mock 데이터가 준비되고, 라우트 상수가 추가됨

### Tasks for Phase 0

#### 0.1 폴더 구조 생성

- [X] T001 [P] Create `components/customer-service/` directory
- [X] T002 [P] Create `components/customer-service/components/` directory
- [X] T003 [P] Create `components/customer-service/hooks/` directory
- [X] T004 [P] Create `components/customer-service/mocks/` directory for Mock data

#### 0.2 타입 정의

- [X] T005 Create `components/customer-service/types.ts` with Inquiry type (id, user_id, title, content, admin_reply, is_resolved, status, last_message_at, last_message_preview, created_at, updated_at, deleted_at)
- [X] T006 Create `components/customer-service/types.ts` with InquiryStatus enum ('PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED')
- [X] T007 Create `components/customer-service/types.ts` with ChatMessage type (id, customer_service_id, sender_type, sender_user_id, sender_admin_id, content, is_read_by_admin, is_read_by_user, created_at, updated_at, deleted_at)
- [X] T008 Create `components/customer-service/types.ts` with SenderType enum ('USER' | 'ADMIN')
- [X] T009 Create `components/customer-service/types.ts` with MessageStatus type (sending, sent, failed)
- [X] T010 Create `components/customer-service/types.ts` with ConnectionStatus type (connecting, connected, disconnected, error)

#### 0.3 Mock 데이터 생성

- [X] T011 [P] Create `components/customer-service/mocks/inquiries.ts` with inquiry list Mock data
- [X] T012 [P] Add various inquiry status samples (PENDING, IN_PROGRESS, RESOLVED) to `components/customer-service/mocks/inquiries.ts`
- [X] T013 [P] Create `components/customer-service/mocks/messages.ts` with chat message Mock data
- [X] T014 [P] Add user/admin message samples to `components/customer-service/mocks/messages.ts`
- [X] T015 [P] Add various timestamp message samples to `components/customer-service/mocks/messages.ts`

#### 0.4 라우트 상수 추가

- [X] T016 Add `CUSTOMER_SERVICE: '/(tabs)/customer-service'` to `commons/constants/routes.ts`
- [X] T017 Update RouteKey and RoutePath types in `commons/constants/routes.ts` to include CUSTOMER_SERVICE

#### 0.5 기본 스타일 파일 생성

- [X] T018 Create `components/customer-service/styles.ts` with StyleSheet.create()
- [X] T019 Add basic container styles to `components/customer-service/styles.ts`

---

## Phase 1: 문의 내역 리스트 UI 구현 (UI 우선)

**Goal**: 문의 내역을 리스트로 표시하고 채팅창으로 진입할 수 있는 UI 구현 (Mock 데이터 사용)

**Duration**: 5-7일

**Independent Test**: 문의 내역 리스트가 Mock 데이터로 정상적으로 표시되고, 문의 선택 시 채팅창으로 이동하며, 새 문의 시작이 정상 동작함

### Tasks for Phase 1

#### 1.1 문의 내역 리스트 컴포넌트

- [X] T020 [P] Create `components/customer-service/components/inquiry-list/` directory
- [X] T021 Create `components/customer-service/components/inquiry-list/index.tsx` as inquiry list container component
- [X] T022 [P] Create `components/customer-service/components/inquiry-list/inquiry-item.tsx` with inquiry title display (title field)
- [X] T023 [P] Add last message preview display (last_message_preview) to `components/customer-service/components/inquiry-list/inquiry-item.tsx`
- [X] T024 [P] Add last message time display (last_message_at) to `components/customer-service/components/inquiry-list/inquiry-item.tsx`
- [X] T025 [P] Add inquiry status display (status, is_resolved) to `components/customer-service/components/inquiry-list/inquiry-item.tsx`
- [X] T026 [P] Add unread message count display to `components/customer-service/components/inquiry-list/inquiry-item.tsx`
- [X] T027 [P] Create `components/customer-service/components/inquiry-list/new-inquiry-button.tsx` for new inquiry start button
- [X] T028 Create `components/customer-service/components/inquiry-list/types.ts` with Props types
- [X] T029 Create `components/customer-service/components/inquiry-list/styles.ts` with StyleSheet definitions

#### 1.2 Mock 데이터 훅

- [X] T030 Create `components/customer-service/hooks/useMockInquiries.ts` to return inquiry list from Mock data
- [X] T031 Add inquiry status filtering (Mock) to `components/customer-service/hooks/useMockInquiries.ts`
- [X] T032 Add inquiry sorting (latest first, Mock) to `components/customer-service/hooks/useMockInquiries.ts`

#### 1.3 문의 내역 페이지

- [X] T033 Create `app/(tabs)/customer-service.tsx` with inquiry list rendering (using Mock data)
- [X] T034 Add new inquiry start button display to `app/(tabs)/customer-service.tsx`
- [X] T035 Add navigation to chat room on inquiry selection in `app/(tabs)/customer-service.tsx`
- [X] T036 Add empty state UI when no inquiries exist in `app/(tabs)/customer-service.tsx`

#### 1.4 채팅창 진입 로직 (Mock)

- [X] T037 Add navigation to `app/(tabs)/customer-service/[inquiryId].tsx` on inquiry selection
- [X] T038 Add new inquiry creation and chat room entry logic (Mock) to `app/(tabs)/customer-service.tsx`

---

## Phase 2: 채팅 UI 구현 (UI 우선)

**Goal**: 네이버 톡톡 스타일의 채팅 인터페이스 구현 (Mock 데이터 사용)

**Duration**: 10-14일

**Independent Test**: 채팅 UI가 네이버 톡톡 스타일로 구현되고, 메시지 리스트가 Mock 데이터로 정상적으로 표시되며, 메시지 전송 UI가 구현되고, 키보드가 올라올 때 자동 스크롤이 동작함

### Tasks for Phase 2

#### 2.1 Mock 데이터 훅

- [ ] T039 Create `components/customer-service/hooks/useMockMessages.ts` to return chat message list from Mock data
- [ ] T040 Add inquiryId filtering (Mock) to `components/customer-service/hooks/useMockMessages.ts`
- [ ] T041 Add message sorting (chronological order) to `components/customer-service/hooks/useMockMessages.ts`

#### 2.2 채팅 메시지 리스트 컴포넌트

- [ ] T042 [P] Create `components/customer-service/components/chat-message-list/` directory
- [ ] T043 Create `components/customer-service/components/chat-message-list/index.tsx` as message list container
- [ ] T044 [P] Create `components/customer-service/components/chat-message-list/message-bubble.tsx` with user/admin message bubble distinction
- [ ] T045 [P] Create `components/customer-service/components/chat-message-list/message-time.tsx` for message time display
- [ ] T046 [P] Create `components/customer-service/components/chat-message-list/message-status.tsx` for message send status display (sending, sent, failed)
- [ ] T047 Create `components/customer-service/components/chat-message-list/types.ts` with Props types
- [ ] T048 Create `components/customer-service/components/chat-message-list/styles.ts` with StyleSheet definitions

#### 2.3 채팅 입력창 컴포넌트

- [ ] T049 [P] Create `components/customer-service/components/chat-input/` directory
- [ ] T050 Create `components/customer-service/components/chat-input/index.tsx` as chat input container
- [ ] T051 [P] Create `components/customer-service/components/chat-input/text-input.tsx` for text input field
- [ ] T052 [P] Create `components/customer-service/components/chat-input/send-button.tsx` for send button
- [ ] T053 [P] Create `components/customer-service/components/chat-input/attachment-button.tsx` for attachment file button (optional)
- [ ] T054 Create `components/customer-service/components/chat-input/types.ts` with Props types
- [ ] T055 Create `components/customer-service/components/chat-input/styles.ts` with StyleSheet definitions

#### 2.4 채팅 헤더 컴포넌트

- [ ] T056 [P] Create `components/customer-service/components/chat-header/` directory
- [ ] T057 Create `components/customer-service/components/chat-header/index.tsx` for chat header (admin info, connection status)
- [ ] T058 [P] Create `components/customer-service/components/chat-header/connection-status.tsx` for connection status display
- [ ] T059 Create `components/customer-service/components/chat-header/types.ts` with Props types
- [ ] T060 Create `components/customer-service/components/chat-header/styles.ts` with StyleSheet definitions

#### 2.5 채팅 페이지 통합

- [ ] T061 [P] Create `components/customer-service/components/chat-room/` directory
- [ ] T062 Create `components/customer-service/components/chat-room/index.tsx` as chat room full layout
- [ ] T063 Add KeyboardAvoidingView or react-native-keyboard-aware-scroll-view to `components/customer-service/components/chat-room/index.tsx`
- [ ] T064 Integrate message list, input, and header (using Mock data) in `components/customer-service/components/chat-room/index.tsx`
- [ ] T065 Create `app/(tabs)/customer-service/[inquiryId].tsx` to render chat room Feature Container
- [ ] T066 Add inquiryId parameter to load inquiry info from Mock data in `app/(tabs)/customer-service/[inquiryId].tsx`

#### 2.6 키보드 및 스크롤 처리

- [ ] T067 Implement auto-scroll when keyboard appears in `components/customer-service/components/chat-room/index.tsx`
- [ ] T068 Implement auto-scroll when new message arrives (Mock) in `components/customer-service/components/chat-room/index.tsx`
- [ ] T069 Add trigger for loading past messages based on scroll position in `components/customer-service/components/chat-room/index.tsx`

#### 2.7 애니메이션 구현

- [ ] T070 Add message animation using react-native-reanimated in `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [ ] T071 Add message send animation in `components/customer-service/components/chat-input/send-button.tsx`
- [ ] T072 Add loading indicator animation in `components/customer-service/components/chat-message-list/index.tsx`

---

## Phase 3: 파일 첨부 기능 구현 (UI 우선)

**Goal**: 이미지 및 파일 첨부 기능 UI 구현 (Mock 데이터 사용)

**Duration**: 5-7일

**Independent Test**: 이미지 선택 및 전송 UI가 정상 동작하고, 파일 선택 및 전송 UI가 정상 동작하며, 파일 미리보기가 정상 표시됨

### Tasks for Phase 3

#### 3.1 파일 선택 컴포넌트

- [ ] T073 [P] Create `components/customer-service/components/file-picker/` directory
- [ ] T074 Create `components/customer-service/components/file-picker/index.tsx` as file picker component
- [ ] T075 [P] Create `components/customer-service/components/file-picker/image-picker.tsx` for image selection using expo-image-picker
- [ ] T076 [P] Create `components/customer-service/components/file-picker/document-picker.tsx` for file selection using expo-document-picker
- [ ] T077 Create `components/customer-service/components/file-picker/types.ts` with Props types
- [ ] T078 Create `components/customer-service/components/file-picker/styles.ts` with StyleSheet definitions

#### 3.2 파일 미리보기 컴포넌트

- [ ] T079 [P] Create `components/customer-service/components/file-preview/` directory
- [ ] T080 Create `components/customer-service/components/file-preview/index.tsx` as file preview container
- [ ] T081 [P] Create `components/customer-service/components/file-preview/image-preview.tsx` for image preview
- [ ] T082 [P] Create `components/customer-service/components/file-preview/file-preview.tsx` for file preview (filename, size)
- [ ] T083 Create `components/customer-service/components/file-preview/types.ts` with Props types
- [ ] T084 Create `components/customer-service/components/file-preview/styles.ts` with StyleSheet definitions

#### 3.3 파일 업로드 처리 (Mock)

- [ ] T085 Create `components/customer-service/hooks/useMockFileUpload.ts` for file upload hook (Mock)
- [ ] T086 Add file size validation to `components/customer-service/hooks/useMockFileUpload.ts`
- [ ] T087 Add file type validation to `components/customer-service/hooks/useMockFileUpload.ts`
- [ ] T088 Add upload progress state management (Mock) to `components/customer-service/hooks/useMockFileUpload.ts`
- [ ] T089 Add Mock message addition after upload completion to `components/customer-service/hooks/useMockFileUpload.ts`

#### 3.4 채팅 메시지에 파일 표시

- [ ] T090 Add image message display to `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [ ] T091 Add file message display to `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [ ] T092 Add file download functionality (optional) to `components/customer-service/components/chat-message-list/message-bubble.tsx`

---

## Phase 4: 채팅 상태 관리 및 최적화 (UI 우선)

**Goal**: 채팅 상태 관리 및 성능 최적화

**Duration**: 3-5일

**Independent Test**: 읽지 않은 메시지 개수가 Mock 데이터로 정확히 표시되고, 메시지 전송 상태가 정확히 표시되며, 연결 상태가 정확히 표시되고, 성능이 최적화됨

### Tasks for Phase 4

#### 4.1 읽지 않은 메시지 관리 (Mock)

- [ ] T093 Add unread message count management (Mock data based) to `components/customer-service/hooks/useMockMessages.ts`
- [ ] T094 Add message read processing logic (Mock) to `components/customer-service/hooks/useMockMessages.ts`
- [ ] T095 Add read status display to `components/customer-service/components/inquiry-list/inquiry-item.tsx`

#### 4.2 메시지 전송 상태 관리 (Mock)

- [ ] T096 Add sending status display to `components/customer-service/components/chat-message-list/message-status.tsx`
- [ ] T097 Add retry functionality on send failure (Mock) to `components/customer-service/components/chat-input/send-button.tsx`
- [ ] T098 Add send failure message display to `components/customer-service/components/chat-message-list/message-status.tsx`

#### 4.3 연결 상태 관리 (Mock)

- [ ] T099 Add connection status display (connected/disconnected, Mock) to `components/customer-service/components/chat-header/connection-status.tsx`
- [ ] T100 Add auto-reconnect UI on disconnection (Mock) to `components/customer-service/components/chat-header/connection-status.tsx`
- [ ] T101 Add UI feedback based on connection status to `components/customer-service/components/chat-header/index.tsx`

#### 4.4 성능 최적화

- [ ] T102 Optimize message list with FlatList virtualization in `components/customer-service/components/chat-message-list/index.tsx`
- [ ] T103 Add message memoization (React.memo) to `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [ ] T104 Minimize unnecessary re-renders in `components/customer-service/components/chat-room/index.tsx`
- [ ] T105 Add image optimization (caching, resizing) to `components/customer-service/components/file-preview/image-preview.tsx`

#### 4.5 문의 상태 업데이트 (Mock)

- [ ] T106 Add inquiry status change handling (Mock, is_resolved, status) to `components/customer-service/hooks/useMockInquiries.ts`
- [ ] T107 Add UI display based on inquiry status to `components/customer-service/components/inquiry-list/inquiry-item.tsx`

---

## Phase 5: API 연동 및 WebSocket 구현

**Goal**: Mock 데이터를 실제 API 및 WebSocket으로 교체

**Duration**: 7-10일

**Independent Test**: WebSocket 연결이 정상적으로 동작하고, 메시지 전송이 실제 API로 정상 동작하며, 메시지 수신이 WebSocket으로 정상 동작함

### Tasks for Phase 5

#### 5.1 WebSocket 연결 훅

- [ ] T108 Create `components/customer-service/hooks/useSocket.ts` for WebSocket connection management
- [ ] T109 Add connection state management (useState) to `components/customer-service/hooks/useSocket.ts`
- [ ] T110 Add auto-reconnect logic to `components/customer-service/hooks/useSocket.ts`
- [ ] T111 Add connection cleanup handling to `components/customer-service/hooks/useSocket.ts`
- [ ] T112 Add error handling to `components/customer-service/hooks/useSocket.ts`

#### 5.2 메시지 송수신 훅

- [ ] T113 Create `components/customer-service/hooks/useChatMessages.ts` for message list state management (useState or useReducer)
- [ ] T114 Add message send function (actual API call) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T115 Add message receive event handler (WebSocket) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T116 Add message status update (sending, sent, failed) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T117 Add message read processing to `components/customer-service/hooks/useChatMessages.ts`

#### 5.3 문의 내역 조회 훅 (실제 API)

- [ ] T118 Create `components/customer-service/hooks/useInquiries.ts` with useQuery for inquiry list retrieval
- [ ] T119 Add inquiry status filtering to `components/customer-service/hooks/useInquiries.ts`
- [ ] T120 Add inquiry sorting (latest first) to `components/customer-service/hooks/useInquiries.ts`
- [ ] T121 Replace Mock data hook with actual API in `app/(tabs)/customer-service.tsx`

#### 5.4 채팅 내역 조회 훅 (실제 API)

- [ ] T122 Create `components/customer-service/hooks/useChatHistory.ts` with useInfiniteQuery for chat history retrieval (filtered by inquiry_id)
- [ ] T123 Add infinite scroll for loading past messages to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T124 Add merge logic for WebSocket messages and API retrieved messages to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T125 Replace Mock data hook with actual API in `app/(tabs)/customer-service/[inquiryId].tsx`

#### 5.5 API 엔드포인트 정의

- [ ] T126 Add CUSTOMER_SERVICE endpoints object to `commons/constants/endpoints.ts` with INQUIRIES, INQUIRY_DETAIL, INQUIRY_CREATE, MESSAGES, MESSAGE_SEND, FILE_UPLOAD

#### 5.6 WebSocket 라이브러리 설치 및 설정

- [ ] T127 Install WebSocket library (socket.io-client or native WebSocket API) based on backend decision
- [ ] T128 Create WebSocket connection utility in `components/customer-service/utils/socket.ts` or `hooks/useSocket.ts`
- [ ] T129 Add connection management, reconnect logic, and event handlers to WebSocket utility

---

## Phase 6: 통합 및 마무리

**Goal**: 고객센터 페이지 통합 및 마이페이지 연결

**Duration**: 3-5일

**Independent Test**: 고객센터 페이지가 완성되고, 마이페이지에서 고객센터로 이동 가능하며, 모든 기능이 정상 동작함

### Tasks for Phase 6

#### 6.1 Feature Container 완성

- [ ] T130 Complete `components/customer-service/components/inquiry-list/index.tsx` with inquiry list rendering
- [ ] T131 Add final layout adjustments to `components/customer-service/components/inquiry-list/index.tsx`
- [ ] T132 Add error boundary to `components/customer-service/components/inquiry-list/index.tsx`
- [ ] T133 Complete `components/customer-service/components/chat-room/index.tsx` with chat room rendering
- [ ] T134 Add final layout adjustments to `components/customer-service/components/chat-room/index.tsx`
- [ ] T135 Add error boundary to `components/customer-service/components/chat-room/index.tsx`

#### 6.2 라우트 설정

- [ ] T136 Ensure `app/(tabs)/customer-service.tsx` renders inquiry list Feature Container
- [ ] T137 Ensure `app/(tabs)/customer-service/[inquiryId].tsx` renders chat room Feature Container

#### 6.3 마이페이지 메뉴 연결

- [ ] T138 Modify `components/mypage/components/menu-list/index.tsx` to add onPress handler to "고객 센터" menu item
- [ ] T139 Add navigation to customer service page in `components/mypage/components/menu-list/index.tsx`

#### 6.4 백그라운드 처리

- [ ] T140 Add WebSocket connection management when app goes to background in `components/customer-service/hooks/useSocket.ts`
- [ ] T141 Add auto-reconnect on foreground return in `components/customer-service/hooks/useSocket.ts`
- [ ] T142 Add push notification integration for new message arrival (optional) in `components/customer-service/hooks/useChatMessages.ts`

---

## Completion Criteria

### Phase 0
- [x] 폴더 구조가 생성됨
- [x] 타입 정의가 완료됨
- [x] Mock 데이터가 준비됨
- [x] 라우트 상수가 추가됨

### Phase 1
- [x] 문의 내역 리스트가 Mock 데이터로 정상적으로 표시됨
- [x] 문의 선택 시 채팅창으로 이동함
- [x] 새 문의 시작이 정상 동작함 (Mock)
- [x] 문의 상태가 적절히 표시됨

### Phase 2
- [x] 채팅 UI가 네이버 톡톡 스타일로 구현됨
- [x] 메시지 리스트가 Mock 데이터로 정상적으로 표시됨
- [x] 메시지 전송 UI가 구현됨 (실제 전송은 Mock)
- [x] 키보드가 올라올 때 자동 스크롤이 동작함
- [x] 새 메시지 도착 시 자동 스크롤이 동작함 (Mock)
- [x] 애니메이션이 부드럽게 동작함

### Phase 3
- [x] 이미지 선택 및 전송 UI가 정상 동작함 (Mock)
- [x] 파일 선택 및 전송 UI가 정상 동작함 (Mock, 구현한 경우)
- [x] 파일 미리보기가 정상 표시됨
- [x] 파일 크기 및 형식 제한이 동작함
- [x] 업로드 진행 상태가 표시됨 (Mock)

### Phase 4
- [x] 읽지 않은 메시지 개수가 Mock 데이터로 정확히 표시됨
- [x] 메시지 전송 상태가 정확히 표시됨 (Mock)
- [x] 연결 상태가 정확히 표시됨 (Mock)
- [x] 성능이 최적화됨 (스크롤이 부드러움)
- [x] 재연결 UI가 정상 동작함 (Mock)

### Phase 5
- [x] WebSocket 연결이 정상적으로 동작함
- [x] 메시지 전송이 실제 API로 정상 동작함
- [x] 메시지 수신이 WebSocket으로 정상 동작함
- [x] 자동 재연결이 동작함
- [x] 채팅 내역 조회가 실제 API로 정상 동작함
- [x] Mock 데이터가 실제 API로 교체됨

### Phase 6
- [x] 고객센터 페이지가 완성됨
- [x] 마이페이지에서 고객센터로 이동 가능함
- [x] 모든 기능이 정상 동작함
- [x] 백그라운드/포그라운드 전환이 정상 동작함

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 0**: No dependencies - Can start immediately
- **Phase 1**: Depends on Phase 0 (folder structure, types, Mock data)
- **Phase 2**: Depends on Phase 1 (inquiry list navigation)
- **Phase 3**: Depends on Phase 2 (chat UI foundation)
- **Phase 4**: Depends on Phase 2 (chat UI foundation)
- **Phase 5**: Depends on Phase 1-4 (all UI components)
- **Phase 6**: Depends on Phase 5 (API integration)

### Parallel Execution Opportunities

#### Phase 0
- **T001-T004**: 폴더 구조 생성은 병렬 가능
- **T011-T015**: Mock 데이터 생성은 병렬 가능

#### Phase 1
- **T020-T029**: 컴포넌트 생성은 일부 병렬 가능 (다른 파일)
- **T022-T027**: inquiry-item의 각 기능은 순차 (같은 파일)

#### Phase 2
- **T042-T048**: 채팅 메시지 리스트 컴포넌트는 일부 병렬 가능
- **T049-T055**: 채팅 입력창 컴포넌트는 일부 병렬 가능
- **T056-T060**: 채팅 헤더 컴포넌트는 일부 병렬 가능

#### Phase 3
- **T073-T078**: 파일 선택 컴포넌트는 일부 병렬 가능
- **T079-T084**: 파일 미리보기 컴포넌트는 일부 병렬 가능

#### Phase 5
- **T108-T112**: WebSocket 훅은 순차 (같은 파일)
- **T113-T117**: 메시지 송수신 훅은 순차 (같은 파일)
- **T118-T121**: 문의 내역 조회 훅은 순차 (같은 파일)
- **T122-T125**: 채팅 내역 조회 훅은 순차 (같은 파일)

### Suggested Execution Order

1. **Phase 0**: Setup (T001-T019)
   - Step 1: 폴더 구조 생성 (T001-T004, 병렬)
   - Step 2: 타입 정의 (T005-T010, 순차)
   - Step 3: Mock 데이터 생성 (T011-T015, 병렬)
   - Step 4: 라우트 상수 추가 (T016-T017, 순차)
   - Step 5: 기본 스타일 파일 생성 (T018-T019, 순차)

2. **Phase 1**: Inquiry List UI (T020-T038)
   - Step 1: 컴포넌트 구조 생성 (T020-T029)
   - Step 2: Mock 데이터 훅 (T030-T032)
   - Step 3: 페이지 및 네비게이션 (T033-T038)

3. **Phase 2**: Chat UI (T039-T072)
   - Step 1: Mock 데이터 훅 (T039-T041)
   - Step 2: 메시지 리스트 컴포넌트 (T042-T048)
   - Step 3: 입력창 컴포넌트 (T049-T055)
   - Step 4: 헤더 컴포넌트 (T056-T060)
   - Step 5: 채팅 페이지 통합 (T061-T066)
   - Step 6: 키보드 및 스크롤 처리 (T067-T069)
   - Step 7: 애니메이션 (T070-T072)

4. **Phase 3**: File Attachment (T073-T092)
   - Step 1: 파일 선택 컴포넌트 (T073-T078)
   - Step 2: 파일 미리보기 컴포넌트 (T079-T084)
   - Step 3: 파일 업로드 처리 (T085-T089)
   - Step 4: 메시지에 파일 표시 (T090-T092)

5. **Phase 4**: State Management & Optimization (T093-T107)
   - Step 1: 읽지 않은 메시지 관리 (T093-T095)
   - Step 2: 메시지 전송 상태 관리 (T096-T098)
   - Step 3: 연결 상태 관리 (T099-T101)
   - Step 4: 성능 최적화 (T102-T105)
   - Step 5: 문의 상태 업데이트 (T106-T107)

6. **Phase 5**: API & WebSocket Integration (T108-T129)
   - Step 1: WebSocket 연결 훅 (T108-T112)
   - Step 2: 메시지 송수신 훅 (T113-T117)
   - Step 3: 문의 내역 조회 훅 (T118-T121)
   - Step 4: 채팅 내역 조회 훅 (T122-T125)
   - Step 5: API 엔드포인트 정의 (T126)
   - Step 6: WebSocket 라이브러리 설치 및 설정 (T127-T129)

7. **Phase 6**: Integration & Polish (T130-T142)
   - Step 1: Feature Container 완성 (T130-T135)
   - Step 2: 라우트 설정 (T136-T137)
   - Step 3: 마이페이지 메뉴 연결 (T138-T139)
   - Step 4: 백그라운드 처리 (T140-T142)

---

## Implementation Strategy

### MVP Scope
**Phase 0 + Phase 1 + Phase 2 (Basic Chat UI)**: 기본적인 문의 내역 리스트와 채팅 UI를 Mock 데이터로 구현하여 사용자 경험을 검증합니다.

### Incremental Delivery
- **Increment 1**: Phase 0 (Setup) - 기반 구조
- **Increment 2**: Phase 1 (Inquiry List) - 문의 내역 리스트
- **Increment 3**: Phase 2 (Chat UI) - 기본 채팅 UI
- **Increment 4**: Phase 3 (File Attachment) - 파일 첨부 기능
- **Increment 5**: Phase 4 (State Management) - 상태 관리 및 최적화
- **Increment 6**: Phase 5 (API Integration) - 실제 API 연동
- **Increment 7**: Phase 6 (Integration) - 통합 및 마무리

### Risk Mitigation
- **UI First Approach**: Mock 데이터로 먼저 UI를 완성하여 사용자 경험을 검증한 후 API 연동
- **Incremental Integration**: Phase별로 독립적으로 테스트 가능하도록 구성
- **Error Handling**: 각 Phase에서 에러 처리 및 바운더리 추가

---

## Notes

- 모든 작업은 Feature-Sliced Architecture 패턴을 따라야 합니다
- 타입 정의는 데이터베이스 스키마를 반영해야 합니다
- Mock 데이터는 실제 사용 시나리오를 반영해야 합니다
- 라우트 상수는 기존 패턴을 따라야 합니다
- 스타일은 모두 `styles.ts`에서 관리하며 인라인 스타일은 금지됩니다
- 디자인 토큰은 `commons/constants`에서 import하여 사용합니다
- WebSocket 라이브러리는 백엔드와 협의 후 결정합니다

---

## Summary

**Total Tasks**: 142 tasks across 7 phases

**Phase Breakdown**:
- Phase 0: 19 tasks (Setup)
- Phase 1: 19 tasks (Inquiry List UI)
- Phase 2: 34 tasks (Chat UI)
- Phase 3: 20 tasks (File Attachment)
- Phase 4: 15 tasks (State Management)
- Phase 5: 22 tasks (API Integration)
- Phase 6: 13 tasks (Integration)

**Estimated Duration**: 35-51 days

**Parallel Opportunities**: Multiple tasks can be executed in parallel within each phase, especially component creation tasks that work on different files.
