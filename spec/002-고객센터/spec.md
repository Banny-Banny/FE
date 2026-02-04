# Feature Specification: 고객센터 실시간 문의 채팅

**Feature Branch**: `002-customer-service`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "문의 채팅(Socket) 연동 가이드 - 유저 문의하기 + 어드민 문의하기 실시간 채팅"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 유저가 문의 목록을 조회하고 채팅방에 입장 (Priority: P1)

사용자는 자신의 문의 내역을 목록으로 확인하고, 기존 문의 채팅방에 입장하거나 새 문의를 시작할 수 있습니다.

**Why this priority**: 문의 채팅 기능의 기본 진입점으로, 사용자가 고객센터를 이용하기 위한 필수 기능입니다.

**Independent Test**: HTTP API로 문의 목록을 조회하고, 목록에서 문의를 선택하여 채팅방으로 이동할 수 있으며, 새 문의 시작 버튼으로 새 채팅방을 생성할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 사용자가 고객센터 페이지에 접근했을 때, **When** HTTP API로 문의 목록을 조회하면, **Then** 자신의 문의 내역이 목록으로 표시됩니다.
2. **Given** 문의 목록이 표시된 상태에서, **When** 기존 문의 항목을 선택하면, **Then** 해당 문의의 채팅방으로 이동합니다.
3. **Given** 문의 목록이 표시된 상태에서, **When** 새 문의 시작 버튼을 클릭하면, **Then** 새 채팅방이 생성되고 채팅 화면으로 이동합니다.
4. **Given** 문의 목록이 비어있는 상태에서, **When** 새 문의 시작 버튼을 클릭하면, **Then** 새 채팅방이 생성되고 채팅 화면으로 이동합니다.

---

### User Story 2 - 유저가 실시간으로 메시지를 송수신 (Priority: P1)

사용자는 WebSocket을 통해 관리자와 실시간으로 메시지를 주고받을 수 있습니다.

**Why this priority**: 실시간 채팅의 핵심 기능으로, 사용자가 문의를 하고 관리자의 답변을 받기 위한 필수 기능입니다.

**Independent Test**: WebSocket 연결 후 방에 입장하고, 메시지를 전송하고 수신할 수 있으며, 실시간으로 메시지가 동기화됩니다.

**Acceptance Scenarios**:

1. **Given** 채팅방에 입장한 상태에서, **When** WebSocket을 통해 `/user-chat` 네임스페이스에 연결하면, **Then** 연결이 성공하고 방에 입장합니다.
2. **Given** 방에 입장한 상태에서, **When** `join_room` 이벤트를 roomId 없이 호출하면, **Then** 서버가 자동으로 문의방을 생성/조회하고 roomId를 응답으로 받습니다.
3. **Given** 방에 입장한 상태에서, **When** `send_message` 이벤트로 메시지를 전송하면, **Then** 메시지가 서버에 저장되고 `receive_message` 이벤트로 브로드캐스트됩니다.
4. **Given** 다른 사용자(관리자)가 메시지를 전송했을 때, **When** WebSocket을 통해 `receive_message` 이벤트를 수신하면, **Then** 채팅 화면에 새 메시지가 실시간으로 표시됩니다.
5. **Given** 메시지를 읽은 상태에서, **When** `read_alert` 이벤트를 전송하면, **Then** 읽음 상태가 서버에 반영되고 상대방에게 알림이 전달됩니다.

---

### User Story 3 - 유저가 채팅 내역을 조회하고 과거 메시지를 확인 (Priority: P2)

사용자는 HTTP API를 통해 채팅 내역을 조회하고, 무한 스크롤로 과거 메시지를 확인할 수 있습니다.

**Why this priority**: 사용자가 이전 대화 내용을 확인하고 맥락을 파악하기 위한 기능으로, 실시간 채팅과 함께 사용자 경험을 완성합니다.

**Independent Test**: HTTP API로 채팅 내역을 조회하고, 스크롤을 통해 과거 메시지를 로드할 수 있으며, WebSocket으로 받은 실시간 메시지와 병합되어 표시됩니다.

**Acceptance Scenarios**:

