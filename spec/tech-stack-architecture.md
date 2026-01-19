# Feature: 기술 스택 및 아키텍처 분석

## Status  
✅ **COMPLETE** — 현재 프로젝트의 루트 구조와 `package.json`으로부터 기술 스택과 아키텍처를 정리함

## Overview  
TimeEgg 프로젝트는 위치 기반 타임캡슐 소셜 애플리케이션으로, React Native(Expo) 기반의 크로스 플랫폼 모바일 앱입니다. 프로젝트의 루트 폴더 구조와 `package.json`의 키 필드들을 분석하여, 사용 중인 개발 언어, 라이브러리, 프레임워크, 빌드 및 테스트 도구, 의존성 관리, 배포 환경 등을 정리하고, 전체 시스템의 아키텍처(프론트엔드 구조, 모듈 구조, 데이터 흐름 등)의 개요를 문서화함.

## Current Technology Stack

### 프로그래밍 언어 및 런타임
- **TypeScript 5.9.2**: 정적 타입 검사 및 타입 안정성
- **JavaScript (ES6+)**: 런타임 언어
- **Node.js 18+**: 개발 환경 런타임

### 프레임워크 및 코어 라이브러리
- **Expo SDK ~54.0.31**: React Native 개발 플랫폼
- **React 19.1.0**: UI 라이브러리
- **React Native 0.81.5**: 네이티브 모바일 앱 프레임워크
- **Expo Router ~6.0.21**: 파일 기반 라우팅 시스템

### 네비게이션
- **@react-navigation/native ^7.1.8**: 네비게이션 코어
- **@react-navigation/bottom-tabs ^7.4.0**: 하단 탭 네비게이션
- **@react-navigation/elements ^2.6.3**: 네비게이션 요소
- **react-native-screens ~4.16.0**: 네이티브 화면 관리
- **react-native-safe-area-context ~5.6.0**: Safe Area 처리

### 스타일링 및 애니메이션
- **NativeWind ^4.2.1**: Tailwind CSS for React Native
- **Tailwind CSS ^3.4.19**: 유틸리티 우선 CSS 프레임워크
- **react-native-reanimated ~4.1.1**: 고성능 애니메이션
- **react-native-gesture-handler ~2.28.0**: 제스처 처리
- **react-native-worklets 0.5.1**: 워크릿 지원

### 상태 관리 및 데이터 페칭
- **@tanstack/react-query ^5.90.12**: 서버 상태 관리 및 캐싱
- **axios ^1.13.2**: HTTP 클라이언트
- **@react-native-async-storage/async-storage ^2.2.0**: 로컬 스토리지

### 폼 관리
- **react-hook-form ^7.68.0**: 폼 상태 관리 및 검증

### UI/UX 라이브러리
- **@expo/vector-icons ^15.0.3**: 벡터 아이콘
- **react-native-remix-icon ^4.7.0**: Remix Icon 세트
- **react-native-svg 15.12.1**: SVG 렌더링
- **react-native-calendars ^1.1313.0**: 캘린더 컴포넌트
- **react-native-webview 13.15.0**: 웹뷰 컴포넌트
- **expo-haptics ~15.0.8**: 햅틱 피드백
- **expo-image ~3.0.11**: 이미지 최적화

### 미디어 및 파일 관리
- **expo-image-picker ^17.0.10**: 이미지 선택
- **expo-document-picker ^14.0.8**: 문서/파일 선택
- **expo-video ^3.0.15**: 비디오 재생
- **expo-video-thumbnails ^10.0.8**: 동영상 썸네일 생성
- **expo-audio ~1.1.1**: 오디오 재생
- **expo-image-manipulator ^14.0.8**: 이미지 조작
- **expo-file-system ^19.0.21**: 파일 시스템 접근
- **vmsg ^0.4.0**: 음성 녹음

### 위치 및 권한
- **expo-location ^19.0.8**: 위치 권한 및 현재 위치

### 결제
- **@tosspayments/payment-sdk-react-native ^0.0.1-alpha001**: 토스페이먼츠 결제 SDK

