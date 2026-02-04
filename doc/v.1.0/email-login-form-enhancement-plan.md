# 이메일 로그인 폼 개선 기술 계획서

## 개요

이 문서는 이메일 로그인/회원가입 폼의 검증 규칙 강화, UX/UI 개선, React Hook Form 및 Zod 통합을 위한 기술 계획서입니다.

**작성일**: 2025-01-XX  
**대상 컴포넌트**: `components/onboarding/components/login-step/email-login/`  
**관련 파일**: 
- `components/onboarding/components/login-step/email-login/index.tsx`
- `components/onboarding/components/login-step/email-login/styles.ts`
- `components/onboarding/hooks/useEmailLogin.ts`

---

## 1. 기술 컨텍스트 (Technical Context)

### 1.1 현재 상태 분석

#### 현재 구현 방식
- **폼 관리**: `useState` 기반 상태 관리
- **검증**: `useEmailLogin` 훅 내부에서 Alert 기반 검증
- **에러 처리**: Alert.alert로 모달 표시
- **스타일링**: StyleSheet.create() 사용, NativeWind 미사용

#### 주요 문제점
1. 실시간 검증 부재: 제출 시점에만 검증
2. 에러 메시지 표시 방식: Alert 모달로만 표시 (UX 저하)
3. 비밀번호 토글 기능 없음
4. 약관 동의 기능 없음
5. 폼 상태 관리가 비효율적 (여러 useState 사용)

### 1.2 기술 스택 결정

#### 필수 라이브러리
- **react-hook-form**: `^7.68.0` (이미 설치됨)
- **zod**: `^3.22.0` (신규 설치 필요)
  - TypeScript와의 완벽한 통합
  - 타입 안전성 보장
  - React Hook Form과 공식 통합 지원 (`@hookform/resolvers`)

#### 선택 고려사항
- **@hookform/resolvers**: `^3.3.0` (신규 설치 필요)
  - Zod 스키마를 React Hook Form과 통합

#### 스타일링
- **NativeWind**: 이미 설치되어 있으나 현재 컴포넌트에서는 미사용
- **StyleSheet**: 현재 사용 중인 방식 유지 (프로젝트 규칙 준수)

### 1.3 아키텍처 결정

#### 폴더 구조
```
components/onboarding/components/login-step/email-login/
├── index.tsx              # 메인 컴포넌트 (React Hook Form 통합)
├── styles.ts              # 스타일 정의 (기존 유지)
├── types.ts               # 타입 정의 (신규 생성)
├── schemas.ts             # Zod 스키마 정의 (신규 생성)
└── components/            # 서브 컴포넌트 (신규 생성)
    ├── password-input/    # 비밀번호 입력 필드 (토글 기능 포함)
    ├── error-message/     # 에러 메시지 표시 컴포넌트
    └── terms-consent/     # 약관 동의 컴포넌트
```

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 입력 필드 검증 규칙

#### 이메일 검증
- **규칙**: `@`와 `.`이 포함된 유효한 형식
- **정규표현식**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **검증 시점**: `onBlur` 또는 `onChange` (실시간)
- **에러 메시지**: "올바른 이메일 형식을 입력해주세요"

#### 비밀번호 검증
- **규칙**: 영문, 숫자, 특수문자를 포함하여 최소 8자 이상
- **정규표현식**: `/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/`
- **검증 시점**: `onBlur` 또는 `onChange` (실시간)
- **에러 메시지**: "영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요"

#### 전화번호 검증
- **규칙**: 숫자만 허용, 하이픈(-)은 저장 시 자동 제거
- **키보드 타입**: `numeric` (모바일에서 숫자 키패드 표시)
- **검증 시점**: `onBlur` 또는 `onChange` (실시간)
- **에러 메시지**: "올바른 전화번호 형식을 입력해주세요 (예: 01012345678)"
- **저장 형식**: 하이픈 제거 후 11자리 숫자 (`01[0-9]{9}`)

### 2.2 UX/UI 상세 요구사항

#### 에러 메시지 표시
- **위치**: 각 입력창 하단에 붉은색 글씨로 표시
- **표시 시점**: `onBlur` 또는 `onChange` (실시간)
- **스타일**: 
  - 색상: `Colors.red[500]` (토큰 사용)
  - 폰트: `Typography.body.body6` (14px, Regular)
  - 간격: 입력창과 4px 간격

#### 비밀번호 보이기/숨기기 토글
- **위치**: 비밀번호 입력창 우측
- **아이콘**: `react-native-remix-icon` 사용
  - 숨김: `eye-off-line`
  - 표시: `eye-line`
- **동작**: 클릭 시 `secureTextEntry` 토글

#### 약관 동의
- **필수 약관**: 
  - 서비스 이용약관 (필수)
  - 개인정보 처리방침 (필수)
- **선택 약관**: 
  - 마케팅 정보 수신 동의 (선택)
- **UI**: 체크박스 형태
- **검증**: 모든 필수 약관 동의 시에만 가입하기 버튼 활성화