1. **Given** 채팅방에 입장한 상태에서, **When** HTTP API로 채팅 내역을 조회하면, **Then** 최신 메시지부터 페이지네이션된 목록이 표시됩니다.
2. **Given** 채팅 내역이 표시된 상태에서, **When** 리스트를 위로 스크롤하면, **Then** 과거 메시지가 추가로 로드되어 표시됩니다.
3. **Given** HTTP API로 조회한 메시지와 WebSocket으로 받은 실시간 메시지가 있을 때, **When** 두 메시지 목록을 병합하면, **Then** 시간순으로 정렬되어 중복 없이 표시됩니다.

---

### User Story 4 - 연결 상태 관리 및 자동 재연결 (Priority: P2)

사용자는 WebSocket 연결 상태를 확인하고, 연결이 끊어졌을 때 자동으로 재연결할 수 있습니다.

**Why this priority**: 네트워크 불안정 상황에서도 안정적인 채팅 경험을 제공하기 위한 기능입니다.

**Independent Test**: 연결 상태가 UI에 표시되고, 연결이 끊어졌을 때 자동으로 재연결을 시도하며, 재연결 성공 시 이전 상태를 복구합니다.

**Acceptance Scenarios**:

1. **Given** WebSocket 연결 시도 중일 때, **When** 연결 상태를 확인하면, **Then** "연결 중" 상태가 UI에 표시됩니다.
2. **Given** WebSocket 연결이 성공했을 때, **When** 연결 상태를 확인하면, **Then** "연결됨" 상태가 UI에 표시됩니다.
3. **Given** WebSocket 연결이 끊어졌을 때, **When** 자동 재연결 로직이 실행되면, **Then** 일정 간격으로 재연결을 시도하고, 성공 시 이전 방에 다시 입장합니다.
4. **Given** 연결이 끊어진 상태에서, **When** 사용자가 메시지를 전송하려고 하면, **Then** 연결이 복구될 때까지 전송이 대기되거나 실패 메시지가 표시됩니다.

---

### Edge Cases

#### EC-001: WebSocket 연결 실패 처리

**시나리오**: WebSocket 연결이 실패했을 때

**처리 방식**:
- 연결 실패 시 사용자에게 알림을 표시합니다.
- 자동 재시도를 최대 3회까지 시도합니다.
- 3회 이상 재시도 실패 시 문의 목록 페이지로 자동 이동하고, 하단에 토스트 메시지를 표시합니다.
  - 토스트 메시지: "연결에 실패했습니다. 잠시 후 다시 시도해주세요."

**Acceptance Criteria**:
- 연결 실패 시 즉시 사용자 알림 표시
- 재시도 횟수 3회 제한
- 3회 실패 시 문의 목록으로 자동 이동 및 토스트 메시지 표시

---

#### EC-002: 네트워크 불안정 상태에서 메시지 전송 실패 처리

**시나리오**: 네트워크가 불안정한 상태에서 메시지 전송이 실패했을 때

**처리 방식**:
- 네트워크 불안정 감지 시 오프라인 모드로 전환합니다.
- 전송 실패한 메시지는 로컬 큐에 저장됩니다.
- 네트워크 복구 후 3초 뒤 자동으로 재시도합니다.
- 재시도 실패 시 사용자에게 알림을 표시하고 수동 재시도 옵션을 제공합니다.

**Acceptance Criteria**:
- 네트워크 불안정 감지 시 오프라인 모드 전환
- 실패한 메시지 로컬 큐 저장
- 네트워크 복구 후 3초 뒤 자동 재시도
- 재시도 실패 시 사용자 알림 및 수동 재시도 옵션 제공

---

#### EC-003: 여러 기기에서 동시 접속 처리

**시나리오**: 동시에 여러 기기에서 같은 사용자가 채팅방에 접속했을 때

**처리 방식**:
- 실무 표준 방식: 마지막으로 접속한 기기가 활성화되고, 다른 기기는 읽기 전용 모드로 전환됩니다.
- 모든 기기에서 메시지 수신은 가능하지만, 메시지 전송은 활성화된 기기에서만 가능합니다.
- 비활성 기기에서는 "다른 기기에서 채팅 중입니다" 안내 메시지를 표시합니다.
- 활성 기기가 변경되면 이전 활성 기기는 자동으로 읽기 전용 모드로 전환됩니다.

