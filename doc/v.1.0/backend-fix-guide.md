# 백엔드 수정 가이드: 카카오 OAuth 리다이렉트 URL 처리

## 문제 상황

현재 백엔드가 카카오 OAuth 콜백 후 고정된 URL(`/api/auth/kakao/callback`)로 리다이렉트하고 있어, 프론트엔드 라우트와 불일치가 발생합니다.

### 현재 동작
1. 프론트엔드: `GET /api/auth/kakao?redirect_uri=http://localhost:8081/auth/callback` 요청
2. 백엔드: 카카오 OAuth 인증 후 `/api/auth/kakao/callback?token=...&isNewUser=...`로 리다이렉트
3. 문제: 프론트엔드에 `/api/auth/kakao/callback` 라우트가 없어 404 에러 발생

### 기대 동작
1. 프론트엔드: `GET /api/auth/kakao?redirect_uri=http://localhost:8081/auth/callback` 요청
2. 백엔드: 카카오 OAuth 인증 후 프론트엔드가 전달한 `redirect_uri`로 리다이렉트
3. 결과: 프론트엔드의 `/auth/callback` 라우트로 정상 리다이렉트

---

## 수정 방법

### 1. `/api/auth/kakao` 엔드포인트 수정

**현재 코드 (예상):**
```typescript
@Get('kakao')
async kakaoLogin() {
  // 카카오 OAuth URL 생성
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?...`;
  
  // 카카오로 리다이렉트
  return res.redirect(kakaoAuthUrl);
}
```

**수정 후 코드:**
```typescript
@Get('kakao')
async kakaoLogin(
  @Query('redirect_uri') redirectUri?: string,
  @Res() res: Response,
) {
  // redirect_uri 파라미터 받기
  // 웹: http://localhost:8081/auth/callback
  // 모바일: timeegg://auth/callback
  
  // 카카오 OAuth URL 생성 시 redirect_uri 전달
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri || DEFAULT_REDIRECT_URI)}&response_type=code`;
  
  // 카카오로 리다이렉트
  return res.redirect(kakaoAuthUrl);
}
```

### 2. 카카오 OAuth 콜백 처리 수정

**현재 코드 (예상):**
```typescript
@Get('kakao/callback')
async kakaoCallback(
  @Query('code') code: string,
  @Res() res: Response,
) {
  // 카카오에서 받은 code로 토큰 발급
  const token = await this.authService.getKakaoToken(code);
  
  // 고정된 URL로 리다이렉트
  return res.redirect(`/api/auth/kakao/callback?token=${token}&isNewUser=${isNewUser}`);
}
```

**수정 후 코드:**
```typescript
@Get('kakao/callback')
async kakaoCallback(
  @Query('code') code: string,
  @Query('state') state?: string, // redirect_uri를 state로 전달
  @Res() res: Response,
) {
  // 카카오에서 받은 code로 토큰 발급
  const { token, isNewUser } = await this.authService.getKakaoToken(code);
  
  // state에서 원래 redirect_uri 복원
  const redirectUri = state ? decodeURIComponent(state) : DEFAULT_REDIRECT_URI;
  
  // 프론트엔드가 요청한 redirect_uri로 리다이렉트
  return res.redirect(`${redirectUri}?token=${token}&isNewUser=${isNewUser}`);
}
```

### 3. 카카오 OAuth URL 생성 시 state 파라미터 추가

