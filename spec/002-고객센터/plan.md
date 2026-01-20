# Implementation Plan: 고객센터 페이지

## Status  
📋 **PLANNING** — 구현 계획 수립 완료, 개발 시작 전

## Overview  
TimeEgg 앱의 고객센터 페이지를 구현합니다. 네이버 톡톡처럼 관리자와 실시간 채팅을 통해 문의할 수 있는 기능을 제공합니다. 사용자는 채팅을 통해 즉시 문의하고, 관리자가 실시간으로 답변할 수 있습니다. 마이페이지의 "고객 센터" 메뉴에서 접근 가능하며, Feature-Sliced Architecture 패턴을 따라 구현합니다.

## Technical Context

### 프로젝트 구조
- **아키텍처**: Feature-Sliced Architecture
- **프레임워크**: React Native (Expo SDK ~54.0.31)
- **라우팅**: Expo Router (파일 기반 라우팅)
- **상태 관리**: @tanstack/react-query 5.90.12
- **스타일링**: React Native StyleSheet + NativeWind 4.2.1
- **아이콘**: react-native-remix-icon 4.7.0
- **HTTP 클라이언트**: axios 1.13.2
- **실시간 통신**: Socket.IO (`socket.io-client`)
  - 네임스페이스: `/user-chat`
  - 이벤트: `join_room`, `send_message`, `receive_message`, `read_alert`

### 기존 구조 분석
- **마이페이지 위치**: `components/mypage/`
- **메뉴 리스트**: `components/mypage/components/menu-list/`에 "고객 센터" 메뉴 항목 존재 (현재 비활성화)
- **라우팅**: `app/(tabs)/mypage.tsx`에서 마이페이지 렌더링
- **디자인 토큰**: `commons/constants/`에서 Colors, Typography, Spacing 등 관리

### 기술적 결정 사항

#### 1. 컴포넌트 구조
- **Feature Container**: `components/customer-service/index.tsx`
- **Sub-components**: `components/customer-service/components/`
- **Hooks**: `components/customer-service/hooks/`
- **Types**: `components/customer-service/types.ts`
- **Styles**: `components/customer-service/styles.ts`

#### 2. 라우팅 전략
- **경로**: `app/(tabs)/customer-service.tsx` (탭 네비게이션)
- **접근**: 마이페이지 메뉴에서 네비게이션 또는 탭에서 직접 접근
- **라우트 상수**: `commons/constants/routes.ts`에 `CUSTOMER_SERVICE` 추가
- **진입 플로우**: 
  - 고객센터 진입 시 문의 내역 리스트 페이지로 이동 (`app/(tabs)/customer-service.tsx`)
  - 문의 내역이 있으면 리스트에서 선택하여 채팅창 진입
  - 문의 내역이 없으면 새 문의 시작 버튼으로 채팅창 진입
  - 채팅창 경로: `app/(tabs)/customer-service/[inquiryId].tsx` 또는 모달

#### 3. API 연동
- **엔드포인트**: 
  - `GET /api/me/inquiries`: 문의 목록 조회 (페이지네이션)
  - `GET /api/me/inquiries/{id}`: 문의 상세 및 채팅 내역 조회 (페이지네이션)
- **API 응답 형식**: camelCase (API) → snake_case (내부 타입) 변환 필요
- **API 호출**: `components/customer-service/api/` 또는 hooks에서 직접 호출
- **에러 처리**: 기존 `apiClient` 인터셉터 활용

#### 4. 상태 관리
- **서버 상태**: React Query (`useQuery`, `useMutation`) - 채팅 내역 조회용
- **실시간 상태**: WebSocket 연결 상태 및 메시지 상태 관리
- **로컬 상태**: `useState`, `useReducer` (채팅 메시지, 연결 상태 등)
- **폼 상태**: `useState` (메시지 입력)

#### 5. 스타일링
- **StyleSheet**: React Native StyleSheet.create() 사용
- **디자인 토큰**: `commons/constants`에서 Colors, Typography, Spacing import
- **인라인 스타일 금지**: 모든 스타일은 styles.ts에서 관리

## Constitution Check

### 아키텍처 규칙 준수
- ✅ **Feature-Sliced Architecture**: `components/customer-service/` 폴더 구조 준수
- ✅ **레이어 분리**: 비즈니스 로직(hooks)과 UI(components) 분리
- ✅ **공통 컴포넌트**: `commons/components/` 재사용 가능한 컴포넌트 활용
- ✅ **순수 함수**: `utils/` 폴더에 유틸리티 함수 배치

