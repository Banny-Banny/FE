/**
 * step-payment/hooks/usePaymentValidation.ts
 * 생성 시각: 2024-12-16
 * 결제 화면 약관 동의 및 검증 Hook
 */

import { useState, useCallback, useMemo } from 'react';
import { AgreementsState } from '../types';

// ============================================
// Hook 반환 타입
// ============================================

interface UsePaymentValidationReturn {
  /** 전체 동의 상태 */
  allAgreed: boolean;
  /** 개별 약관 동의 상태 */
  agreements: AgreementsState;
  /** 결제 버튼 활성화 여부 */
  isPaymentEnabled: boolean;
  /** 전체 동의 토글 핸들러 */
  handleAllAgreeToggle: () => void;
  /** 개별 약관 동의 토글 핸들러 */
  handleAgreementToggle: (key: keyof AgreementsState) => void;
}

// ============================================
// Hook
// ============================================

/**
 * 결제 화면 약관 동의 및 검증 Hook
 * @returns 약관 동의 상태 및 핸들러
 */
export const usePaymentValidation = (): UsePaymentValidationReturn => {
  // ============================================
  // 상태 관리
  // ============================================

  /** 개별 약관 동의 상태 */
  const [agreements, setAgreements] = useState<AgreementsState>({
    terms: false,
    privacy: false,
    payment: false,
  });

  // ============================================
  // 계산된 값
  // ============================================

  /** 전체 동의 상태 (모든 개별 약관이 체크되었는지) */
  const allAgreed = useMemo(() => {
    return agreements.terms && agreements.privacy && agreements.payment;
  }, [agreements]);

  /** 결제 버튼 활성화 여부 (전체 동의 완료 시) */
  const isPaymentEnabled = useMemo(() => {
    return allAgreed;
  }, [allAgreed]);

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /**
   * 전체 동의 토글 핸들러
   * - 전체 동의 클릭 시 모든 개별 약관 동의/해제
   */
  const handleAllAgreeToggle = useCallback(() => {
    const newValue = !allAgreed;
    setAgreements({
      terms: newValue,
      privacy: newValue,
      payment: newValue,
    });
  }, [allAgreed]);

  /**
   * 개별 약관 동의 토글 핸들러
   * - 개별 약관 클릭 시 해당 항목만 토글
   * - 모든 개별 약관이 체크되면 전체 동의도 자동으로 체크됨 (allAgreed가 자동 계산됨)
   * @param key 약관 키 (terms, privacy, payment)
   */
  const handleAgreementToggle = useCallback((key: keyof AgreementsState) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // ============================================
  // 반환
  // ============================================

  return {
    allAgreed,
    agreements,
    isPaymentEnabled,
    handleAllAgreeToggle,
    handleAgreementToggle,
  };
};

