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

#### 0.6 API 응답 변환 유틸리티 생성

- [X] T020 Create `components/customer-service/utils/transformers.ts` for API response format conversion
- [X] T021 Add camelCase to snake_case conversion function for Inquiry type to `components/customer-service/utils/transformers.ts`
- [X] T022 Add camelCase to snake_case conversion function for Message type to `components/customer-service/utils/transformers.ts`

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

- [X] T039 Create `components/customer-service/hooks/useMockMessages.ts` to return chat message list from Mock data
- [X] T040 Add inquiryId filtering (Mock) to `components/customer-service/hooks/useMockMessages.ts`
- [X] T041 Add message sorting (chronological order) to `components/customer-service/hooks/useMockMessages.ts`

#### 2.2 채팅 메시지 리스트 컴포넌트

- [X] T042 [P] Create `components/customer-service/components/chat-message-list/` directory
- [X] T043 Create `components/customer-service/components/chat-message-list/index.tsx` as message list container
- [X] T044 [P] Create `components/customer-service/components/chat-message-list/message-bubble.tsx` with user/admin message bubble distinction
- [X] T045 [P] Create `components/customer-service/components/chat-message-list/message-time.tsx` for message time display
- [X] T046 [P] Create `components/customer-service/components/chat-message-list/message-status.tsx` for message send status display (sending, sent, failed)
- [X] T047 Create `components/customer-service/components/chat-message-list/types.ts` with Props types
- [X] T048 Create `components/customer-service/components/chat-message-list/styles.ts` with StyleSheet definitions

#### 2.3 채팅 입력창 컴포넌트

- [X] T049 [P] Create `components/customer-service/components/chat-input/` directory
- [X] T050 Create `components/customer-service/components/chat-input/index.tsx` as chat input container
- [X] T051 [P] Create `components/customer-service/components/chat-input/text-input.tsx` for text input field
- [X] T052 [P] Create `components/customer-service/components/chat-input/send-button.tsx` for send button
- [X] T053 [P] Create `components/customer-service/components/chat-input/attachment-button.tsx` for attachment file button (optional)
- [X] T054 Create `components/customer-service/components/chat-input/types.ts` with Props types
- [X] T055 Create `components/customer-service/components/chat-input/styles.ts` with StyleSheet definitions

#### 2.4 채팅 헤더 컴포넌트

- [X] T056 [P] Create `components/customer-service/components/chat-header/` directory
- [X] T057 Create `components/customer-service/components/chat-header/index.tsx` for chat header (admin info, connection status)
- [X] T058 [P] Create `components/customer-service/components/chat-header/connection-status.tsx` for connection status display
- [X] T059 Create `components/customer-service/components/chat-header/types.ts` with Props types
- [X] T060 Create `components/customer-service/components/chat-header/styles.ts` with StyleSheet definitions

#### 2.5 채팅 페이지 통합

- [X] T061 [P] Create `components/customer-service/components/chat-room/` directory
- [X] T062 Create `components/customer-service/components/chat-room/index.tsx` as chat room full layout
- [X] T063 Add KeyboardAvoidingView or react-native-keyboard-aware-scroll-view to `components/customer-service/components/chat-room/index.tsx`
- [X] T064 Integrate message list, input, and header (using Mock data) in `components/customer-service/components/chat-room/index.tsx`
- [X] T065 Create `app/(tabs)/customer-service/[inquiryId].tsx` to render chat room Feature Container
- [X] T066 Add inquiryId parameter to load inquiry info from Mock data in `app/(tabs)/customer-service/[inquiryId].tsx`

#### 2.6 키보드 및 스크롤 처리

- [X] T067 Implement auto-scroll when keyboard appears in `components/customer-service/components/chat-room/index.tsx`
- [X] T068 Implement auto-scroll when new message arrives (Mock) in `components/customer-service/components/chat-room/index.tsx`
- [X] T069 Add trigger for loading past messages based on scroll position in `components/customer-service/components/chat-room/index.tsx`

#### 2.7 애니메이션 구현