#### 가입하기 버튼 활성화 조건
- 모든 필수 입력 필드 검증 통과
- 모든 필수 약관 동의 완료
- `formState.isValid` 활용

### 2.3 API 연동

#### onSubmit 핸들러 구조
```typescript
const onSubmit = async (data: FormData) => {
  // 1. 전화번호 하이픈 제거
  const cleanPhoneNumber = data.phoneNumber.replace(/-/g, '');
  
  // 2. API 호출 (기존 useEmailLogin 훅 사용)
  const result = await signupWithEmail({
    nickname: data.name,
    phoneNumber: cleanPhoneNumber,
    password: data.password,
    email: data.email || undefined,
  });
  
  // 3. 성공 처리
  if (result && result.token) {
    // 성공 로직
  }
};
```

---

## 3. 구현 계획 (Implementation Plan)

### 3.1 Phase 0: 의존성 설치 및 설정

#### 작업 목록
1. **Zod 설치**
   ```bash
   npm install zod@^3.22.0
   ```

2. **@hookform/resolvers 설치**
   ```bash
   npm install @hookform/resolvers@^3.3.0
   ```

3. **package.md 업데이트**
   - Zod 추가 (폼 검증 라이브러리)
   - @hookform/resolvers 추가 (React Hook Form과 Zod 통합)

### 3.2 Phase 1: 타입 및 스키마 정의

#### 3.2.1 types.ts 생성
```typescript
// 로그인 폼 데이터 타입
export interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

// 회원가입 폼 데이터 타입
export interface SignupFormData {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  confirmPassword: string;
  termsConsent: {
    service: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}
```

#### 3.2.2 schemas.ts 생성
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 로그인 스키마
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, '이메일 또는 전화번호를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

// 회원가입 스키마
export const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phoneNumber: z.string()
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식을 입력해주세요 (예: 01012345678)')
    .transform((val) => val.replace(/-/g, '')),
  email: z.string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: '올바른 이메일 형식을 입력해주세요',
    }),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요',
    }),
  confirmPassword: z.string(),
  termsConsent: z.object({
    service: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관에 동의해주세요',
    }),
    privacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요',
    }),
    marketing: z.boolean().optional(),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});
```

### 3.3 Phase 2: 컴포넌트 리팩토링

#### 3.3.1 메인 컴포넌트 (index.tsx) 리팩토링

**변경 사항**:
1. `useState` → `useForm` (React Hook Form) 마이그레이션
2. `Controller` 컴포넌트로 입력 필드 래핑
3. 실시간 검증 활성화 (`mode: 'onChange'`)
4. 에러 메시지 표시 로직 추가
5. 약관 동의 상태 관리 추가

**주요 코드 구조**:
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from './schemas';

export function EmailLogin({ ... }) {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsConsent: {
        service: false,
        privacy: false,
        marketing: false,
      },
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    // API 호출 로직
  };

  return (
    // JSX 구조
  );
}
```

#### 3.3.2 서브 컴포넌트 생성

**PasswordInput 컴포넌트**
- 위치: `components/password-input/index.tsx`
- 기능: 비밀번호 입력 + 토글 기능
- Props: `control`, `name`, `placeholder`, `error`

**ErrorMessage 컴포넌트**
- 위치: `components/error-message/index.tsx`
- 기능: 에러 메시지 표시
- Props: `message`

**TermsConsent 컴포넌트**
- 위치: `components/terms-consent/index.tsx`
- 기능: 약관 동의 체크박스
- Props: `control`, `errors`

### 3.4 Phase 3: 스타일 업데이트

#### 3.4.1 styles.ts 업데이트

**추가 스타일**:
- `errorMessage`: 에러 메시지 스타일
- `passwordInputContainer`: 비밀번호 입력 컨테이너 (토글 버튼 포함)
- `toggleButton`: 비밀번호 토글 버튼
- `termsContainer`: 약관 동의 컨테이너
- `termsItem`: 약관 항목
- `checkbox`: 체크박스 스타일

**기존 스타일 유지**: 모든 기존 스타일은 그대로 유지

### 3.5 Phase 4: 통합 및 테스트

#### 4.1 통합 체크리스트
- [ ] React Hook Form과 Zod 스키마 통합 확인
- [ ] 실시간 검증 동작 확인
- [ ] 에러 메시지 표시 확인
- [ ] 비밀번호 토글 기능 확인
- [ ] 약관 동의 기능 확인
- [ ] 가입하기 버튼 활성화 조건 확인
- [ ] API 연동 확인
- [ ] 기존 기능 유지 확인 (로그인/회원가입 전환)

#### 4.2 테스트 시나리오
1. **이메일 검증 테스트**
   - 유효한 이메일: `test@example.com` ✅
   - 유효하지 않은 이메일: `test@` ❌
   - 유효하지 않은 이메일: `test.example.com` ❌

2. **비밀번호 검증 테스트**
   - 유효한 비밀번호: `Test1234!` ✅
   - 너무 짧은 비밀번호: `Test1!` ❌
   - 영문 없음: `12345678!` ❌
   - 숫자 없음: `TestTest!` ❌
   - 특수문자 없음: `Test1234` ❌