**Acceptance Criteria**:
- 마지막 접속 기기만 활성화
- 다른 기기는 읽기 전용 모드
- 비활성 기기에 안내 메시지 표시
- 활성 기기 변경 시 자동 모드 전환

---

#### EC-004: 방 입장 전 메시지 전송 시도 처리

**시나리오**: 방에 입장하지 않은 상태에서 메시지를 전송하려고 할 때

**처리 방식**:
- 방에 입장하지 않은 상태에서 메시지 전송을 차단합니다.
- 전송 버튼을 비활성화하거나, 전송 시도 시 "먼저 채팅방에 입장해주세요" 에러 메시지를 표시합니다.
- 자동 입장은 시도하지 않습니다 (명시적 입장 필요).

**Acceptance Criteria**:
- 방 미입장 상태에서 메시지 전송 차단
- 전송 버튼 비활성화 또는 에러 메시지 표시
- 자동 입장 기능 없음

---

#### EC-005: 서버가 roomId 생성 실패 처리

**시나리오**: 서버가 roomId를 생성하지 못했을 때

**처리 방식**:
- roomId 생성 실패 시 WebSocket 연결을 차단합니다.
- 사용자에게 "채팅방 생성에 실패했습니다" 에러 메시지를 표시합니다.
- 문의 목록 페이지로 자동 이동하고, 하단에 토스트 메시지를 표시합니다.
  - 토스트 메시지: "채팅방을 생성할 수 없습니다. 잠시 후 다시 시도해주세요."
- 재시도는 사용자가 수동으로 새 문의를 시작할 때만 가능합니다.

**Acceptance Criteria**:
- roomId 생성 실패 시 WebSocket 연결 차단
- 에러 메시지 표시
- 문의 목록으로 자동 이동 및 토스트 메시지 표시
- 수동 재시도만 가능

---

#### EC-006: 읽음 처리 알림 중복 전송 처리

**시나리오**: 읽음 처리 알림이 중복으로 전송되었을 때

**처리 방식**:
- 클라이언트에서 debounce 처리: 500ms 이내의 중복 `read_alert` 이벤트는 무시합니다.
- 서버에서도 중복 방지 로직이 있다고 가정하지만, 클라이언트에서도 이중 방어를 구현합니다.
- 이미 읽음 처리된 메시지에 대한 중복 알림은 무시합니다.

**Acceptance Criteria**:
- 500ms 이내 중복 read_alert 이벤트 무시
- 이미 읽음 처리된 메시지의 중복 알림 무시
- 서버와 클라이언트 이중 방어

---

#### EC-007: HTTP API와 WebSocket 메시지 중복 병합 처리

**시나리오**: HTTP API로 조회한 메시지와 WebSocket으로 받은 메시지의 ID가 중복될 때

**처리 방식**:
- 실무 표준 방식: 메시지 ID를 기준으로 중복을 제거하고, `updatedAt` 또는 `createdAt` 타임스탬프가 더 최신인 메시지를 우선 반영합니다.
- 병합 로직:
  1. 메시지 ID를 키로 사용하여 Map에 저장
  2. 동일 ID가 이미 존재하면 타임스탬프 비교
  3. 더 최신 타임스탬프를 가진 메시지로 업데이트
  4. 최종적으로 시간순 정렬하여 표시
- WebSocket으로 받은 실시간 메시지가 HTTP API 메시지보다 최신일 가능성이 높으므로, WebSocket 메시지를 우선 반영합니다.