- [X] T070 Add message animation using react-native-reanimated in `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [X] T071 Add message send animation in `components/customer-service/components/chat-input/send-button.tsx`
- [X] T072 Add loading indicator animation in `components/customer-service/components/chat-message-list/index.tsx`

---

## Phase 3: Edge Cases 및 에러 처리 구현 (UI 우선)

**Goal**: 예외 상황 및 에러 처리 로직 구현 (Mock 데이터 사용)

**Duration**: 5-7일

**Independent Test**: 모든 Edge Cases가 정상적으로 처리되고, 에러 메시지가 명확하게 표시되며, 자동 재연결이 정상 동작함

**Note**: 파일 첨부 기능은 이미 구현되어 있으나, Out of Scope로 별도 기능으로 구현 예정입니다.

### Tasks for Phase 3

#### 3.1 WebSocket 연결 실패 처리 (EC-001)

- [ ] T073 Add connection failure user notification display to `components/customer-service/hooks/useSocket.ts`
- [ ] T074 Add auto-retry logic (max 3 attempts) to `components/customer-service/hooks/useSocket.ts`
- [ ] T075 Add automatic navigation to inquiry list page after 3 failed retries to `components/customer-service/hooks/useSocket.ts`
- [ ] T076 Add toast message "연결에 실패했습니다. 잠시 후 다시 시도해주세요." after 3 failed retries in `components/customer-service/hooks/useSocket.ts`

#### 3.2 네트워크 불안정 처리 (EC-002)

- [ ] T077 Add network instability detection logic to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T078 Add offline mode transition to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T079 Add failed message local queue storage to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T080 Add automatic retry 3 seconds after network recovery to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T081 Add user notification and manual retry option on retry failure to `components/customer-service/hooks/useChatMessages.ts`

#### 3.3 여러 기기 동시 접속 처리 (EC-003)

- [ ] T082 Add last accessed device activation logic to `components/customer-service/hooks/useSocket.ts`
- [ ] T083 Add inactive device read-only mode transition to `components/customer-service/hooks/useSocket.ts`
- [ ] T084 Add "다른 기기에서 채팅 중입니다" guide message display to `components/customer-service/components/chat-room/index.tsx`
- [ ] T085 Add automatic mode transition on active device change to `components/customer-service/hooks/useSocket.ts`

#### 3.4 방 입장 전 메시지 전송 차단 (EC-004)

- [ ] T086 Add room non-entry state detection to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T087 Add send button disable or error message display to `components/customer-service/components/chat-input/send-button.tsx`
- [ ] T088 Add "먼저 채팅방에 입장해주세요" error message to `components/customer-service/components/chat-input/index.tsx`

#### 3.5 roomId 생성 실패 처리 (EC-005)

- [ ] T089 Add roomId creation failure detection to `components/customer-service/hooks/useSocket.ts`
- [ ] T090 Add WebSocket connection blocking on roomId creation failure to `components/customer-service/hooks/useSocket.ts`
- [ ] T091 Add "채팅방 생성에 실패했습니다" error message display to `components/customer-service/hooks/useSocket.ts`
- [ ] T092 Add automatic navigation to inquiry list page and toast message "채팅방을 생성할 수 없습니다. 잠시 후 다시 시도해주세요." to `components/customer-service/hooks/useSocket.ts`

#### 3.6 읽음 처리 중복 방지 (EC-006)

- [ ] T093 Add `read_alert` event debounce processing (500ms) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T094 Add ignore duplicate notifications for already read messages to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T095 Add client-side double defense logic to `components/customer-service/hooks/useChatMessages.ts`

#### 3.7 메시지 중복 병합 처리 (EC-007)

- [ ] T096 Add HTTP API and WebSocket message merge logic to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T097 Add message ID-based duplicate removal to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T098 Add timestamp comparison for latest message priority reflection to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T099 Add WebSocket message priority reflection logic to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T100 Add chronological sorting display to `components/customer-service/components/chat-message-list/index.tsx`

---

## Phase 4: 채팅 상태 관리 및 최적화 (UI 우선)

**Goal**: 채팅 상태 관리 및 성능 최적화

**Duration**: 3-5일

**Independent Test**: 읽지 않은 메시지 개수가 Mock 데이터로 정확히 표시되고, 메시지 전송 상태가 정확히 표시되며, 연결 상태가 정확히 표시되고, 성능이 최적화됨

### Tasks for Phase 4

#### 4.1 읽지 않은 메시지 관리 (Mock)

- [X] T093 Add unread message count management (Mock data based) to `components/customer-service/hooks/useMockMessages.ts`
- [X] T094 Add message read processing logic (Mock) to `components/customer-service/hooks/useMockMessages.ts`
- [X] T095 Add read status display to `components/customer-service/components/inquiry-list/inquiry-item.tsx`

#### 4.2 메시지 전송 상태 관리 (Mock)

- [X] T096 Add sending status display to `components/customer-service/components/chat-message-list/message-status.tsx`
- [X] T097 Add retry functionality on send failure (Mock) to `components/customer-service/components/chat-input/send-button.tsx`
- [X] T098 Add send failure message display to `components/customer-service/components/chat-message-list/message-status.tsx`

#### 4.3 연결 상태 관리 (Mock)

- [X] T099 Add connection status display (connected/disconnected, Mock) to `components/customer-service/components/chat-header/connection-status.tsx`
- [X] T100 Add auto-reconnect UI on disconnection (Mock) to `components/customer-service/components/chat-header/connection-status.tsx`
- [X] T101 Add UI feedback based on connection status to `components/customer-service/components/chat-header/index.tsx`

#### 4.4 성능 최적화

- [X] T102 Optimize message list with FlatList virtualization in `components/customer-service/components/chat-message-list/index.tsx`
- [X] T103 Add message memoization (React.memo) to `components/customer-service/components/chat-message-list/message-bubble.tsx`
- [X] T104 Minimize unnecessary re-renders in `components/customer-service/components/chat-room/index.tsx`
- [X] T105 Add image optimization (caching, resizing) to `components/customer-service/components/file-preview/image-preview.tsx`

#### 4.5 문의 상태 업데이트 (Mock)

- [X] T106 Add inquiry status change handling (Mock, is_resolved, status) to `components/customer-service/hooks/useMockInquiries.ts`
- [X] T107 Add UI display based on inquiry status to `components/customer-service/components/inquiry-list/inquiry-item.tsx`

---

## Phase 5: API 연동 및 WebSocket 구현

**Goal**: Mock 데이터를 실제 API 및 WebSocket으로 교체

**Duration**: 7-10일

**Independent Test**: WebSocket 연결이 정상적으로 동작하고, 메시지 전송이 실제 API로 정상 동작하며, 메시지 수신이 WebSocket으로 정상 동작함

### Tasks for Phase 5

#### 5.1 WebSocket 연결 훅

- [ ] T108 Create `components/customer-service/hooks/useSocket.ts` for Socket.IO client connection management
- [ ] T109 Add Socket.IO client connection to `/user-chat` namespace to `components/customer-service/hooks/useSocket.ts`
- [ ] T110 Add authentication token passing (`auth: { token }` or `Authorization: Bearer <token>`) to `components/customer-service/hooks/useSocket.ts`
- [ ] T111 Add connection state management (useState: connecting, connected, disconnected, error) to `components/customer-service/hooks/useSocket.ts`
- [ ] T112 Add auto-reconnect logic (max 3 attempts, EC-001) to `components/customer-service/hooks/useSocket.ts`
- [ ] T113 Add connection cleanup handling to `components/customer-service/hooks/useSocket.ts`
- [ ] T114 Add error handling to `components/customer-service/hooks/useSocket.ts`

#### 5.2 메시지 송수신 훅

- [ ] T115 Create `components/customer-service/hooks/useChatMessages.ts` for message list state management (useState or useReducer)
- [ ] T116 Add `join_room` event call (without roomId, server auto-creates/retrieves) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T117 Add roomId storage from `join_room` response to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T118 Add `send_message` event for message sending to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T119 Add `receive_message` event handler for real-time message receiving to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T120 Add `read_alert` event for read processing notification (500ms debounce, EC-006) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T121 Add `read_alert` event handler for receiving counterpart read status to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T122 Add message status update (sending, sent, failed) to `components/customer-service/hooks/useChatMessages.ts`
- [ ] T123 Add message send blocking before room entry (EC-004) to `components/customer-service/hooks/useChatMessages.ts`

#### 5.3 문의 내역 조회 훅 (실제 API)

- [ ] T124 Create `components/customer-service/hooks/useInquiries.ts` with useQuery for inquiry list retrieval (`GET /api/me/inquiries`)
- [ ] T125 Add API response format conversion (camelCase → snake_case) to `components/customer-service/hooks/useInquiries.ts`
- [ ] T126 Add pagination handling (total, limit, offset, hasNext) to `components/customer-service/hooks/useInquiries.ts`
- [ ] T127 Add inquiry status filtering to `components/customer-service/hooks/useInquiries.ts`
- [ ] T128 Add inquiry sorting (latest first) to `components/customer-service/hooks/useInquiries.ts`
- [ ] T129 Replace Mock data hook with actual API in `app/(tabs)/customer-service.tsx`

#### 5.4 채팅 내역 조회 훅 (실제 API)

- [ ] T130 Create `components/customer-service/hooks/useChatHistory.ts` with useInfiniteQuery for chat history retrieval (`GET /api/me/inquiries/{id}`)
- [ ] T131 Add API response format conversion (camelCase → snake_case) to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T132 Add pagination handling (total, limit, offset, hasNext) to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T133 Add infinite scroll for loading past messages to `components/customer-service/hooks/useChatHistory.ts`
- [ ] T134 Add merge logic for WebSocket messages and API retrieved messages (EC-007) to `components/customer-service/hooks/useChatHistory.ts`
  - Message ID-based duplicate removal
  - Timestamp comparison for latest message priority reflection
  - WebSocket message priority reflection
  - Chronological sorting
- [ ] T135 Replace Mock data hook with actual API in `app/(tabs)/customer-service/[inquiryId].tsx`

#### 5.5 API 엔드포인트 정의

- [ ] T136 Verify CUSTOMER_SERVICE endpoints in `commons/constants/endpoints.ts` (already defined, verify):
  - INQUIRIES: 'api/me/inquiries' (GET - inquiry list retrieval)
  - INQUIRY_DETAIL: 'api/me/inquiries/{id}' (GET - inquiry detail and chat history retrieval)
- [ ] T137 Add WebSocket connection configuration:
  - Socket.IO server URL configuration
  - Namespace: `/user-chat`
  - Authentication token passing method verification

#### 5.6 WebSocket 라이브러리 설치 및 설정

- [ ] T138 Install `socket.io-client` library (`npm install socket.io-client`)
- [ ] T139 Update `doc/v.1.0/package.md` documentation (follow external library introduction guide)
- [ ] T140 Create WebSocket connection utility in `components/customer-service/utils/socket.ts` or `hooks/useSocket.ts`
- [ ] T141 Add Socket.IO client instance creation to WebSocket utility
- [ ] T142 Add `/user-chat` namespace connection to WebSocket utility
- [ ] T143 Add authentication token passing to WebSocket utility
- [ ] T144 Add connection management, reconnect logic, and event handlers to WebSocket utility

---

## Phase 6: 통합 및 마무리

**Goal**: 고객센터 페이지 통합 및 마이페이지 연결

**Duration**: 3-5일

**Independent Test**: 고객센터 페이지가 완성되고, 마이페이지에서 고객센터로 이동 가능하며, 모든 기능이 정상 동작함

### Tasks for Phase 6

#### 6.1 Feature Container 완성

- [ ] T145 Complete `components/customer-service/components/inquiry-list/index.tsx` with inquiry list rendering
- [ ] T146 Add final layout adjustments to `components/customer-service/components/inquiry-list/index.tsx`
- [ ] T147 Add error boundary to `components/customer-service/components/inquiry-list/index.tsx`
- [ ] T148 Complete `components/customer-service/components/chat-room/index.tsx` with chat room rendering
- [ ] T149 Add final layout adjustments to `components/customer-service/components/chat-room/index.tsx`
- [ ] T150 Add error boundary to `components/customer-service/components/chat-room/index.tsx`

#### 6.2 라우트 설정

- [ ] T151 Ensure `app/(tabs)/customer-service.tsx` renders inquiry list Feature Container
- [ ] T152 Ensure `app/(tabs)/customer-service/[inquiryId].tsx` renders chat room Feature Container

#### 6.3 마이페이지 메뉴 연결

- [ ] T153 Modify `components/mypage/components/menu-list/index.tsx` to add onPress handler to "고객 센터" menu item
- [ ] T154 Add navigation to customer service page in `components/mypage/components/menu-list/index.tsx`

#### 6.4 백그라운드 처리

- [ ] T155 Add WebSocket connection management when app goes to background in `components/customer-service/hooks/useSocket.ts`
- [ ] T156 Add auto-reconnect on foreground return in `components/customer-service/hooks/useSocket.ts`
- [ ] T157 Add push notification integration for new message arrival (optional) in `components/customer-service/hooks/useChatMessages.ts`

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
- [ ] 모든 Edge Cases가 정상적으로 처리됨
- [ ] 에러 메시지가 명확하게 표시됨
- [ ] 자동 재연결이 정상 동작함
- [ ] 메시지 중복 병합이 정확히 동작함
- [ ] 여러 기기 동시 접속이 정상 처리됨

### Phase 4
- [X] 읽지 않은 메시지 개수가 Mock 데이터로 정확히 표시됨
- [X] 메시지 전송 상태가 정확히 표시됨 (Mock)
- [X] 연결 상태가 정확히 표시됨 (Mock)
- [X] 성능이 최적화됨 (스크롤이 부드러움)
- [X] 재연결 UI가 정상 동작함 (Mock)

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
- **Phase 3**: Depends on Phase 2 (chat UI foundation, Edge Cases handling)
- **Phase 4**: Depends on Phase 2 (chat UI foundation)
- **Phase 5**: Depends on Phase 1-4 (all UI components and Edge Cases handling)
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

1. **Phase 0**: Setup (T001-T022)
   - Step 1: 폴더 구조 생성 (T001-T004, 병렬)
   - Step 2: 타입 정의 (T005-T010, 순차)
   - Step 3: Mock 데이터 생성 (T011-T015, 병렬)
   - Step 4: 라우트 상수 추가 (T016-T017, 순차)
   - Step 5: 기본 스타일 파일 생성 (T018-T019, 순차)
   - Step 6: API 응답 변환 유틸리티 생성 (T020-T022, 순차)

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

4. **Phase 3**: Edge Cases & Error Handling (T073-T100)
   - Step 1: WebSocket 연결 실패 처리 (EC-001) (T073-T076)
   - Step 2: 네트워크 불안정 처리 (EC-002) (T077-T081)
   - Step 3: 여러 기기 동시 접속 처리 (EC-003) (T082-T085)
   - Step 4: 방 입장 전 메시지 전송 차단 (EC-004) (T086-T088)
   - Step 5: roomId 생성 실패 처리 (EC-005) (T089-T092)
   - Step 6: 읽음 처리 중복 방지 (EC-006) (T093-T095)
   - Step 7: 메시지 중복 병합 처리 (EC-007) (T096-T100)

5. **Phase 4**: State Management & Optimization (T093-T107)
   - Step 1: 읽지 않은 메시지 관리 (T093-T095)
   - Step 2: 메시지 전송 상태 관리 (T096-T098)
   - Step 3: 연결 상태 관리 (T099-T101)
   - Step 4: 성능 최적화 (T102-T105)
   - Step 5: 문의 상태 업데이트 (T106-T107)

6. **Phase 5**: API & WebSocket Integration (T108-T144)
   - Step 1: WebSocket 연결 훅 (T108-T114)
   - Step 2: 메시지 송수신 훅 (T115-T123)
   - Step 3: 문의 내역 조회 훅 (T124-T129)
   - Step 4: 채팅 내역 조회 훅 (T130-T135)
   - Step 5: API 엔드포인트 정의 및 WebSocket 설정 (T136-T137)
   - Step 6: WebSocket 라이브러리 설치 및 설정 (T138-T144)

7. **Phase 6**: Integration & Polish (T145-T157)
   - Step 1: Feature Container 완성 (T145-T150)
   - Step 2: 라우트 설정 (T151-T152)
   - Step 3: 마이페이지 메뉴 연결 (T153-T154)
   - Step 4: 백그라운드 처리 (T155-T157)

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
- WebSocket 라이브러리는 `socket.io-client`로 확정되었습니다
- 파일 첨부 기능은 Out of Scope로 별도 기능으로 구현 예정입니다

---

## Summary

**Total Tasks**: 167 tasks across 7 phases

**Phase Breakdown**:
- Phase 0: 22 tasks (Setup)
- Phase 1: 19 tasks (Inquiry List UI)
- Phase 2: 34 tasks (Chat UI)
- Phase 3: 28 tasks (Edge Cases & Error Handling)
- Phase 4: 15 tasks (State Management)
- Phase 5: 37 tasks (API Integration)
- Phase 6: 13 tasks (Integration)

**Estimated Duration**: 35-51 days

**Parallel Opportunities**: Multiple tasks can be executed in parallel within each phase, especially component creation tasks that work on different files.