3. **전화번호 검증 테스트**
   - 유효한 전화번호: `01012345678` ✅
   - 하이픈 포함: `010-1234-5678` ✅ (저장 시 제거)
   - 유효하지 않은 전화번호: `1234567890` ❌

4. **약관 동의 테스트**
   - 필수 약관 미동의 시 가입하기 버튼 비활성화
   - 모든 필수 약관 동의 시 가입하기 버튼 활성화

---

## 4. 프로젝트 규칙 준수 (Constitution Check)

### 4.1 아키텍처 규칙
- ✅ **Feature Slice Architecture**: `components/onboarding/` 구조 유지
- ✅ **폴더 구조**: `components/`, `hooks/`, `types/` 분리
- ✅ **의존성 방향**: `app` → `components` → `commons/utils` 준수

### 4.2 스타일 규칙
- ✅ **StyleSheet 사용**: `StyleSheet.create()` 사용
- ✅ **인라인 스타일 금지**: 모든 스타일은 `styles.ts`에 정의
- ✅ **색상 토큰 사용**: `Colors.red[500]` 등 토큰 사용
- ✅ **Typography 토큰 사용**: `Typography.body.body6` 등 토큰 사용
- ✅ **BorderRadius 토큰 사용**: `BorderRadius.md` 등 토큰 사용
- ✅ **flexbox만 사용**: `position-absolute` 제거

### 4.3 라이브러리 규칙
- ✅ **외부 라이브러리 문서화**: `package.md` 업데이트 필수
- ✅ **기존 라이브러리 활용**: `react-hook-form` 이미 설치됨
- ✅ **신규 라이브러리**: Zod, @hookform/resolvers 추가

### 4.4 코드 품질 규칙
- ✅ **타입 안전성**: TypeScript + Zod 스키마로 이중 보장
- ✅ **에러 처리**: 명확한 에러 메시지 제공
- ✅ **재사용성**: 서브 컴포넌트 분리

---

## 5. 위험 요소 및 대응 방안 (Risks & Mitigation)

### 5.1 위험 요소

#### 위험 1: 기존 기능 호환성
- **위험도**: 중
- **설명**: `useState` → `useForm` 마이그레이션 시 기존 로직과의 호환성 문제
- **대응**: 점진적 마이그레이션, 기존 로직 보존

#### 위험 2: Zod 스키마 복잡도
- **위험도**: 낮
- **설명**: 복잡한 검증 규칙으로 인한 스키마 복잡도 증가
- **대응**: 단계적 스키마 작성, 테스트 코드 작성

#### 위험 3: 성능 영향
- **위험도**: 낮
- **설명**: 실시간 검증(`onChange`)으로 인한 성능 저하 가능성
- **대응**: React Hook Form의 최적화된 리렌더링 활용

### 5.2 대응 방안

1. **점진적 마이그레이션**: 기존 코드를 단계적으로 교체
2. **충분한 테스트**: 각 단계별 테스트 수행
3. **롤백 계획**: 문제 발생 시 기존 코드로 복구 가능하도록 준비

---

## 6. 일정 및 마일스톤 (Timeline & Milestones)

### Milestone 1: 의존성 설치 (1일)
- [ ] Zod 설치
- [ ] @hookform/resolvers 설치
- [ ] package.md 업데이트

### Milestone 2: 타입 및 스키마 정의 (1일)
- [ ] types.ts 생성
- [ ] schemas.ts 생성
- [ ] 타입 검증 완료

### Milestone 3: 컴포넌트 리팩토링 (2일)
- [ ] 메인 컴포넌트 리팩토링
- [ ] 서브 컴포넌트 생성
- [ ] 통합 테스트

### Milestone 4: 스타일 및 최종 검증 (1일)
- [ ] 스타일 업데이트
- [ ] 최종 통합 테스트
- [ ] 문서화 완료

**총 예상 기간**: 5일

---

## 7. 참고 자료 (References)

### 7.1 공식 문서
- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 공식 문서](https://zod.dev/)
- [@hookform/resolvers 공식 문서](https://github.com/react-hook-form/resolvers)

### 7.2 프로젝트 내 참고 코드
- `components/timecapsule-create/components/step-info/index.tsx` (React Hook Form 사용 예시)
- `components/timecapsule-create/components/write-bottomsheet/index.tsx` (React Hook Form 사용 예시)

---

## 8. 승인 및 검토 (Approval & Review)

### 검토 항목
- [ ] 기술 스택 선택 적절성
- [ ] 아키텍처 규칙 준수 여부
- [ ] 구현 계획의 실현 가능성
- [ ] 위험 요소 대응 방안 적절성

### 승인자
- [ ] 개발자 리뷰
- [ ] 기술 리더 승인

---

**문서 버전**: 1.0.0  
**최종 수정일**: 2025-01-XX  
**작성자**: AI Assistant (Cursor)