### 코딩 컨벤션
- ✅ **TypeScript**: 모든 파일에 타입 정의
- ✅ **파일 구조**: index.tsx, types.ts, styles.ts, hooks/ 분리
- ✅ **스타일 분리**: 인라인 스타일 금지, styles.ts에서 관리
- ✅ **디자인 토큰**: 하드코딩 금지, constants에서 토큰 사용

### 네비게이션 규칙
- ✅ **Expo Router**: 파일 기반 라우팅 사용
- ✅ **라우트 상수**: `commons/constants/routes.ts`에 정의
- ✅ **타입 안정성**: RouteKey, RoutePath 타입 활용

## Functional Requirements

### FR-CS-1: 실시간 채팅
- **우선순위**: High
- **설명**: 관리자와 실시간으로 채팅을 통해 문의할 수 있음 (네이버 톡톡 방식)
- **기능**:
  - WebSocket을 통한 실시간 메시지 송수신
  - 메시지 전송 및 수신
  - 채팅 내역 조회 (스크롤 가능한 메시지 리스트)
  - 메시지 읽음 처리
  - 연결 상태 표시 (연결됨/연결 끊김)
  - 자동 재연결 기능

### FR-CS-2: 채팅 UI/UX
- **우선순위**: High
- **설명**: 직관적이고 사용하기 쉬운 채팅 인터페이스
- **기능**:
  - 메시지 버블 UI (사용자/관리자 구분)
  - 메시지 시간 표시
  - 입력창 및 전송 버튼
  - 키보드가 올라올 때 자동 스크롤
  - 새 메시지 도착 시 자동 스크롤
  - 이미지/파일 첨부 기능 (선택사항)

### FR-CS-3: 문의 내역 리스트
- **우선순위**: High
- **설명**: 사용자가 문의한 내역을 리스트로 조회할 수 있음
- **기능**:
  - 문의 내역 목록 조회 (inquiry 테이블 기반)
  - 문의 제목, 상태, 마지막 메시지 시간 표시
  - 문의 상태별 필터링 (대기중, 진행중, 완료 등)
  - 문의 선택 시 해당 채팅창으로 이동
  - 새 문의 시작 버튼

### FR-CS-4: 채팅 내역 관리
- **우선순위**: High
- **설명**: 선택한 문의의 채팅 내역을 조회하고 관리할 수 있음
- **기능**:
  - 채팅 내역 목록 조회 (messages 테이블 기반, inquiry_id로 필터링)
  - 무한 스크롤 또는 페이지네이션
  - 메시지 읽음 처리 (is_read_by_user, is_read_by_admin)

### FR-CS-5: 채팅 상태 관리
- **우선순위**: Medium
- **설명**: 채팅의 상태를 관리하고 표시함
- **기능**:
  - 관리자 타이핑 인디케이터 (선택사항)
  - 메시지 전송 중 상태 표시
  - 메시지 전송 실패 시 재시도 기능
  - 읽지 않은 메시지 개수 표시 (is_read_by_user 기반)
  - 문의 상태 표시 (is_resolved, status)

### FR-CS-6: Edge Cases 처리
- **우선순위**: High
- **설명**: 예외 상황 및 에러 처리
- **기능**:
  - WebSocket 연결 실패 처리 (최대 3회 재시도, 실패 시 문의 목록으로 이동)
  - 네트워크 불안정 시 메시지 전송 실패 처리 (오프라인 모드, 로컬 큐 저장, 자동 재시도)
  - 여러 기기 동시 접속 처리 (마지막 접속 기기만 활성화, 다른 기기는 읽기 전용)
  - 방 입장 전 메시지 전송 차단
  - roomId 생성 실패 처리
  - 읽음 처리 알림 중복 방지 (500ms debounce)
  - HTTP API와 WebSocket 메시지 중복 병합 처리 (메시지 ID 기준, 타임스탬프 비교)

## Non-Functional Requirements

### 성능
- **로딩 시간**: 
  - 문의 목록 조회: 2초 이내 (SC-001)
  - WebSocket 연결: 3초 이내 (SC-002)
  - 메시지 전송 후 표시: 1초 이내 (SC-003)
  - 채팅 내역 조회: 1초 이내 (최신 메시지 20개) (SC-007)
