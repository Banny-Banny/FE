/**
 * components/onboarding/components/login-step/email-login/schemas.ts
 * Zod 스키마 정의 (이메일 로그인/회원가입 폼 검증)
 */

import { z } from 'zod';

/**
 * 로그인 스키마
 * - 이메일 또는 전화번호로 로그인 가능
 * - 비밀번호 필수
 */
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, '이메일 또는 전화번호를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

/**
 * 회원가입 스키마
 * - 이름: 필수, 최소 1자
 * - 전화번호: 필수, 01로 시작하는 11자리 숫자 (하이픈 자동 제거)
 * - 이메일: 선택사항, 입력 시 유효한 이메일 형식 검증
 * - 비밀번호: 필수, 영문/숫자/특수문자 포함, 최소 8자
 * - 비밀번호 확인: 비밀번호와 일치해야 함
 * - 약관 동의: 서비스 이용약관, 개인정보 처리방침 필수, 마케팅 정보 수신 선택
 */
export const signupSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    phoneNumber: z
      .string()
      .min(1, '전화번호를 입력해주세요')
      .transform((val) => val.replace(/-/g, '')) // 하이픈 자동 제거
      .pipe(z.string().regex(/^01[0-9]{9}$/, '올바른 전화번호 형식을 입력해주세요 (예: 01012345678)')),
    email: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        {
          message: '올바른 이메일 형식을 입력해주세요',
        }
      ),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요',
      }),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    termsConsent: z.object({
      service: z.boolean().refine((val) => val === true, {
        message: '서비스 이용약관에 동의해주세요',
      }),
      privacy: z.boolean().refine((val) => val === true, {
        message: '개인정보 처리방침에 동의해주세요',
      }),
      marketing: z.boolean().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

/**
 * 스키마에서 추론된 타입
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
