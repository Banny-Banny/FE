# TimeEgg v1.0.0 개발 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [현재 구현 상태](#현재-구현-상태)
3. [기술 스택](#기술-스택)
4. [아키텍처](#아키텍처)
5. [데이터베이스 & API](#데이터베이스--api)
6. [디자인 시스템](#디자인-시스템)
7. [개발 규칙](#개발-규칙)
8. [향후 개발 계획](#향후-개발-계획)

---

## 1. 프로젝트 개요

### 프로젝트명

TimeEgg (타임에그) - 위치 기반 타임캡슐 애플리케이션

### 목적

지도 위에 추억을 심고, 시간이 지나면 열어보는 소셜 타임캡슐 서비스. 사용자가 특정 위치에 메시지, 사진, 감정을 담은 타임캡슐을 생성하고, 설정한 시간과 위치 조건이 만족되면 다시 열어볼 수 있는 감성적이고 재미있는 경험을 제공합니다.

### 버전

v1.0.0

### 개발 기간

2025.12.15 - 진행 중

---

## 2. 현재 구현 상태

### ✅ 완료된 기능 (Done)

#### 1. 프로젝트 초기 설정

- [x] Expo 프로젝트 생성 (TypeScript)
- [x] ESLint & Prettier 설정 (자동 import 정렬 포함)
- [x] 절대 경로(@/) 설정 (babel-plugin-module-resolver)
- [x] .gitignore 및 보안 설정 (환경 변수 제외)
- [x] NativeWind v4 (Tailwind CSS) 설정
- [x] React Native Reanimated 설정
- [x] Expo New Architecture 활성화
- [x] Typed Routes 활성화

#### 2. 네비게이션 & 라우팅

- [x] Expo Router 기반 파일 구조
- [x] Auth vs App 분기 처리 (`(auth)`, `(app)` 그룹 분리)
- [x] Drawer(사이드바) 네비게이션 구현
  - [x] DrawerLayout 컴포넌트
  - [x] HomePage (메인 홈)
  - [x] Payments 페이지
  - [x] Settings 페이지
- [x] Stack 네비게이션 연동
- [x] 로그인 페이지 기본 구조

#### 3. 컴포넌트 기초

- [x] Map 컴포넌트 기본 구조 (`components/map/`)
- [x] 레이아웃 컴포넌트 분리 (`commons/layout/`)
- [x] 스타일 파일 분리 패턴 적용 (index.tsx + styles.ts)

#### 4. 개발 환경 문서화

- [x] 환경 설정 가이드 (`env-setup-guide.md`)
- [x] 컴포넌트 템플릿 문서 (`component-template.md`)
- [x] 기능 개발 템플릿 문서 (`feature-template.md`)
- [x] 패키지 가이드 (`package.md`)
- [x] 프로젝트 리셋 스크립트 (`scripts/reset-project.js`)

#### 5. 코드 품질 도구

- [x] ESLint 설정 (Expo 기본 + Prettier 통합)
- [x] Prettier 설정 (printWidth: 100, 세미콜론 필수 등)
- [x] Import 자동 정렬 (eslint-plugin-simple-import-sort)

### 🚧 진행 중 (In Progress)

- [ ] Supabase 연동 (Auth, Database, Storage)
- [ ] 지도 라이브러리 선택 및 통합
- [ ] 위치 권한 및 Geolocation 설정

### 📝 대기 중 (Pending)

- [ ] 타임캡슐 생성 UI/UX
- [ ] 타임캡슐 열기 조건 로직 (시간, 거리)
- [ ] 사용자 프로필 관리
- [ ] 푸시 알림 설정
- [ ] 이미지 업로드 및 미디어 처리
- [ ] 소셜 기능 (댓글, 좋아요, 공유)
- [ ] 앱 스토어 배포 준비

---

## 3. 기술 스택

### Frontend Core

```json
{
  "framework": "Expo SDK 54",
  "language": "TypeScript 5.9",
  "runtime": "React 19.1.0",
  "native": "React Native 0.81.5",
  "routing": "Expo Router 6.0"
}
```

### Navigation

```json
{
  "library": "React Navigation 7.x",
  "types": ["Drawer Navigation", "Stack Navigation", "Bottom Tabs (planned)"]
}
```

### Backend & Database

```json
{
  "service": "Supabase (planned)",
  "auth": "Supabase Auth",
  "database": "PostgreSQL",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime (optional)"
}
```

### Map & Location

```json
{
  "map": "TBD (react-native-maps 또는 MapView)",
  "location": "expo-location (planned)",
  "geolocation": "Native Geolocation API"
}
```

### Styling

```json
{
  "library": "NativeWind 4.2",
  "css": "Tailwind CSS 3.4",
  "animations": "React Native Reanimated 4.1"
}
```

### UI/UX

```json
{
  "icons": "@expo/vector-icons",
  "gestures": "react-native-gesture-handler",
  "haptics": "expo-haptics",
  "images": "expo-image"
}
```

### Code Quality

```json
{
  "linter": "ESLint 9.25",
  "formatter": "Prettier",
  "import-sort": "eslint-plugin-simple-import-sort"
}
```

---

## 4. 아키텍처

### 디렉토리 구조

```text
TimeEgg/FE/
├── app/                          # 페이지 & 라우팅 (Expo Router)
│   ├── _layout.tsx               # 최상위 레이아웃 (RootLayout)
│   ├── (app)/                    # 로그인 후 메인 앱 (Drawer)
│   │   ├── _layout.tsx           # Drawer 레이아웃
│   │   ├── index.tsx             # 홈 화면 (지도)
│   │   ├── payments.tsx          # 결제 화면
│   │   └── settings.tsx          # 설정 화면
│   └── (auth)/                   # 로그인 전 인증 화면 (Stack)
│       ├── _layout.tsx           # Auth Stack 레이아웃
│       └── login.tsx             # 로그인 화면
│
├── components/                   # 재사용 컴포넌트
│   └── map/                      # 지도 관련 컴포넌트
│       ├── index.tsx
│       └── styles.ts
│
├── commons/                      # 공통 모듈
│   └── layout/                   # 레이아웃 컴포넌트
│       └── Drawer/               # Drawer 관련
│           ├── index.tsx         # Drawer 컴포넌트
│           ├── DrawerLayout/     # Drawer 레이아웃
│           ├── HomePage/         # 홈 페이지 컨텐츠
│           ├── Payments/         # 결제 페이지 컨텐츠
│           └── Settings/         # 설정 페이지 컨텐츠
│
├── hooks/                        # 커스텀 훅 (예정)
│   ├── useAuth.ts                # 인증 관련 훅
│   ├── useLocation.ts            # 위치 관련 훅
│   └── useEgg.ts                 # 타임캡슐 관련 훅
│
├── services/                     # API 호출 (예정)
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── auth.service.ts           # 인증 서비스
│   ├── egg.service.ts            # 타임캡슐 서비스
│   └── location.service.ts       # 위치 서비스
│
├── types/                        # TypeScript 타입 정의 (예정)
│   ├── database.types.ts         # Supabase Generated Types
│   ├── egg.types.ts              # 타임캡슐 타입
│   └── user.types.ts             # 사용자 타입
│
├── constants/                    # 상수 및 환경설정 (예정)
│   ├── config.ts                 # 앱 설정
│   └── theme.ts                  # 테마 상수
│
├── assets/                       # 이미지 및 폰트 (기본 제공)
│
├── scripts/                      # 유틸리티 스크립트
│   └── reset-project.js          # 프로젝트 리셋
│
├── doc/v.1.0/                    # 프로젝트 문서
│   ├── DEV_DOCS.md               # 본 문서
│   ├── component-template.md     # 컴포넌트 템플릿
│   ├── feature-template.md       # 기능 개발 템플릿
│   ├── env-setup-guide.md        # 환경 설정 가이드
│   └── package.md                # 패키지 관리 가이드
│
├── .cursor/rules/                # AI 코딩 규칙
│   ├── 01-common.mdc
│   ├── 02-wireframe.mdc
│   ├── 03-ui.mdc
│   ├── 04-func.mdc
│   └── figma.mdc
│
├── .vscode/                      # VSCode 설정
│   ├── extensions.json           # 권장 확장 프로그램
│   └── settings.json             # 워크스페이스 설정
│
├── .gitignore                    # Git 제외 파일
├── .prettierrc.js                # Prettier 설정
├── eslint.config.js              # ESLint 설정
├── babel.config.js               # Babel 설정 (절대 경로, NativeWind)
├── metro.config.js               # Metro 번들러 설정
├── tailwind.config.js            # Tailwind CSS 설정 (디자인 토큰)
├── tsconfig.json                 # TypeScript 설정
├── app.json                      # Expo 앱 설정
├── package.json                  # 의존성 관리
└── README.md                     # 프로젝트 소개
```

### 설계 원칙

#### 1. 인증 분리

- `(auth)`: 비로그인 사용자 화면 (Stack Navigation)
- `(app)`: 로그인 후 메인 앱 (Drawer Navigation)
- 명확한 분기로 보안성 강화 및 UX 최적화

#### 2. 기능 중심 모듈화

- 관련된 기능끼리 디렉토리로 그룹화
- 예: Auth, Map, Egg(타임캡슐), Profile 등
- 각 모듈은 독립적으로 개발 및 테스트 가능

#### 3. 타입 안전성

- Supabase Generated Types 적극 활용
- 모든 API 응답 및 데이터 모델에 타입 정의
- TypeScript Strict Mode 활성화

#### 4. 컴포넌트 재사용성

- `components/`: 프로젝트 전역에서 재사용되는 UI 컴포넌트
- `commons/`: 공통 로직 및 레이아웃
- Atomic Design 원칙 적용 (Atoms → Molecules → Organisms)

#### 5. 스타일 분리 패턴

- `index.tsx`: 컴포넌트 로직
- `styles.ts`: Tailwind 또는 StyleSheet 스타일
- 코드 가독성 및 유지보수성 향상

---

## 5. 데이터베이스 & API

### Supabase 구조 (예정)

#### 주요 테이블

##### 1. profiles (사용자 정보)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**용도**: 사용자 기본 정보 및 프로필 관리

##### 2. eggs (타임캡슐 데이터)

```sql
CREATE TABLE eggs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  location GEOGRAPHY(POINT) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  open_at TIMESTAMPTZ NOT NULL,
  unlock_radius INT DEFAULT 100, -- meters
  is_public BOOLEAN DEFAULT FALSE,
  media_urls TEXT[],
  emotion TEXT, -- 'happy', 'sad', 'excited', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 지리적 인덱스 (위치 기반 쿼리 최적화)
CREATE INDEX eggs_location_idx ON eggs USING GIST(location);
```

**용도**: 타임캡슐 메인 데이터 (메시지, 위치, 공개 시간, 미디어)

##### 3. egg_opens (타임캡슐 열람 기록)

```sql
CREATE TABLE egg_opens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  egg_id UUID REFERENCES eggs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  location GEOGRAPHY(POINT),
  UNIQUE(egg_id, user_id)
);
```

**용도**: 누가, 언제, 어디서 타임캡슐을 열었는지 추적

##### 4. comments (댓글, 추후 예정)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  egg_id UUID REFERENCES eggs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**용도**: 타임캡슐에 대한 댓글 기능 (소셜 기능)

##### 5. likes (좋아요, 추후 예정)

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  egg_id UUID REFERENCES eggs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(egg_id, user_id)
);
```

**용도**: 타임캡슐 좋아요 기능

### API 통신 방식

#### 1. Supabase JS Client (기본)

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
);

// 예시: 내 주변 타임캡슐 조회
const getNearbyEggs = async (lat: number, lng: number, radiusKm: number = 5) => {
  const { data, error } = await supabase.rpc('get_nearby_eggs', {
    lat,
    lng,
    radius_km: radiusKm,
  });

  if (error) throw error;
  return data;
};
```

#### 2. Supabase Edge Functions (복잡한 로직)

```typescript
// 예시: 타임캡슐 열기 조건 체크 (시간 + 거리)
// supabase/functions/check-egg-unlock/index.ts
export const checkEggUnlock = Deno.createHandler(async (req) => {
  const { eggId, userLat, userLng } = await req.json();

  // 1. 타임캡슐 정보 조회
  // 2. 시간 조건 체크 (open_at <= NOW())
  // 3. 거리 조건 체크 (ST_Distance(...) <= unlock_radius)
  // 4. 결과 반환

  return new Response(JSON.stringify({ canUnlock: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

#### 3. RPC (Stored Procedures)

```sql
-- 예시: 내 주변 타임캡슐 조회 함수
CREATE OR REPLACE FUNCTION get_nearby_eggs(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  latitude FLOAT,
  longitude FLOAT,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.latitude,
    e.longitude,
    ST_Distance(
      e.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM eggs e
  WHERE ST_DWithin(
    e.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_km * 1000
  )
  AND e.is_public = TRUE
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS) 정책

```sql
-- profiles: 자신의 프로필만 수정 가능
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- eggs: 공개 타임캡슐은 모두 볼 수 있고, 자신의 것만 수정 가능
ALTER TABLE eggs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public eggs are viewable by everyone"
  ON eggs FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own eggs"
  ON eggs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own eggs"
  ON eggs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own eggs"
  ON eggs FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 6. 디자인 시스템

### Color Palette (Tailwind 기반)

#### Primary (메인 색상 - 하늘색)

```javascript
primary: {
  50: "#f0f9ff",   // 아주 연한 하늘색
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",  // 메인 (기본값)
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e",
  950: "#082f49",  // 아주 진한 남색
}
```

**용도**: 주요 버튼, 액션, 강조 요소

#### Secondary (보조 색상 - 보라색)

```javascript
secondary: {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",  // 보조 메인
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87",
  950: "#3b0764",
}
```

**용도**: 서브 액션, 하이라이트, 배지

#### Neutral (중립 색상 - 회색 계열)

```javascript
neutral: {
  50: "#fafafa",   // 배경색
  100: "#f5f5f5",  // 카드 배경
  200: "#e5e5e5",  // Border
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",  // 비활성 텍스트
  600: "#525252",
  700: "#404040",
  800: "#262626",  // 주요 텍스트
  900: "#171717",
  950: "#0a0a0a",  // 거의 검정
}
```

**용도**: 텍스트, 배경, Border, 아이콘

### Spacing (간격 토큰)

```javascript
spacing: {
  xs: "4px",    // 아주 작은 간격
  sm: "8px",    // 작은 간격
  md: "16px",   // 기본 간격
  lg: "24px",   // 큰 간격
  xl: "32px",   // 아주 큰 간격
  "2xl": "40px",
  "3xl": "48px",
}
```

**사용 예시**:

```jsx
<View className="p-md gap-sm">
  <Text>간격 적용</Text>
</View>
```

### Border Radius (모서리 반경)

```javascript
borderRadius: {
  xs: "4px",    // 아주 살짝 둥글게
  sm: "8px",    // 살짝 둥글게
  md: "12px",   // 기본 둥글게
  lg: "16px",   // 많이 둥글게
  xl: "20px",   // 아주 많이 둥글게
  "2xl": "24px",
  full: "9999px", // 완전 둥글게 (원형, 알약형)
}
```

**사용 예시**:

```jsx
<TouchableOpacity className="rounded-lg bg-primary-500 px-lg py-md">
  <Text className="text-white">버튼</Text>
</TouchableOpacity>
```

### Typography (글꼴 크기 및 두께)

#### Font Size

```javascript
fontSize: {
  xs: ["12px", { lineHeight: "16px" }],   // 캡션, 작은 라벨
  sm: ["14px", { lineHeight: "20px" }],   // 본문 작은 글씨
  base: ["16px", { lineHeight: "24px" }], // 기본 본문
  lg: ["18px", { lineHeight: "28px" }],   // 강조 본문
  xl: ["20px", { lineHeight: "28px" }],   // 작은 제목
  "2xl": ["24px", { lineHeight: "32px" }], // 중간 제목
  "3xl": ["30px", { lineHeight: "36px" }], // 큰 제목
  "4xl": ["36px", { lineHeight: "40px" }], // 아주 큰 제목
  "5xl": ["48px", { lineHeight: "1" }],    // 히어로 타이틀
}
```

#### Font Weight

```javascript
fontWeight: {
  regular: "400",    // 일반 텍스트
  medium: "500",     // 약간 강조
  semibold: "600",   // 서브 헤딩
  bold: "700",       // 메인 헤딩
}
```

**사용 예시**:

```jsx
<Text className="text-2xl font-bold text-neutral-900">타임에그</Text>
<Text className="text-base font-regular text-neutral-600">
  추억을 저장하세요
</Text>
```

### Component Design Tokens

#### Button

```javascript
// Primary Button
<TouchableOpacity className="bg-primary-500 px-xl py-md rounded-lg active:bg-primary-600">
  <Text className="text-white text-base font-semibold text-center">
    타임캡슐 만들기
  </Text>
</TouchableOpacity>

// Secondary Button
<TouchableOpacity className="bg-secondary-500 px-xl py-md rounded-lg active:bg-secondary-600">
  <Text className="text-white text-base font-semibold text-center">
    공유하기
  </Text>
</TouchableOpacity>

// Outline Button
<TouchableOpacity className="border-2 border-primary-500 px-xl py-md rounded-lg active:bg-primary-50">
  <Text className="text-primary-500 text-base font-semibold text-center">
    취소
  </Text>
</TouchableOpacity>
```

#### Card

```javascript
<View className="bg-white rounded-xl p-lg shadow-md border border-neutral-200">
  <Text className="text-lg font-bold text-neutral-900">타임캡슐 제목</Text>
  <Text className="text-sm text-neutral-600 mt-sm">2025.12.25에 열립니다</Text>
</View>
```

#### Input

```javascript
<TextInput
  className="bg-neutral-50 border border-neutral-300 rounded-lg px-md py-sm text-base text-neutral-900"
  placeholder="타임캡슐 제목을 입력하세요"
  placeholderTextColor="#a3a3a3" // neutral-400
/>
```

---

## 7. 개발 규칙

### 코딩 컨벤션

#### 1. 컴포넌트 작성 규칙

```typescript
// ✅ 좋은 예: Arrow Function + TypeScript
import React from 'react';
import { View, Text } from 'react-native';

interface EggCardProps {
  title: string;
  openAt: Date;
  onPress: () => void;
}

export const EggCard: React.FC<EggCardProps> = ({ title, openAt, onPress }) => {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{openAt.toLocaleDateString()}</Text>
    </View>
  );
};

// ❌ 나쁜 예: function 키워드 사용
function EggCard({ title, openAt, onPress }) {
  // ...
}
```

#### 2. 인터페이스/타입 작성 규칙

```typescript
// ✅ 좋은 예: I 접두어 없이 작성
interface User {
  id: string;
  username: string;
  email: string;
}

type EggStatus = 'locked' | 'unlocked' | 'expired';

// ❌ 나쁜 예: I 접두어 사용
interface IUser {
  id: string;
}
```

#### 3. 파일 및 폴더 명명 규칙

```text
✅ 좋은 예:
- components/EggCard.tsx          (컴포넌트: PascalCase)
- hooks/useAuth.ts                (훅: camelCase, use 접두어)
- services/egg.service.ts         (서비스: camelCase, .service 접미어)
- types/egg.types.ts              (타입: camelCase, .types 접미어)
- constants/theme.ts              (상수: camelCase)

❌ 나쁜 예:
- components/egg-card.tsx         (케밥 케이스 X)
- hooks/Auth.ts                   (대문자 시작 X)
- services/EggService.ts          (PascalCase X)
```

#### 4. Import 순서 (자동 정렬)

ESLint에 의해 자동으로 정렬되지만, 수동 작성 시 참고:

```typescript
// 1. React 및 React Native Core
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Third-party Libraries
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

// 3. 절대 경로 Import (@/)
import { useAuth } from '@/hooks/useAuth';
import { EggCard } from '@/components/EggCard';

// 4. 상대 경로 Import (./)
import { styles } from './styles';
```

#### 5. Console.log 사용 규칙

```typescript
// ✅ 개발 환경에서만 출력
if (__DEV__) {
  console.log('User data:', user);
}

// ❌ 프로덕션에 console.log 남기지 않기
console.log('This will be removed before production');
```

#### 6. 비동기 함수 에러 처리

```typescript
// ✅ 좋은 예: try-catch로 에러 처리
const fetchUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

// ❌ 나쁜 예: 에러 처리 없음
const fetchUserData = async (userId: string) => {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data; // error가 발생해도 처리하지 않음
};
```

### Git 컨벤션

#### Commit Message 규칙

```bash
# 형식: <type>: <subject>
# 예시:

feat: 타임캡슐 생성 기능 구현
fix: 지도 마커 위치 오류 수정
ui: 로그인 화면 디자인 개선
refactor: useAuth 훅 로직 개선
chore: ESLint 규칙 업데이트
docs: README 환경 설정 가이드 추가
test: EggCard 컴포넌트 테스트 추가
perf: 지도 렌더링 성능 최적화
```

#### Type 종류

| Type     | 설명                              | 예시                                    |
| -------- | --------------------------------- | --------------------------------------- |
| feat     | 새로운 기능 추가                  | `feat: 타임캡슐 댓글 기능 추가`         |
| fix      | 버그 수정                         | `fix: 로그인 시 토큰 만료 오류 수정`    |
| ui       | UI/스타일 변경 (기능 변경 없음)   | `ui: 버튼 디자인 개선`                  |
| refactor | 코드 리팩토링 (기능 변경 없음)    | `refactor: API 호출 로직 통합`          |
| chore    | 빌드, 설정 파일 변경              | `chore: Tailwind 설정 업데이트`         |
| docs     | 문서 변경                         | `docs: 환경 설정 가이드 추가`           |
| test     | 테스트 코드 추가/수정             | `test: useAuth 훅 테스트 추가`          |
| perf     | 성능 개선                         | `perf: 이미지 로딩 최적화`              |
| style    | 코드 포맷팅 (세미콜론, 공백 등)   | `style: Prettier 적용`                  |
| build    | 빌드 시스템 또는 외부 의존성 변경 | `build: Expo SDK 54로 업그레이드`       |
| ci       | CI/CD 설정 변경                   | `ci: GitHub Actions 워크플로우 추가`    |
| revert   | 이전 커밋 되돌리기                | `revert: "feat: 댓글 기능 추가" 되돌림` |

#### Branch 전략 (예정)

```bash
main          # 프로덕션 브랜치 (배포용)
develop       # 개발 브랜치 (통합용)
feature/*     # 기능 개발 (예: feature/egg-creation)
fix/*         # 버그 수정 (예: fix/login-error)
refactor/*    # 리팩토링 (예: refactor/api-service)
```

---

## 8. 향후 개발 계획

### Phase 1: MVP (핵심 기능) - 목표: 2주

#### 백엔드 연동

- [ ] Supabase 프로젝트 생성 및 설정
- [ ] 환경 변수(.env) 설정
- [ ] Supabase 클라이언트 초기화
- [ ] Database Types 생성 (supabase gen types)

#### 인증 시스템

- [ ] Supabase Auth 연동
- [ ] 이메일/비밀번호 회원가입
- [ ] 이메일/비밀번호 로그인
- [ ] 소셜 로그인 (Google, Apple - 선택)
- [ ] useAuth 커스텀 훅 구현
- [ ] Auth Context Provider
- [ ] 로그인 상태에 따른 라우팅 분기 완성

#### 지도 기능

- [ ] 지도 라이브러리 선택 (react-native-maps 또는 대안)
- [ ] 지도 컴포넌트 구현
- [ ] expo-location 설정 (위치 권한)
- [ ] 내 현재 위치 표시
- [ ] 지도 이동 및 줌 기능
- [ ] 마커 표시 기능

#### 타임캡슐 생성

- [ ] 타임캡슐 생성 UI (BottomSheet 또는 Modal)
- [ ] 제목, 내용 입력
- [ ] 공개 시간 설정 (DateTimePicker)
- [ ] 현재 위치 또는 지도 클릭으로 위치 설정
- [ ] 감정 선택 (이모지 또는 아이콘)
- [ ] 이미지 첨부 (선택, expo-image-picker)
- [ ] Supabase에 타임캡슐 데이터 저장
- [ ] Supabase Storage에 이미지 업로드

#### 타임캡슐 조회

- [ ] 내 주변 타임캡슐 조회 (RPC 또는 PostGIS 쿼리)
- [ ] 지도에 타임캡슐 마커 표시
- [ ] 마커 클릭 시 미리보기 (제목, 공개 시간)
- [ ] 내가 만든 타임캡슐 목록 (프로필)

---

### Phase 2: 디테일 & 인터랙션 - 목표: 2주

#### 타임캡슐 열기 로직

- [ ] 시간 조건 체크 (open_at <= 현재 시간)
- [ ] 거리 조건 체크 (사용자와 타임캡슐 거리 <= unlock_radius)
- [ ] 조건 미충족 시 안내 메시지
- [ ] 조건 충족 시 타임캡슐 상세 보기
- [ ] 열람 기록 저장 (egg_opens 테이블)

#### 타임캡슐 상세 화면

- [ ] 전체 내용 표시 (제목, 본문, 이미지, 감정, 날짜)
- [ ] 이미지 갤러리 (여러 장일 경우 스와이프)
- [ ] 생성자 프로필 링크
- [ ] 공유 버튼 (링크 또는 스크린샷)
- [ ] 신고 기능 (선택)

#### 마이페이지

- [ ] 프로필 정보 표시 (아바타, 닉네임, 바이오)
- [ ] 프로필 편집 (닉네임, 아바타 업로드, 바이오)
- [ ] 내가 만든 타임캡슐 목록
- [ ] 내가 열어본 타임캡슐 목록
- [ ] 로그아웃 버튼

#### 소셜 기능 (기본)

- [ ] 댓글 기능 (comments 테이블)
- [ ] 댓글 작성, 조회, 삭제
- [ ] 좋아요 기능 (likes 테이블)
- [ ] 좋아요 추가/취소

---

### Phase 3: 고도화 & 배포 준비 - 목표: 2-3주

#### 푸시 알림

- [ ] Expo Push Notifications 설정
- [ ] 알림 권한 요청
- [ ] 타임캡슐 공개 시간 도래 시 알림
- [ ] 누군가 내 타임캡슐을 열었을 때 알림
- [ ] 댓글 달렸을 때 알림 (선택)

#### 친구 & 공유 기능

- [ ] 친구 맺기 시스템 (followings 테이블)
- [ ] 친구 목록 조회
- [ ] 친구에게만 공개되는 타임캡슐 (is_public 확장)
- [ ] 특정 친구 태그 기능

#### 추가 기능

- [ ] 타임캡슐 검색 (제목, 내용)
- [ ] 필터링 (감정별, 날짜별)
- [ ] 다크 모드 지원
- [ ] 앱 내 튜토리얼 (첫 실행 시)
- [ ] 설정 화면 확장 (알림 설정, 프라이버시 설정)

#### 앱 배포 준비

- [ ] 앱 아이콘 및 스플래시 화면 디자인
- [ ] iOS 빌드 설정 (EAS Build)
- [ ] Android 빌드 설정 (EAS Build)
- [ ] App Store 스크린샷 및 설명 작성
- [ ] Google Play Store 스크린샷 및 설명 작성
- [ ] 개인정보 처리방침 작성
- [ ] 이용약관 작성
- [ ] TestFlight 배포 (iOS)
- [ ] Google Play 내부 테스트 (Android)
- [ ] 정식 출시

#### 성능 최적화

- [ ] 이미지 로딩 최적화 (expo-image 캐싱)
- [ ] API 요청 캐싱 (React Query 도입 검토)
- [ ] 리스트 가상화 (FlatList 최적화)
- [ ] 번들 크기 최적화

#### 모니터링 & 분석

- [ ] Sentry 연동 (에러 추적)
- [ ] Google Analytics 또는 Mixpanel (사용자 분석)
- [ ] 성능 모니터링 (Expo Application Services)

---

### Phase 4: 장기 로드맵 (v2.0 이후)

- [ ] AR 기능 (카메라로 타임캡슐 찾기)
- [ ] 음성 메시지 지원
- [ ] 비디오 타임캡슐
- [ ] 그룹 타임캡슐 (여러 사람이 함께 생성)
- [ ] 타임캡슐 챌린지 (예: 1년 후 열기 챌린지)
- [ ] 웹 버전 (React Native Web)
- [ ] 타임캡슐 통계 대시보드

---

## 9. 참고 문서 및 리소스

### 공식 문서

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 공식 문서](https://reactnative.dev/docs/getting-started)
- [Supabase 공식 문서](https://supabase.com/docs)
- [NativeWind 공식 문서](https://www.nativewind.dev/)
- [React Navigation 공식 문서](https://reactnavigation.org/docs/getting-started)

### 프로젝트 내부 문서

- [환경 설정 가이드](./env-setup-guide.md)
- [컴포넌트 템플릿](./component-template.md)
- [기능 개발 템플릿](./feature-template.md)
- [패키지 관리 가이드](./package.md)

### 외부 참고 자료

- [PostGIS 지리적 쿼리 가이드](https://postgis.net/docs/manual-3.3/reference.html)
- [Expo Push Notifications 가이드](https://docs.expo.dev/push-notifications/overview/)
- [React Native Performance 최적화](https://reactnative.dev/docs/performance)

---

## 문서 이력

| 버전  | 날짜       | 작성자 | 변경 내용                                              |
| ----- | ---------- | ------ | ------------------------------------------------------ |
| 1.0.0 | 2025.12.15 | 지호   | 초기 문서 작성 (프로젝트 구조, 기술 스택, 로드맵 정리) |

---

## 문의 및 지원

프로젝트 관련 문의사항이나 제안사항이 있으시면 아래 연락처로 문의해주세요.

**작성자**: 지호  
**이메일**: [이메일 주소]  
**GitHub**: [GitHub 프로필]  
**작성일**: 2025.12.15

---

**TimeEgg** - 추억을 심고, 시간이 지나면 다시 만나는 특별한 경험 🥚⏰