- **실시간 응답**: 메시지 전송 후 상대방 수신: 2초 이내 (SC-004)
- **재연결**: WebSocket 연결 끊김 시 5초 이내 자동 재연결 시도 (SC-005)
- **성공률**: 메시지 전송 성공률 95% 이상 (SC-006)
- **스크롤 성능**: 무한 스크롤 60fps 이상 유지 (SC-008)
- **캐싱**: React Query를 통한 자동 캐싱

### 사용성
- **에러 처리**: 명확한 에러 메시지 제공
- **로딩 상태**: 모든 비동기 작업에 로딩 인디케이터 표시
- **접근성**: 스크린 리더 지원, 키보드 네비게이션

### 보안
- **입력 검증**: 클라이언트 및 서버 양쪽 검증
- **파일 업로드**: 파일 크기 및 형식 제한
- **XSS 방지**: 사용자 입력 sanitization

## Implementation Phases

### Phase 0: 기반 구조 및 타입 정의 (2-3일)

#### 목표
고객센터 기능의 기본 구조 및 타입 정의 (UI 우선, Mock 데이터 사용)

#### 작업 항목

##### 0.1 폴더 구조 생성
- [ ] `components/customer-service/` 디렉토리 생성
- [ ] `components/customer-service/components/` 디렉토리 생성
- [ ] `components/customer-service/hooks/` 디렉토리 생성
- [ ] `components/customer-service/mocks/` 디렉토리 생성 (Mock 데이터)

##### 0.2 타입 정의
- [ ] `components/customer-service/types.ts` 생성
  - `Inquiry`: 문의 타입 (API 응답: camelCase, 내부 타입: snake_case)
    - API 응답: id, status, isResolved, title, lastMessageAt, lastMessagePreview, unreadCount, createdAt
    - 내부 타입: id, user_id, status, is_resolved, title, last_message_at, last_message_preview, unread_count, created_at, updated_at
  - `InquiryStatus`: 문의 상태 enum ('PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED')
  - `Message`: 메시지 타입 (API 응답: camelCase, 내부 타입: snake_case)
    - API 응답: id, senderType, senderUserId, senderAdminId, content, isReadByAdmin, isReadByUser, createdAt, updatedAt
    - 내부 타입: id, customer_service_id, sender_type, sender_user_id, sender_admin_id, content, is_read_by_admin, is_read_by_user, created_at, updated_at
  - `SenderType`: 발신자 타입 enum ('USER' | 'ADMIN')
  - `MessageStatus`: 메시지 상태 (sending, sent, failed)
  - `ConnectionStatus`: 연결 상태 (connecting, connected, disconnected, error)
  - `ChatRoom`: 채팅방 타입 (roomId로 식별, 유저는 roomId 없이 자동 생성 가능)

##### 0.3 Mock 데이터 생성
- [ ] `components/customer-service/mocks/inquiries.ts` 생성
  - 문의 내역 목록 Mock 데이터
  - 다양한 상태의 문의 샘플 (PENDING, IN_PROGRESS, RESOLVED 등)
- [ ] `components/customer-service/mocks/messages.ts` 생성
  - 채팅 메시지 Mock 데이터
  - 사용자/관리자 메시지 샘플
  - 다양한 시간대의 메시지 샘플

##### 0.4 라우트 상수 추가
- [ ] `commons/constants/routes.ts`에 `CUSTOMER_SERVICE` 추가

##### 0.5 기본 스타일 파일 생성
- [ ] `components/customer-service/styles.ts` 생성
- [ ] 기본 컨테이너 스타일 정의

#### 완료 기준
- 폴더 구조가 생성됨
- 타입 정의가 완료됨
- Mock 데이터가 준비됨
- 라우트 상수가 추가됨

---

### Phase 1: 문의 내역 리스트 UI 구현 (5-7일) - UI 우선

#### 목표
문의 내역을 리스트로 표시하고 채팅창으로 진입할 수 있는 UI 구현 (Mock 데이터 사용)

#### 작업 항목