**Acceptance Criteria**:
- 메시지 ID 기준 중복 제거
- 타임스탬프 비교로 최신 메시지 우선 반영
- WebSocket 메시지 우선 반영
- 최종 시간순 정렬 표시

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 `GET /api/me/inquiries` API를 통해 사용자의 문의 목록을 조회할 수 있어야 합니다. 응답은 페이지네이션 정보(total, limit, offset, hasNext)와 문의 항목 배열(items)을 포함합니다.
- **FR-002**: 시스템은 `GET /api/me/inquiries/{id}` API를 통해 특정 문의의 상세 정보와 채팅 내역을 페이지네이션하여 조회할 수 있어야 합니다. 응답은 문의 정보(inquiry)와 메시지 배열(messages), 페이지네이션 정보를 포함합니다.
- **FR-003**: 시스템은 WebSocket(Socket.IO)을 통해 `/user-chat` 네임스페이스에 연결할 수 있어야 합니다.
- **FR-004**: 시스템은 WebSocket 인증을 위해 토큰을 `auth: { token }` 또는 `Authorization: Bearer <token>` 헤더로 전달할 수 있어야 합니다.
- **FR-005**: 시스템은 `join_room` 이벤트를 roomId 없이 호출하여 서버가 자동으로 문의방을 생성/조회하도록 할 수 있어야 합니다.
- **FR-006**: 시스템은 `join_room` 이벤트의 응답으로 받은 roomId를 저장하고 사용할 수 있어야 합니다.
- **FR-007**: 시스템은 `send_message` 이벤트를 통해 메시지를 전송할 수 있어야 합니다.
- **FR-008**: 시스템은 `receive_message` 이벤트를 통해 실시간으로 메시지를 수신할 수 있어야 합니다.
- **FR-009**: 시스템은 `read_alert` 이벤트를 통해 읽음 처리를 알릴 수 있어야 합니다.
- **FR-010**: 시스템은 `read_alert` 이벤트를 통해 상대방의 읽음 상태를 실시간으로 수신할 수 있어야 합니다.
- **FR-011**: 시스템은 WebSocket 연결 상태를 추적하고 UI에 표시할 수 있어야 합니다.
- **FR-012**: 시스템은 WebSocket 연결이 끊어졌을 때 자동으로 재연결을 시도할 수 있어야 합니다. 재시도는 최대 3회까지 시도하며, 실패 시 문의 목록으로 이동합니다 (EC-001 참조).
- **FR-013**: 시스템은 HTTP API로 조회한 메시지와 WebSocket으로 받은 실시간 메시지를 시간순으로 병합하여 표시할 수 있어야 합니다. 메시지 ID 기준 중복 제거 및 타임스탬프 비교를 통해 최신 메시지를 우선 반영합니다 (EC-007 참조).
- **FR-014**: 시스템은 메시지 전송 실패 시 재시도할 수 있어야 합니다. 네트워크 불안정 시 오프라인 모드로 전환하고, 네트워크 복구 후 3초 뒤 자동 재시도합니다 (EC-002 참조).
- **FR-015**: 시스템은 채팅 내역을 무한 스크롤로 과거 메시지를 로드할 수 있어야 합니다.
- **FR-016**: 시스템은 방에 입장하지 않은 상태에서 메시지 전송을 차단할 수 있어야 합니다 (EC-004 참조).
- **FR-017**: 시스템은 roomId 생성 실패 시 WebSocket 연결을 차단하고 문의 목록으로 이동할 수 있어야 합니다 (EC-005 참조).
- **FR-018**: 시스템은 읽음 처리 알림의 중복 전송을 방지할 수 있어야 합니다 (500ms debounce, EC-006 참조).
- **FR-019**: 시스템은 여러 기기에서 동시 접속 시 마지막 접속 기기만 활성화하고 다른 기기는 읽기 전용 모드로 전환할 수 있어야 합니다 (EC-003 참조).
- **FR-015**: 시스템은 채팅 내역을 무한 스크롤로 과거 메시지를 로드할 수 있어야 합니다.

### Key Entities *(include if feature involves data)*

- **Inquiry (문의)**: 사용자가 생성한 문의 항목. 문의 목록 조회 시 사용됩니다. 
  - API 응답 형식 (camelCase): id, status (PENDING/IN_PROGRESS/RESOLVED/CLOSED), isResolved, title, lastMessageAt, lastMessagePreview, unreadCount, createdAt
  - 내부 타입 형식 (snake_case): id, user_id, status, is_resolved, title, last_message_at, last_message_preview, created_at, updated_at
- **Chat Room (채팅방)**: 문의와 연결된 채팅방. roomId로 식별됩니다. 유저는 roomId 없이 자동 생성 가능하고, 어드민은 roomId 필수입니다.
- **Message (메시지)**: 채팅방 내에서 주고받는 메시지.
  - API 응답 형식 (camelCase): id, senderType (USER/ADMIN), senderUserId, senderAdminId, content, isReadByAdmin, isReadByUser, createdAt, updatedAt
  - 내부 타입 형식 (snake_case): id, customer_service_id, sender_type, sender_user_id, sender_admin_id, content, is_read_by_admin, is_read_by_user, created_at, updated_at
