# 백엔드 API 수정 요청사항

## 📋 목차

1. [미디어 업로드 방식 통일](#1-미디어-업로드-방식-통일)
2. [공유하기 기능 구현 방안](#2-공유하기-기능-구현-방안)
3. [캡슐 이름 고정값 문제](#3-캡슐-이름-고정값-문제)
4. [max_images_per_person 계산 로직 오류](#4-max_images_per_person-계산-로직-오류)

---

## 🧾 전체 요약 (핵심)

- 미디어 업로드 방식: S3 URL 전달 방식과 multipart 업로드 방식 혼재 → 표준 방식 결정 필요(보안·일관성 관점에서 multipart 권장).
- 공유하기: 초대코드 공유는 딥링크(`timeegg://room/join?invite_code=...`) 사용을 최우선 방안으로 제안.
- 캡슐 이름/ID: `capsule_name`이 고정값으로 내려오거나 title/id가 누락됨 → DB 저장값과 식별자 그대로 반환 필요.
- max_images_per_person: `photo_count`는 인당 사진 수이므로 계산 없이 그대로 반환(`max_images_per_person = photo_count`), 필요 시 필드명 `images_per_person`로 명확화 및 명세에 의미 기재.

---

## 1. 미디어 업로드 방식 통일

### 🔍 현재 상황

프로젝트 내에서 **두 가지 다른 미디어 업로드 방식**이 혼재되어 있습니다:

#### 방식 A: 이스터에그 (Egg Form)

```typescript
// 이스터에그 방식
const mediaId = await upload(uri, 'IMAGE'); // S3 업로드
const mediaUrls = await getMediaUrls(mediaIds); // mediaId → URL 변환
const requestData = {
  title: '...',
  content: '...',
  media_urls: mediaUrls, // ✅ mediaId를 URL로 변환하여 전송
  media_types: mediaTypes,
  // ...
};
```

#### 방식 B: 타임캡슐 콘텐츠 제출

- **프론트엔드 → 백엔드 API에 파일 직접 전송 (multipart/form-data)**
- 사용 위치: `components/timecapsule-create/components/write-bottomsheet/`
- API: `POST /api/capsules/step-rooms/:capsuleId/my-content`
- 요청 형식: `multipart/form-data` (파일 직접 전송)

```typescript
// 타임캡슐 방식
const formData = new FormData();
formData.append('text_message', text);
formData.append('images', { uri, type, name }); // ✅ 파일 직접 전송
// 백엔드가 파일을 받아서 S3에 업로드
```

### ❓ 질문

1. **두 방식 중 어떤 것이 표준인가요?**

   - 이스터에그 방식 (S3 직접 업로드 → mediaId 전송)
   - 타임캡슐 방식 (multipart/form-data로 파일 직접 전송)

2. **통일이 필요한가요?**

   - 현재 타임캡슐 API 명세에 따르면 `multipart/form-data`를 받도록 되어 있습니다.
   - 하지만 이스터에그는 `media_urls`를 받고 있습니다.
   - **일관성을 위해 하나로 통일하는 것이 좋을 것 같습니다.**

3. **권장 방식은?**
   - 보안: 백엔드에서 파일 검증 및 S3 업로드 처리 (타임캡슐 방식)
   - 성능: 프론트엔드에서 직접 S3 업로드 (이스터에그 방식)

---

## 2. 공유하기 기능 구현 방안

### 🎯 요구사항

대기실 초대 코드를 공유하는 기능을 구현해야 합니다.

현재 상황:

- 앱 구조: `timeegg://` 딥링크 스킴 설정됨
- 문제점: API URL을 공유하면 백엔드 엔드포인트를 직접 호출하게 되어 인증 에러 발생

### 💡 제안하는 3가지 방안

#### 방안 1: 딥링크 사용 (추천) ⭐

**구조:**

```
timeegg://room/join?invite_code=ABC123
```

**장점:**

- 앱이 설치된 사용자에게 최적화된 UX
- 네이티브 앱 경험 제공
- 구현이 비교적 간단

---

## 3. 캡슐 이름/ID 반환 문제

### 🔍 현재 문제

- `GET /api/capsules/step-rooms/:capsuleId/settings` 응답의 `capsule_name`이 고정값(예: "나의 타임캡슐")으로 내려오거나, 제목/식별자(`title_id`/`capsule_id`)가 누락됨.
- 생성 시 입력한 캡슐명·식별자가 프론트로 전달되지 않아 화면 표시와 연동 로직에 오류 발생.

### ✅ 수정 요청

- DB에 저장된 캡슐명과 식별자를 그대로 반환하도록 하드코딩 제거.
- 필요 필드 예시:
  - `capsule_name`: 사용자가 입력한 이름
  - `capsule_id`(또는 `title_id`): 식별자
- 응답 스키마에 필드 의미를 명시하여 혼동 방지.

### 📌 액션 아이템

1. `capsule_name` 하드코딩 제거 후 DB 값 반환.
2. `capsule_id`(또는 `title_id`)를 응답에 포함해 식별자 전달.
3. 스키마 문서에 각 필드 의미와 예시 추가.
4. 수정 후 실제 생성 데이터로 반환값 검증.

---

## 4. max_images_per_person 계산 로직 오류

### 🔍 데이터 흐름

- 프론트엔드 → 백엔드: `POST /api/orders`

```json
{
  "order_id": "cea2fdf7-e867-44ef-a25e-30d7fcac3905",
  "total_amount": 41000,
  "headcount": 10, // 참여 인원수: 10명
  "photo_count": 2, // 인당 사진 개수: 2장
  "add_music": true,
  "add_video": true,
  "status": "PENDING_PAYMENT"
}
```

- 백엔드 → 프론트엔드: `GET /api/capsules/step-rooms/:capsuleId/settings`

```json
{
  "capsule_name": "나의 타임캡슐",
  "has_music": true,
  "has_video": true,
  "max_images_per_person": 0, // 문제: 2여야 함
  "max_participants": 10,
  "open_date": "2026-01-12",
  "room_id": "70253bec-dc93-484d-beb2-be739c9469f6"
}
```

### 🐞 문제 요약

- 프론트엔드 의미: `photo_count`는 **인당 업로드 가능 사진 수**.
- 백엔드 해석: `photo_count`를 **총 업로드 가능 사진 수**로 오해.
- 잘못된 계산식: `max_images_per_person = Math.floor(photo_count / headcount)` → `2 ÷ 10 = 0.2` → `0`.

### ✅ 수정 제안 (권장)

```typescript
// 잘못된 계산
// const maxImagesPerPerson = Math.floor(photoCount / headcount);

// 수정: photo_count는 이미 "인당 개수"
const maxImagesPerPerson = photoCount;
```

- 예상 결과: `photo_count: 2` → `max_images_per_person: 2`.

### 📌 액션 아이템

1. 백엔드에 `photo_count`가 **인당 개수**임을 공유.
2. 계산 로직을 `maxImagesPerPerson = photoCount`로 수정 요청.
3. 가능하면 API 명세에 필드 의미를 명시하거나 필드명 변경 검토.
4. 수정 후 `GET /api/capsules/step-rooms/:capsuleId/settings` 응답의 `max_images_per_person`가 기대값(예: 2)으로 반환되는지 확인.

### 🧾 한 줄 핵심

- 입력 의미: `photo_count`는 **인당 업로드 가능 사진 수**.
- 계산: `max_images_per_person = photo_count`로 그대로 전달.
- 명세: 필드명을 `images_per_person` 등으로 명확히 표기.