##### 1.1 문의 내역 리스트 컴포넌트
- [ ] `components/customer-service/components/inquiry-list/` 생성
  - `index.tsx`: 문의 내역 리스트 컨테이너
  - `inquiry-item.tsx`: 개별 문의 항목
    - 문의 제목 표시 (title)
    - 마지막 메시지 미리보기 (last_message_preview)
    - 마지막 메시지 시간 (last_message_at)
    - 문의 상태 표시 (status, is_resolved)
    - 읽지 않은 메시지 개수 표시
  - `new-inquiry-button.tsx`: 새 문의 시작 버튼
  - `types.ts`: Props 타입
  - `styles.ts`: 스타일 정의

##### 1.2 Mock 데이터 훅
- [ ] `components/customer-service/hooks/useMockInquiries.ts` 생성
  - Mock 데이터에서 문의 내역 목록 반환
  - 문의 상태별 필터링 (Mock)
  - 문의 정렬 (최신순 등, Mock)

##### 1.3 문의 내역 페이지
- [ ] `app/(tabs)/customer-service.tsx` 생성
  - 문의 내역 리스트 렌더링 (Mock 데이터 사용)
  - 새 문의 시작 버튼 표시
  - 문의 선택 시 채팅창으로 네비게이션
  - 문의 내역이 없을 때 빈 상태 UI

##### 1.4 채팅창 진입 로직 (Mock)
- [ ] 문의 선택 시 채팅창으로 이동
  - `app/(tabs)/customer-service/[inquiryId].tsx`로 네비게이션
- [ ] 새 문의 시작 시 새 문의 생성 후 채팅창 진입 (Mock)

#### 완료 기준
- 문의 내역 리스트가 Mock 데이터로 정상적으로 표시됨
- 문의 선택 시 채팅창으로 이동함
- 새 문의 시작이 정상 동작함 (Mock)
- 문의 상태가 적절히 표시됨

---

### Phase 2: 채팅 UI 구현 (10-14일) - UI 우선

#### 목표
네이버 톡톡 스타일의 채팅 인터페이스 구현 (Mock 데이터 사용)

#### 작업 항목

##### 2.1 Mock 데이터 훅
- [ ] `components/customer-service/hooks/useMockMessages.ts` 생성
  - Mock 데이터에서 채팅 메시지 목록 반환
  - inquiryId로 필터링 (Mock)
  - 메시지 정렬 (시간순)

##### 2.2 채팅 메시지 리스트 컴포넌트
- [ ] `components/customer-service/components/chat-message-list/` 생성
  - `index.tsx`: 메시지 리스트 컨테이너
  - `message-bubble.tsx`: 개별 메시지 버블 (사용자/관리자 구분)
  - `message-time.tsx`: 메시지 시간 표시
  - `message-status.tsx`: 메시지 전송 상태 표시 (전송 중, 전송 완료, 실패)
  - `types.ts`: Props 타입
  - `styles.ts`: 스타일 정의

##### 2.3 채팅 입력창 컴포넌트
- [ ] `components/customer-service/components/chat-input/` 생성
  - `index.tsx`: 채팅 입력창 컨테이너
  - `text-input.tsx`: 텍스트 입력 필드
  - `send-button.tsx`: 전송 버튼
  - `types.ts`: Props 타입
  - `styles.ts`: 스타일 정의
  - **참고**: 파일 첨부 기능은 Out of Scope (별도 기능으로 구현 예정)

##### 2.4 채팅 헤더 컴포넌트
- [ ] `components/customer-service/components/chat-header/` 생성
  - `index.tsx`: 채팅 헤더 (관리자 정보, 연결 상태 등)
  - `connection-status.tsx`: 연결 상태 표시
  - `types.ts`: Props 타입
  - `styles.ts`: 스타일 정의

##### 2.5 채팅 페이지 통합
- [ ] `components/customer-service/components/chat-room/` 생성
  - `index.tsx`: 채팅방 전체 레이아웃
  - `KeyboardAvoidingView` 또는 `react-native-keyboard-aware-scroll-view` 적용
  - 메시지 리스트, 입력창, 헤더 통합 (Mock 데이터 사용)
- [ ] `app/(tabs)/customer-service/[inquiryId].tsx` 생성
  - 채팅방 Feature Container 렌더링
  - inquiryId 파라미터로 Mock 데이터에서 문의 정보 로드

##### 2.6 키보드 및 스크롤 처리
- [ ] 키보드가 올라올 때 자동 스크롤 구현
- [ ] 새 메시지 도착 시 자동 스크롤 구현
- [ ] 스크롤 위치에 따른 과거 메시지 로드 트리거