- **Connection Status (연결 상태)**: WebSocket 연결 상태. connecting, connected, disconnected, error 상태를 가집니다.

**참고**: API 응답은 camelCase 형식이며, 내부 타입은 snake_case 형식을 사용합니다. API 응답을 받을 때 내부 타입으로 변환하는 로직이 필요합니다.

### API Response Formats

#### 문의 목록 조회 응답 (`GET /api/me/inquiries`)

응답 형식:
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "isResolved": false,
      "title": "1:1 문의",
      "lastMessageAt": "2026-01-20T10:30:00.000Z",
      "lastMessagePreview": "문의가 시작되었습니다.",
      "unreadCount": 2,
      "createdAt": "2026-01-19T09:00:00.000Z"
    }
  ],
  "total": 157,
  "limit": 20,
  "offset": 0,
  "hasNext": true
}
```

#### 문의 상세 조회 응답 (`GET /api/me/inquiries/{id}`)

응답 형식:
```json
{
  "inquiry": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "isResolved": false,
    "title": "1:1 문의",
    "createdAt": "2026-01-19T09:00:00.000Z",
    "lastMessageAt": "2026-01-20T10:30:00.000Z",
    "lastMessagePreview": "문의가 시작되었습니다."
  },
  "messages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "senderType": "USER",
      "senderUserId": "550e8400-e29b-41d4-a716-446655440000",
      "senderAdminId": null,
      "content": "문의 드립니다.",
      "isReadByAdmin": true,
      "isReadByUser": false,
      "createdAt": "2026-01-20T10:30:00.000Z",
      "updatedAt": "2026-01-20T10:31:00.000Z"
    }
  ],
  "total": 120,
  "limit": 20,
  "offset": 0,
  "hasNext": true
}
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자는 문의 목록 조회를 2초 이내에 완료할 수 있습니다.
- **SC-002**: 사용자는 WebSocket 연결을 3초 이내에 완료할 수 있습니다.
- **SC-003**: 사용자는 메시지 전송 후 1초 이내에 자신의 메시지가 화면에 표시되는 것을 확인할 수 있습니다.
- **SC-004**: 사용자는 메시지 전송 후 2초 이내에 상대방의 메시지를 수신할 수 있습니다 (네트워크 정상 상태 기준).
- **SC-005**: 시스템은 WebSocket 연결이 끊어졌을 때 5초 이내에 자동으로 재연결을 시도합니다.
- **SC-006**: 시스템은 메시지 전송 성공률이 95% 이상입니다 (네트워크 정상 상태 기준).
- **SC-007**: 사용자는 채팅 내역 조회 시 1초 이내에 최신 메시지 20개를 확인할 수 있습니다.
- **SC-008**: 사용자는 무한 스크롤로 과거 메시지를 부드럽게 로드할 수 있습니다 (60fps 이상 유지).

## Assumptions

- 백엔드는 Socket.IO 서버를 사용하며, `/user-chat` 및 `/admin-chat` 네임스페이스를 제공합니다.
- 인증 토큰은 기존 인증 시스템에서 제공하는 액세스 토큰을 사용합니다.
- 메시지는 서버에 저장된 후 브로드캐스트되므로, 전송 실패 시에도 서버에 저장되지 않습니다.
- HTTP API와 WebSocket 메시지의 시간 동기화는 서버에서 관리됩니다.
- 네트워크가 불안정한 상황에서도 기본적인 재연결 로직이 동작합니다.

## Dependencies

- 백엔드: Socket.IO 서버 구현 완료 필요 (`/user-chat`, `/admin-chat` 네임스페이스)
- 백엔드: HTTP API 구현 완료 필요 (문의 목록 조회, 채팅 내역 조회)
- 프론트엔드: Socket.IO 클라이언트 라이브러리 설치 필요 (`socket.io-client`)
- 프론트엔드: 기존 인증 시스템과의 통합 필요 (토큰 획득)

## Out of Scope

- 파일 첨부 기능 (이미지, 문서 등) - 별도 기능으로 구현 예정
- 푸시 알림 연동 - 별도 기능으로 구현 예정
- 채팅방 검색 기능 - 별도 기능으로 구현 예정
- 메시지 수정/삭제 기능 - 별도 기능으로 구현 예정