### 알림
- **expo-notifications ~0.32.16**: 푸시 알림

### 유틸리티
- **dayjs ^1.11.19**: 날짜/시간 처리
- **expo-constants ~18.0.12**: 앱 상수 접근
- **expo-linking ~8.0.11**: 딥링크 처리
- **expo-web-browser ~15.0.10**: 웹 브라우저 열기
- **expo-splash-screen ~31.0.13**: 스플래시 스크린
- **expo-status-bar ~3.0.9**: 상태바 제어
- **expo-system-ui ~6.0.9**: 시스템 UI 제어
- **expo-font ~14.0.10**: 커스텀 폰트
- **expo-symbols ~1.0.8**: 심볼 아이콘

### 빌드 및 패키지 매니저
- **npm**: 패키지 매니저
- **Metro Bundler**: React Native 번들러 (Expo 기본)
- **Expo Build**: 빌드 시스템

### 개발 도구
- **TypeScript ~5.9.2**: 타입 체커
- **ESLint ^9.25.0**: 린터
- **eslint-config-expo ~10.0.0**: Expo ESLint 설정
- **babel-plugin-module-resolver ^5.0.2**: 모듈 경로 별칭
- **ts-node ^10.9.2**: TypeScript 실행 환경

### 환경 설정
- **TypeScript 설정**: `tsconfig.json`에서 strict 모드 활성화, 경로 별칭 `@/*` 설정
- **환경 변수**: `.env` 파일을 통한 `EXPO_PUBLIC_*` 변수 관리
- **앱 설정**: `app.config.js`에서 Expo 앱 설정 관리

## Architecture Pattern

### Feature-Sliced Architecture (Feature Slice Architecture)
프로젝트는 **Feature-Sliced Architecture**를 따르며, 다음과 같은 계층 구조를 가집니다:

```
app/                  # [Routing Layer] URL & Navigation ONLY
components/           # [Features] Business Logic & "Smart" Containers
commons/              # [Design System] Reusable "Dumb" UI components
utils/                # [Pure Functions] Helper functions
```

### 계층별 역할

#### 1. `app/` (Routing Layer)
- **역할**: Expo Router 기반 파일 라우팅 및 레이아웃 관리
- **구조**:
  - `(auth)/`: 인증 관련 라우트 그룹
  - `(tabs)/`: 탭 네비게이션 라우트 그룹
  - `api/`: API 라우트 핸들러
- **규칙**: 비즈니스 로직, `useEffect`, API 호출 금지

#### 2. `components/` (Feature Layer)
- **역할**: 비즈니스 로직을 포함한 기능 단위 컨테이너
- **구조**:
  ```
  components/{feature}/
    ├── index.tsx          # Feature Container (Controller)
    ├── types.ts           # Feature-wide Types
    ├── styles.ts          # Feature Styles
    ├── hooks/             # Business Logic (Custom Hooks)
    └── components/        # Feature-specific Sub-components
  ```
- **예시**: `map/`, `mypage/`, `timecapsule-create/`, `toss-payments/`

#### 3. `commons/` (Design System Layer)
- **역할**: 순수 UI 컴포넌트 및 디자인 토큰
- **구조**:
  - `layout/`: 전역 레이아웃 및 Provider
  - `components/`: 재사용 가능한 UI 컴포넌트 (Button, Modal, BottomSheet 등)
  - `constants/`: 디자인 토큰 (Colors, Spacing, Typography, BorderRadius 등)
  - `hooks/`: 공통 훅 (useMediaUpload, useMapGestures 등)
- **규칙**: 비즈니스 로직 금지, Props로 데이터와 액션만 받음

#### 4. `utils/` (Pure Functions Layer)
- **역할**: React/App 상태와 무관한 순수 함수
- **구조**: API 클라이언트, 인증 유틸, 포맷팅 함수 등
- **규칙**: React 훅이나 JSX 사용 금지

### 데이터 흐름

1. **인증 흐름**:
   - `AuthProvider` (commons/layout/provider/auth/)에서 전역 인증 상태 관리
   - JWT 토큰을 AsyncStorage에 저장
   - `apiClient` 인터셉터에서 자동으로 Authorization 헤더 추가
   - 401 에러 시 자동 로그아웃 및 리다이렉트

