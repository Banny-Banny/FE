/**
 * step-info/hooks/usePriceCalculation.ts
 * 생성 시각: 2024-12-16
 * 가격 계산 Hook
 */

import { useMemo } from 'react';
import {
  PERSONNEL_UNIT_PRICE,
  STORAGE_UNIT_PRICE,
  ADDITIONAL_OPTIONS,
} from '../constants';
import type { AdditionalOptionsState, UsePriceCalculationReturn } from '../types';

/**
 * 전체 가격 계산 Hook
 *
 * @param datePrice 개봉일 금액
 * @param personnelCount 인원 수
 * @param storageCount 이미지 슬롯 수
 * @param selectedOptions 선택된 추가 옵션
 * @returns {UsePriceCalculationReturn} 계산된 가격 정보
 *
 * @example
 * const {
 *   personnelPrice,
 *   storagePrice,
 *   optionsPrice,
 *   totalPrice,
 *   priceBreakdown
 * } = usePriceCalculation(datePrice, personnelCount, storageCount, selectedOptions);
 */
export const usePriceCalculation = (
  datePrice: number,
  personnelCount: number,
  storageCount: number,
  selectedOptions: AdditionalOptionsState
): UsePriceCalculationReturn => {
  // ============================================
  // 인원 금액 계산 (useMemo로 최적화)
  // ============================================

  const personnelPrice = useMemo(() => {
    return calculatePersonnelPrice(personnelCount);
  }, [personnelCount]);

  // ============================================
  // 이미지 슬롯 금액 계산 (useMemo로 최적화)
  // ============================================

  const storagePrice = useMemo(() => {
    return calculateStoragePrice(storageCount);
  }, [storageCount]);

  // ============================================
  // 추가 옵션 금액 계산 (useMemo로 최적화)
  // ============================================

  const optionsPrice = useMemo(() => {
    return calculateOptionsPrice(selectedOptions);
  }, [selectedOptions]);

  // ============================================
  // 총 금액 계산 (useMemo로 최적화)
  // ============================================

  const totalPrice = useMemo(() => {
    return datePrice + personnelPrice + storagePrice + optionsPrice;
  }, [datePrice, personnelPrice, storagePrice, optionsPrice]);

  // ============================================
  // 가격 상세 내역
  // ============================================

  const priceBreakdown = useMemo(
    () => ({
      datePrice,
      personnelPrice,
      storagePrice,
      optionsPrice,
      totalPrice,
    }),
    [datePrice, personnelPrice, storagePrice, optionsPrice, totalPrice]
  );

  // ============================================
  // 반환값
  // ============================================

  return {
    personnelPrice,
    storagePrice,
    optionsPrice,
    totalPrice,
    priceBreakdown,
  };
};

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 인원 금액 계산
 * @param count 인원 수
 * @returns 계산된 인원 금액
 */
export const calculatePersonnelPrice = (count: number): number => {
  return count * PERSONNEL_UNIT_PRICE;
};

/**
 * 이미지 슬롯 금액 계산
 * @param count 슬롯 수
 * @returns 계산된 슬롯 금액
 */
export const calculateStoragePrice = (count: number): number => {
  return count * STORAGE_UNIT_PRICE;
};

/**
 * 추가 옵션 금액 계산
 * @param selectedOptions 선택된 옵션 상태
 * @returns 계산된 옵션 금액
 */
export const calculateOptionsPrice = (
  selectedOptions: AdditionalOptionsState
): number => {
  let total = 0;

  if (selectedOptions.music) {
    total += ADDITIONAL_OPTIONS.MUSIC.price;
  }

  if (selectedOptions.video) {
    total += ADDITIONAL_OPTIONS.VIDEO.price;
  }

  return total;
};