##### 2.7 애니메이션 구현
- [ ] `react-native-reanimated`를 활용한 메시지 애니메이션
- [ ] 메시지 전송 애니메이션
- [ ] 로딩 인디케이터 애니메이션

#### 완료 기준
- 채팅 UI가 네이버 톡톡 스타일로 구현됨
- 메시지 리스트가 Mock 데이터로 정상적으로 표시됨
- 메시지 전송 UI가 구현됨 (실제 전송은 Mock)
- 키보드가 올라올 때 자동 스크롤이 동작함
- 새 메시지 도착 시 자동 스크롤이 동작함 (Mock)
- 애니메이션이 부드럽게 동작함

---

### Phase 3: Edge Cases 및 에러 처리 구현 (5-7일)

#### 목표
예외 상황 및 에러 처리 로직 구현 (Mock 데이터 사용)

#### 작업 항목

##### 3.1 WebSocket 연결 실패 처리 (EC-001)
- [ ] 연결 실패 시 사용자 알림 표시
- [ ] 자동 재시도 로직 구현 (최대 3회)
- [ ] 3회 실패 시 문의 목록으로 자동 이동 및 토스트 메시지 표시
  - 토스트 메시지: "연결에 실패했습니다. 잠시 후 다시 시도해주세요."

##### 3.2 네트워크 불안정 처리 (EC-002)
- [ ] 네트워크 불안정 감지 로직
- [ ] 오프라인 모드 전환
- [ ] 전송 실패 메시지 로컬 큐 저장
- [ ] 네트워크 복구 후 3초 뒤 자동 재시도
- [ ] 재시도 실패 시 사용자 알림 및 수동 재시도 옵션 제공

##### 3.3 여러 기기 동시 접속 처리 (EC-003)
- [ ] 마지막 접속 기기 활성화 로직
- [ ] 비활성 기기 읽기 전용 모드 전환
- [ ] "다른 기기에서 채팅 중입니다" 안내 메시지 표시
- [ ] 활성 기기 변경 시 자동 모드 전환

##### 3.4 방 입장 전 메시지 전송 차단 (EC-004)
- [ ] 방 미입장 상태 감지
- [ ] 전송 버튼 비활성화 또는 에러 메시지 표시
- [ ] "먼저 채팅방에 입장해주세요" 에러 메시지

##### 3.5 roomId 생성 실패 처리 (EC-005)
- [ ] roomId 생성 실패 감지
- [ ] WebSocket 연결 차단
- [ ] "채팅방 생성에 실패했습니다" 에러 메시지 표시
- [ ] 문의 목록으로 자동 이동 및 토스트 메시지 표시
  - 토스트 메시지: "채팅방을 생성할 수 없습니다. 잠시 후 다시 시도해주세요."

##### 3.6 읽음 처리 중복 방지 (EC-006)
- [ ] `read_alert` 이벤트 debounce 처리 (500ms)
- [ ] 이미 읽음 처리된 메시지의 중복 알림 무시
- [ ] 클라이언트 이중 방어 로직 구현

##### 3.7 메시지 중복 병합 처리 (EC-007)
- [ ] HTTP API와 WebSocket 메시지 병합 로직
- [ ] 메시지 ID 기준 중복 제거
- [ ] 타임스탬프 비교로 최신 메시지 우선 반영
- [ ] WebSocket 메시지 우선 반영 로직
- [ ] 시간순 정렬 표시

#### 완료 기준
- 모든 Edge Cases가 정상적으로 처리됨
- 에러 메시지가 명확하게 표시됨
- 자동 재연결이 정상 동작함
- 메시지 중복 병합이 정확히 동작함
- 여러 기기 동시 접속이 정상 처리됨

---

### Phase 4: 채팅 상태 관리 및 최적화 (3-5일) - UI 우선

#### 목표
채팅 상태 관리 및 성능 최적화

#### 작업 항목

##### 4.1 읽지 않은 메시지 관리 (Mock)
- [ ] 읽지 않은 메시지 개수 관리 (Mock 데이터 기반)
- [ ] 메시지 읽음 처리 로직 (Mock)
- [ ] 읽음 상태 표시

##### 4.2 메시지 전송 상태 관리 (Mock)
- [ ] 전송 중 상태 표시
- [ ] 전송 실패 시 재시도 기능 (Mock)
- [ ] 전송 실패 메시지 표시