2. **API 호출 흐름**:
   - Feature Container에서 `useQuery`/`useMutation` 사용
   - `apiClient`를 통해 백엔드 API 호출
   - React Query가 캐싱 및 상태 관리

3. **라우팅 흐름**:
   - Expo Router의 파일 기반 라우팅
   - `AuthProvider`에서 인증 상태에 따른 자동 리다이렉트
   - 딥링크를 통한 외부 앱 연동 (카카오 로그인 등)

### 디자인 시스템

- **색상**: `commons/constants/color.ts`에서 중앙 관리
- **간격**: `commons/constants/spacing.ts`에서 중앙 관리
- **타이포그래피**: `commons/constants/typography.ts`에서 중앙 관리
- **Border Radius**: `commons/constants/borderRadius.ts`에서 중앙 관리
- **폰트**: Pretendard, DungGeunMo (assets/fonts/)
- **Tailwind 통합**: `tailwind.config.js`에서 디자인 토큰을 Tailwind 테마로 변환

## Functional Requirements

- 현재 프로젝트는 React Native(Expo) 기반의 모바일 애플리케이션으로, iOS, Android, Web 플랫폼을 지원함
- `package.json`의 `dependencies`와 `devDependencies`에 명시된 라이브러리들이 기술 스택을 구성함
- Feature-Sliced Architecture를 통해 관심사 분리 및 재사용성을 확보함
- Expo Router를 통한 파일 기반 라우팅으로 코드 스플리팅 및 성능 최적화

## Non-Functional Requirements

### 성능
- 번들 크기 최소화: 필요한 라이브러리만 선택적으로 사용
- 이미지 최적화: `expo-image`를 통한 자동 최적화
- 애니메이션 성능: `react-native-reanimated`를 통한 네이티브 스레드 애니메이션
- API 응답 캐싱: React Query를 통한 자동 캐싱

### 보안
- JWT 토큰 기반 인증: AsyncStorage에 안전하게 저장
- API 클라이언트 인터셉터: 자동 인증 헤더 추가 및 401 처리
- 환경 변수 관리: `.env` 파일을 통한 민감 정보 분리
- 입력 검증: `react-hook-form`을 통한 클라이언트 사이드 검증

### 유지보수성
- TypeScript: 타입 안정성으로 런타임 에러 방지
- 모듈화된 폴더 구조: Feature-Sliced Architecture로 기능별 분리
- 디자인 토큰 중앙 관리: 일관된 스타일링
- ESLint: 코드 품질 유지

### 확장성
- Feature 단위 구조: 새로운 기능 추가 시 독립적인 폴더로 확장 가능
- 컴포넌트 재사용성: `commons/` 레이어를 통한 공통 컴포넌트 활용
- 플러그인 시스템: Expo 플러그인을 통한 기능 확장

### 크로스 플랫폼 지원
- Expo: iOS, Android, Web 동시 지원
- 네이티브 모듈: Expo SDK를 통한 네이티브 기능 접근
- 반응형 디자인: Safe Area Context를 통한 다양한 화면 크기 대응

## Acceptance Criteria

- [x] 모든 주요 기술 (언어, 프레임워크, 라이브러리, 빌드 도구, 테스트 도구 등)이 목록화됨
- [x] 아키텍처 구조 및 데이터 흐름 설명 포함됨
- [x] 비기능적 요구사항 (성능, 보안, 유지보수성, 확장성 등) 명시됨
- [x] 팀/새로운 개발자가 보고 프로젝트 기술 스택 이해 가능함
- [x] Feature-Sliced Architecture 패턴이 명확히 문서화됨

## Related Documents

- [README.md](../README.md): 프로젝트 개요 및 시작 가이드
- [doc/v.1.0/folder-structure.md](../doc/v.1.0/folder-structure.md): 상세 폴더 구조 설명
- [doc/v.1.0/package.md](../doc/v.1.0/package.md): 패키지 관리 가이드
