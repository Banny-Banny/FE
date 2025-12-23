/**
 * step-info/hooks/usePriceCalculation.ts
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-23 (백엔드 계산 로직에 맞게 수정)
 * 가격 계산 Hook
 */

import { useMemo } from 'react';
import { PHOTO_PRICE, MUSIC_PRICE, VIDEO_PRICE } from '../constants';
import type { AdditionalOptionsState, UsePriceCalculationReturn } from '../types';

const BASE_PRICE = 1000; // 기본 금액

/**
 * 전체 가격 계산 Hook (백엔드 로직 기반)
 *
 * @param datePrice 개봉일 금액 (현재 미사용, 추후 백엔드 추가 예정)
 * @param personnelCount 인원 수
 * @param storageCount 이미지 슬롯 수
 * @param selectedOptions 선택된 추가 옵션
 * @returns {UsePriceCalculationReturn} 계산된 가격 정보
 *
 * 백엔드 계산 로직:
 * - 기본: 1000원
 * - 사진: photo_count × 500
 * - 음악: headcount × 1000 (선택 시)
 * - 비디오: headcount × 2000 (선택 시)
 */
export const usePriceCalculation = (
  datePrice: number,
  personnelCount: number,
  storageCount: number,
  selectedOptions: AdditionalOptionsState
): UsePriceCalculationReturn => {
  // ============================================
  // 인원 금액 (백엔드에서는 별도 인원 요금 없음)
  // ============================================

  const personnelPrice = 0;

  // ============================================
  // 이미지 슬롯 금액 계산
  // ============================================

  const storagePrice = useMemo(() => {
    return storageCount * PHOTO_PRICE;
  }, [storageCount]);

  // ============================================
  // 추가 옵션 금액 계산 (인원수 × 단가)
  // ============================================

  const optionsPrice = useMemo(() => {
    let total = 0;

    if (selectedOptions.music) {
      total += personnelCount * MUSIC_PRICE;
    }

    if (selectedOptions.video) {
      total += personnelCount * VIDEO_PRICE;
    }

    return total;
  }, [selectedOptions, personnelCount]);

  // ============================================
  // 총 금액 계산
  // ============================================

  const totalPrice = useMemo(() => {
    return BASE_PRICE + storagePrice + optionsPrice;
  }, [storagePrice, optionsPrice]);

  // ============================================
  // 가격 상세 내역
  // ============================================

  const priceBreakdown = useMemo(
    () => ({
      datePrice: 0, // 현재 개봉일 요금 없음
      personnelPrice: 0, // 백엔드에 인원 요금 없음
      storagePrice,
      optionsPrice,
      totalPrice,
    }),
    [storagePrice, optionsPrice, totalPrice]
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
// 유틸리티 함수 (하위 호환성 유지)
// ============================================

/**
 * 인원 금액 계산 (현재 사용 안 함)
 * @deprecated 백엔드에 인원 요금이 없어 항상 0 반환
 */
export const calculatePersonnelPrice = (count: number): number => {
  return 0;
};

/**
 * 이미지 슬롯 금액 계산
 * @param count 슬롯 수
 * @returns 계산된 슬롯 금액
 */
export const calculateStoragePrice = (count: number): number => {
  return count * PHOTO_PRICE;
};

/**
 * 추가 옵션 금액 계산 (인원수 곱하기)
 * @param selectedOptions 선택된 옵션 상태
 * @param personnelCount 인원 수
 * @returns 계산된 옵션 금액
 */
export const calculateOptionsPrice = (
  selectedOptions: AdditionalOptionsState,
  personnelCount: number
): number => {
  let total = 0;

  if (selectedOptions.music) {
    total += personnelCount * MUSIC_PRICE;
  }

  if (selectedOptions.video) {
    total += personnelCount * VIDEO_PRICE;
  }

  return total;
};