##### 4.3 연결 상태 관리 (Mock)
- [ ] 연결 상태 표시 (연결됨/연결 끊김, Mock)
- [ ] 연결 끊김 시 자동 재연결 UI (Mock)
- [ ] 연결 상태에 따른 UI 피드백

##### 4.4 성능 최적화
- [ ] FlatList 가상화로 메시지 리스트 최적화
- [ ] 메시지 메모이제이션 (`React.memo`)
- [ ] 불필요한 리렌더링 최소화
- [ ] 이미지 최적화 (캐싱, 리사이징)

##### 4.5 문의 상태 업데이트 (Mock)
- [ ] 문의 상태 변경 처리 (Mock, is_resolved, status)
- [ ] 문의 상태에 따른 UI 표시

#### 완료 기준
- 읽지 않은 메시지 개수가 Mock 데이터로 정확히 표시됨
- 메시지 전송 상태가 정확히 표시됨 (Mock)
- 연결 상태가 정확히 표시됨 (Mock)
- 성능이 최적화됨 (스크롤이 부드러움)
- 재연결 UI가 정상 동작함 (Mock)

---

### Phase 5: API 연동 및 WebSocket 구현 (7-10일)

#### 목표
Mock 데이터를 실제 API 및 WebSocket으로 교체

#### 작업 항목

##### 5.1 WebSocket 연결 훅
- [ ] `components/customer-service/hooks/useSocket.ts` 생성
  - Socket.IO 클라이언트 연결 관리 (`socket.io-client`)
  - `/user-chat` 네임스페이스 연결
  - 인증 토큰 전달 (`auth: { token }` 또는 `Authorization: Bearer <token>`)
  - 연결 상태 관리 (`useState`: connecting, connected, disconnected, error)
  - 자동 재연결 로직 (최대 3회, EC-001)
  - 연결 해제 처리
  - 에러 처리

##### 5.2 메시지 송수신 훅
- [ ] `components/customer-service/hooks/useChatMessages.ts` 생성
  - 메시지 리스트 상태 관리 (`useState` 또는 `useReducer`)
  - `join_room` 이벤트 호출 (roomId 없이, 서버가 자동 생성/조회)
  - `join_room` 응답으로 받은 roomId 저장
  - `send_message` 이벤트로 메시지 전송
  - `receive_message` 이벤트로 실시간 메시지 수신
  - `read_alert` 이벤트로 읽음 처리 알림 (500ms debounce, EC-006)
  - `read_alert` 이벤트로 상대방 읽음 상태 수신
  - 메시지 상태 업데이트 (전송 중, 전송 완료, 전송 실패)
  - 방 입장 전 메시지 전송 차단 (EC-004)

##### 5.3 문의 내역 조회 훅 (실제 API)
- [ ] `components/customer-service/hooks/useInquiries.ts` 생성
  - `useQuery`를 사용한 문의 내역 목록 조회 (`GET /api/me/inquiries`)
  - API 응답 형식: camelCase → snake_case 변환
  - 페이지네이션 처리 (total, limit, offset, hasNext)
  - 문의 상태별 필터링
  - 문의 정렬 (최신순 등)
  - Mock 데이터 훅을 실제 API로 교체

##### 5.4 채팅 내역 조회 훅 (실제 API)
- [ ] `components/customer-service/hooks/useChatHistory.ts` 생성
  - `useInfiniteQuery`를 사용한 채팅 내역 조회 (`GET /api/me/inquiries/{id}`)
  - API 응답 형식: camelCase → snake_case 변환
  - 페이지네이션 처리 (total, limit, offset, hasNext)
  - 무한 스크롤로 과거 메시지 로드
  - WebSocket 메시지와 API 조회 메시지 병합 로직 (EC-007)
    - 메시지 ID 기준 중복 제거
    - 타임스탬프 비교로 최신 메시지 우선 반영
    - WebSocket 메시지 우선 반영
    - 시간순 정렬
  - Mock 데이터 훅을 실제 API로 교체

##### 5.5 API 엔드포인트 정의
- [ ] `commons/constants/endpoints.ts`에 추가 (이미 정의되어 있음, 확인 필요)
  ```typescript
  CUSTOMER_SERVICE: {
    INQUIRIES: 'api/me/inquiries', // 문의 목록 조회 (GET)
    INQUIRY_DETAIL: 'api/me/inquiries/{id}', // 문의 상세 및 채팅 내역 조회 (GET)
  }
  ```
