# Tasks: 관리자 알림 푸시 수신

**Input**: Design documents from `/specs/004-push-notification/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Note**: 이 기능은 기존 푸시 알림 인프라를 활용하므로 추가 구현이 거의 필요하지 않습니다. 대부분의 태스크는 확인 및 선택적 개선 작업입니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `components/notification/` at repository root
- Paths shown below follow Feature Slice Architecture

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 백엔드 확인 및 환경 설정

- [ ] T001 백엔드 팀과 푸시 알림 데이터 구조 확인 및 조정 (contracts/push-notification.yaml 참고)
- [ ] T002 [P] 백엔드에서 푸시 알림 발송 시 data 필드에 type, notificationId, title, content 포함 여부 확인
- [ ] T003 [P] 사용자의 푸시 토큰이 백엔드에 등록되어 있는지 확인
- [ ] T004 [P] 앱에서 푸시 알림 권한이 허용되어 있는지 확인

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 기존 인프라 확인

**⚠️ CRITICAL**: 기존 푸시 알림 인프라가 이미 구현되어 있으므로, 이 단계는 확인 작업만 수행합니다.

- [x] T005 기존 푸시 알림 수신 인프라 확인 (components/notification/hooks/usePushNotifications.ts)
- [x] T006 [P] 기존 알림 목록 조회 기능 확인 (components/notification/hooks/useNotifications.ts)
- [x] T007 [P] 기존 알림 이벤트 시스템 확인 (components/notification/utils/notificationEvents.ts)
- [x] T008 기존 알림 타입 처리 로직 확인 (usePushNotifications.ts의 else 분기가 알림 화면으로 이동하는지 확인)

**Checkpoint**: 기존 인프라 확인 완료 - SYSTEM 타입 알림이 이미 처리 가능한 상태임을 확인

---

## Phase 3: User Story 1 - 관리자 알림 푸시 수신 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 앱을 사용 중이거나 백그라운드에 있을 때, 관리자가 웹에서 발송한 알림을 푸시 알림으로 받을 수 있습니다.

**Independent Test**: 관리자가 어드민 페이지에서 알림을 발송하면, 대상 사용자의 앱에서 푸시 알림이 수신되는지 확인할 수 있습니다. 앱이 포그라운드, 백그라운드, 종료 상태 모두에서 테스트할 수 있습니다.

### Implementation for User Story 1

- [x] T009 [US1] 기존 푸시 알림 수신 로직이 SYSTEM 타입을 처리하는지 확인 (components/notification/hooks/usePushNotifications.ts)
- [ ] T010 [US1] [P] 포그라운드 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기) - 사용자 테스트 필요
- [ ] T011 [US1] [P] 백그라운드 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기) - 사용자 테스트 필요
- [ ] T012 [US1] [P] 앱 종료 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기) - 사용자 테스트 필요
- [x] T013 [US1] 알림 수신 시 notificationEvents.emit() 호출 확인 (components/notification/hooks/usePushNotifications.ts:71)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. 기존 인프라가 이미 SYSTEM 타입 알림을 처리하므로 추가 구현이 필요하지 않을 수 있습니다.

---

## Phase 4: User Story 2 - 관리자 알림 목록 표시 (Priority: P1)

**Goal**: 사용자가 관리자로부터 받은 알림을 알림 목록에서 확인할 수 있습니다.

**Independent Test**: 관리자가 알림을 발송한 후, 사용자의 앱에서 알림 목록 화면을 열어 해당 알림이 표시되는지 확인할 수 있습니다.

### Implementation for User Story 2

- [x] T014 [US2] 알림 목록 조회 API가 SYSTEM 타입 알림을 반환하는지 확인 (components/notification/hooks/useNotifications.ts)
- [x] T015 [US2] [P] 알림 수신 후 알림 목록 자동 새로고침 동작 확인 (notificationEvents 구독 확인)
- [ ] T016 [US2] [P] 알림 목록에 SYSTEM 타입 알림이 표시되는지 확인 (components/notification/index.tsx) - 사용자 테스트 필요
- [ ] T017 [US2] 알림 제목과 내용이 올바르게 표시되는지 확인 (components/notification/index.tsx) - 사용자 테스트 필요
- [ ] T018 [US2] 알림이 읽지 않은 상태로 표시되는지 확인 (isRead: false) - 사용자 테스트 필요

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. 기존 알림 목록 기능이 이미 SYSTEM 타입을 처리하므로 추가 구현이 필요하지 않을 수 있습니다.

---

## Phase 5: User Story 3 - 관리자 알림 탭 시 화면 이동 (Priority: P2)

**Goal**: 사용자가 관리자 알림을 탭했을 때 적절한 화면으로 이동합니다.

**Independent Test**: 관리자 알림을 탭하여 알림 화면으로 이동하는지 확인할 수 있습니다.

### Implementation for User Story 3

- [x] T019 [US3] 알림 탭 리스너의 else 분기가 SYSTEM 타입을 알림 화면으로 이동시키는지 확인 (components/notification/hooks/usePushNotifications.ts:94-96)
- [ ] T020 [US3] [P] 푸시 알림 탭 시 앱이 열리고 알림 화면으로 이동하는지 테스트 (실제 기기) - 사용자 테스트 필요
- [ ] T021 [US3] [P] 앱 실행 중 알림 탭 시 알림 화면으로 이동하는지 테스트 (실제 기기) - 사용자 테스트 필요
- [x] T022 [US3] 알림 화면 이동 시 올바른 라우트 사용 확인 (ROUTES.ALARM)

**Checkpoint**: At this point, all user stories should now be independently functional. 기존 else 분기가 이미 SYSTEM 타입을 알림 화면으로 이동시키므로 추가 구현이 필요하지 않습니다.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 타입 안정성 개선 및 선택적 개선 사항

- [x] T023 [P] SYSTEM 타입을 명시적으로 타입 정의에 추가 (components/notification/types.ts) - 선택사항
- [x] T024 [P] SYSTEM 타입 아이콘 매핑 추가 (components/notification/hooks/useNotifications.ts의 getNotificationIcon 함수) - 선택사항
- [x] T025 [P] 백엔드 푸시 알림 데이터 구조 문서화 (contracts/push-notification.yaml 업데이트) - 이미 문서화됨
- [ ] T026 quickstart.md의 테스트 시나리오 실행 및 검증 - 사용자 테스트 필요
- [ ] T027 [P] 실제 기기에서 종합 테스트 (포그라운드, 백그라운드, 종료 상태 모두) - 사용자 테스트 필요
- [ ] T028 [P] 알림 수신 성공률 측정 (10초 이내 수신률 95% 이상 목표) - 사용자 테스트 필요
- [ ] T029 [P] 알림 목록 표시 성공률 측정 (100% 목표) - 사용자 테스트 필요
- [ ] T030 [P] 알림 탭 시 화면 이동 시간 측정 (2초 이내 목표) - 사용자 테스트 필요

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (알림 수신 후 탭 가능)

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- Tests can run in parallel where marked [P]

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "포그라운드 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기)"
Task: "백그라운드 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기)"
Task: "앱 종료 상태에서 SYSTEM 타입 알림 수신 테스트 (실제 기기)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (백엔드 확인)
2. Complete Phase 2: Foundational (기존 인프라 확인)
3. Complete Phase 3: User Story 1 (푸시 알림 수신 확인)
4. **STOP and VALIDATE**: 실제 기기에서 User Story 1 테스트
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (푸시 알림 수신)
   - Developer B: User Story 2 (알림 목록 표시)
   - Developer C: User Story 3 (알림 탭 시 화면 이동)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files, no dependencies
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Most tasks are verification tasks since existing infrastructure already handles SYSTEM type notifications
- Optional improvements (T023, T024) can be skipped if not needed
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Important**: This feature leverages existing infrastructure, so most work is verification and optional improvements rather than new implementation