**수정 후 코드:**
```typescript
@Get('kakao')
async kakaoLogin(
  @Query('redirect_uri') redirectUri?: string,
  @Res() res: Response,
) {
  const finalRedirectUri = redirectUri || DEFAULT_REDIRECT_URI;
  
  // redirect_uri를 state로 전달 (카카오 OAuth 표준 방식)
  const state = encodeURIComponent(finalRedirectUri);
  
  // 카카오 OAuth URL 생성
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(BACKEND_CALLBACK_URL)}&response_type=code&state=${state}`;
  
  // 카카오로 리다이렉트
  return res.redirect(kakaoAuthUrl);
}
```

---

## 상세 구현 예시 (NestJS 기준)

### AuthController 수정

```typescript
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  async kakaoLogin(
    @Query('redirect_uri') redirectUri?: string,
    @Res() res: Response,
  ) {
    // 기본 redirect_uri 설정 (fallback)
    const DEFAULT_REDIRECT_URI = 'http://localhost:8081/auth/callback';
    const finalRedirectUri = redirectUri || DEFAULT_REDIRECT_URI;
    
    // redirect_uri를 state로 전달 (카카오 OAuth 표준)
    const state = encodeURIComponent(finalRedirectUri);
    
    // 백엔드 콜백 URL (카카오에 등록된 redirect_uri)
    const BACKEND_CALLBACK_URL = `${process.env.API_BASE_URL}/api/auth/kakao/callback`;
    
    // 카카오 OAuth URL 생성
    const kakaoAuthUrl = this.authService.buildKakaoAuthUrl({
      redirectUri: BACKEND_CALLBACK_URL,
      state,
    });
    
    // 카카오로 리다이렉트
    return res.redirect(kakaoAuthUrl);
  }

  @Get('kakao/callback')
  async kakaoCallback(
    @Query('code') code: string,
    @Query('state') state?: string,
    @Res() res: Response,
  ) {
    try {
      // 카카오에서 받은 code로 토큰 발급
      const { token, isNewUser } = await this.authService.handleKakaoCallback(code);
      
      // state에서 원래 redirect_uri 복원
      const DEFAULT_REDIRECT_URI = 'http://localhost:8081/auth/callback';
      const redirectUri = state ? decodeURIComponent(state) : DEFAULT_REDIRECT_URI;
      
      // 프론트엔드가 요청한 redirect_uri로 리다이렉트
      return res.redirect(`${redirectUri}?token=${token}&isNewUser=${isNewUser}`);
    } catch (error) {
      // 에러 처리
      const redirectUri = state ? decodeURIComponent(state) : 'http://localhost:8081/auth/callback';
      return res.redirect(`${redirectUri}?error=${encodeURIComponent(error.message)}`);
    }
  }
}
```

---

## 프론트엔드 요청 형식

### 웹 환경
```
GET /api/auth/kakao?redirect_uri=http://localhost:8081/auth/callback
```

### 모바일 환경
```
GET /api/auth/kakao?redirect_uri=timeegg://auth/callback
```

---

## 보안 고려사항

1. **redirect_uri 검증**: 허용된 도메인만 리다이렉트하도록 화이트리스트 검증
   ```typescript
   const ALLOWED_REDIRECT_URIS = [
     'http://localhost:8081',
     'https://timeegg.com',
     'timeegg://',
   ];
   
   const isValidRedirectUri = (uri: string) => {
     return ALLOWED_REDIRECT_URIS.some(allowed => uri.startsWith(allowed));
   };
   ```

2. **state 파라미터 검증**: CSRF 공격 방지를 위해 state 값 검증

---

## 테스트 방법

1. **웹 환경 테스트**
   ```bash
   curl "http://localhost:3000/api/auth/kakao?redirect_uri=http://localhost:8081/auth/callback"
   ```
   - 카카오 로그인 후 `http://localhost:8081/auth/callback?token=...&isNewUser=...`로 리다이렉트되어야 함

2. **모바일 환경 테스트**
   ```bash
   curl "http://localhost:3000/api/auth/kakao?redirect_uri=timeegg://auth/callback"
   ```
   - 카카오 로그인 후 `timeegg://auth/callback?token=...&isNewUser=...`로 리다이렉트되어야 함

---

## 참고사항

- 현재 프론트엔드에는 임시 해결책으로 `/app/api/auth/kakao/callback.tsx` 라우트가 추가되어 있습니다.
- 백엔드 수정이 완료되면 해당 임시 라우트는 제거해야 합니다.
- 카카오 OAuth의 `state` 파라미터는 CSRF 방지와 함께 추가 데이터 전달 용도로 사용할 수 있습니다.