- [ ] WebSocket 연결 설정
  - Socket.IO 서버 URL 설정
  - 네임스페이스: `/user-chat`
  - 인증 토큰 전달 방식 확인

##### 5.6 WebSocket 라이브러리 설치 및 설정
- [ ] `socket.io-client` 라이브러리 설치
  - `npm install socket.io-client`
  - `package.md` 문서 업데이트 (외부 라이브러리 도입 가이드 준수)
- [ ] WebSocket 연결 유틸리티 생성
  - `components/customer-service/utils/socket.ts` 또는 `hooks/useSocket.ts`
  - Socket.IO 클라이언트 인스턴스 생성
  - `/user-chat` 네임스페이스 연결
  - 인증 토큰 전달
  - 연결 관리, 재연결 로직, 이벤트 핸들러

#### 완료 기준
- WebSocket 연결이 정상적으로 동작함
- 메시지 전송이 실제 API로 정상 동작함
- 메시지 수신이 WebSocket으로 정상 동작함
- 자동 재연결이 동작함
- 채팅 내역 조회가 실제 API로 정상 동작함
- Mock 데이터가 실제 API로 교체됨

---

### Phase 6: 통합 및 마무리 (3-5일)

#### 목표
고객센터 페이지 통합 및 마이페이지 연결

#### 작업 항목

##### 6.1 문의 내역 리스트 Feature Container 완성
- [ ] `components/customer-service/components/inquiry-list/index.tsx` 완성
  - 문의 내역 리스트 렌더링
  - 레이아웃 최종 조정
  - 에러 바운더리 추가

##### 6.1-2 채팅창 Feature Container 완성
- [ ] `components/customer-service/components/chat-room/index.tsx` 완성
  - 채팅방 렌더링
  - 레이아웃 최종 조정
  - 에러 바운더리 추가

##### 6.2 라우트 설정
- [ ] `app/(tabs)/customer-service.tsx` 생성 (문의 내역 리스트)
  - 문의 내역 리스트 Feature Container 렌더링
- [ ] `app/(tabs)/customer-service/[inquiryId].tsx` 생성 (채팅창)
  - 채팅창 Feature Container 렌더링

##### 6.3 마이페이지 메뉴 연결
- [ ] `components/mypage/components/menu-list/index.tsx` 수정
  - "고객 센터" 메뉴 항목에 `onPress` 핸들러 추가
  - 고객센터 페이지로 네비게이션

##### 6.4 백그라운드 처리
- [ ] 앱이 백그라운드로 갈 때 WebSocket 연결 관리
- [ ] 포그라운드 복귀 시 자동 재연결
- [ ] 푸시 알림 연동 (새 메시지 도착 시, 선택사항)

#### 완료 기준
- 고객센터 페이지가 완성됨
- 마이페이지에서 고객센터로 이동 가능함
- 모든 기능이 정상 동작함
- 백그라운드/포그라운드 전환이 정상 동작함

## Technical Considerations

### 1. WebSocket 라이브러리 선택
- **결정**: `socket.io-client` 사용
  - 백엔드가 Socket.IO 서버를 사용 (`/user-chat`, `/admin-chat` 네임스페이스)
  - 자동 재연결, 방(room) 기능 등 편의 기능 제공
  - 설치: `npm install socket.io-client`
  - 인증: `auth: { token }` 또는 `Authorization: Bearer <token>` 헤더로 전달

### 2. 실시간 메시지 상태 관리
- WebSocket 연결 상태 관리 (`useState`: connecting, connected, disconnected, error)
- 메시지 리스트 상태 관리 (`useState` 또는 `useReducer`)
- 새 메시지 도착 시 자동 업데이트 (`receive_message` 이벤트)
- 메시지 전송 대기열 관리 (네트워크 오류 시, EC-002)
- HTTP API와 WebSocket 메시지 병합 (EC-007)

### 3. 채팅 UI 구현
- FlatList를 사용한 메시지 리스트 (가상화로 성능 최적화)
- `react-native-reanimated`를 활용한 부드러운 애니메이션
- 키보드가 올라올 때 자동 스크롤 (`KeyboardAvoidingView` 또는 `react-native-keyboard-aware-scroll-view`)
- 메시지 버블 스타일링 (사용자/관리자 구분)

### 4. API 응답 변환 처리
- API 응답은 camelCase 형식
- 내부 타입은 snake_case 형식 사용
- API 응답을 받을 때 내부 타입으로 변환하는 로직 필요
- 변환 유틸리티 함수 생성 (`components/customer-service/utils/transformers.ts`)

### 5. 채팅 내역 조회
- React Query의 `useInfiniteQuery` 활용
- 무한 스크롤로 과거 메시지 로드
- WebSocket 메시지와 API 조회 메시지 병합

## Dependencies

### 백엔드
- [x] WebSocket 서버 구현 완료 (Socket.IO)
  - `/user-chat` 네임스페이스 제공
  - `/admin-chat` 네임스페이스 제공
  - 실시간 메시지 송수신 처리
  - 채팅방 관리 (1:1 채팅)
  - 이벤트: `join_room`, `send_message`, `receive_message`, `read_alert`
- [x] 채팅 관련 REST API 구현 완료
  - `GET /api/me/inquiries`: 문의 목록 조회 (페이지네이션)
  - `GET /api/me/inquiries/{id}`: 문의 상세 및 채팅 내역 조회 (페이지네이션)

### 프론트엔드
- [ ] **추가 설치 필요**: WebSocket 라이브러리
  - `socket.io-client` (Socket.IO 클라이언트)
  - 설치 후 `package.md` 문서 업데이트 필수 (외부 라이브러리 도입 가이드 준수)
- 기존 라이브러리 활용:
  - `@tanstack/react-query`: 채팅 내역 조회 (`useQuery`, `useInfiniteQuery`)
  - `react-native-reanimated`: 애니메이션
  - `axios`: HTTP 클라이언트 (기존 `apiClient` 활용)

## Risk Mitigation

### 위험 요소 및 완화 방안

1. **백엔드 API 지연**
   - 완화: 프론트엔드 개발 시 모킹 API 사용
   - 완화: 백엔드와의 명확한 API 스펙 정의

2. **WebSocket 연결 불안정**
   - 완화: 자동 재연결 로직 (최대 3회)
   - 완화: 연결 상태 UI 표시
   - 완화: 연결 실패 시 명확한 에러 메시지 및 대안 제시

3. **사용자 경험 저하**
   - 완화: 명확한 로딩 상태 표시
   - 완화: 친절한 에러 메시지
   - 완화: 사용자 테스트 수행

## Success Metrics

### 기능 완성도
- 모든 기능 요구사항 구현 완료
- 모든 Acceptance Criteria 충족

### 품질 지표
- 에러율 1% 이하
- 응답 시간: 
  - 문의 목록 조회: 2초 이내 (SC-001)
  - WebSocket 연결: 3초 이내 (SC-002)
  - 메시지 전송 후 표시: 1초 이내 (SC-003)
  - 채팅 내역 조회: 1초 이내 (SC-007)
- WebSocket 연결 안정성 99% 이상
- 메시지 전송 성공률 95% 이상 (SC-006)
- 사용자 만족도 (수동 테스트 기반)

### 사용자 경험
- 메시지 전송 성공률 95% 이상 (SC-006)
- 실시간 채팅 응답 시간: 메시지 전송 후 상대방 수신 2초 이내 (SC-004)
- 무한 스크롤 성능: 60fps 이상 유지 (SC-008)
- 자동 재연결: 연결 끊김 시 5초 이내 재연결 시도 (SC-005)

## Timeline Summary

| Phase | 기간 | 주요 작업 |
|-------|------|----------|
| Phase 0 | 2-3일 | 기반 구조 및 타입 정의 (Mock 데이터 준비) |
| Phase 1 | 5-7일 | 문의 내역 리스트 UI 구현 (Mock 데이터) |
| Phase 2 | 10-14일 | 채팅 UI 구현 (Mock 데이터) |
| Phase 3 | 5-7일 | Edge Cases 및 에러 처리 구현 (Mock 데이터) |
| Phase 4 | 3-5일 | 채팅 상태 관리 및 최적화 (Mock 데이터) |
| Phase 5 | 7-10일 | API 연동 및 WebSocket 구현 (Mock → 실제) |
| Phase 6 | 3-5일 | 통합 및 마무리 |
| **총계** | **35-51일** | |

## Related Documents

- [기술 스택 및 아키텍처 분석](../tech-stack-architecture.md)
- [Data Model 문서](./data_model.md) (작성 예정)
- [API Contracts 문서](./contracts/) (작성 예정)
