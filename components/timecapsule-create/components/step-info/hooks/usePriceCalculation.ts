/**
 * step-info/hooks/usePriceCalculation.ts
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-23 (백엔드 계산 의존으로 변경)
 * UI 표시용 가격 정보 Hook
 *
 * ⚠️ 주의: 이 Hook은 UI 표시용 "예상 금액"만 보여줍니다.
 * 실제 결제 금액은 백엔드(createOrder API)에서 계산됩니다.
 */

import { useMemo } from 'react';
import { PHOTO_PRICE, MUSIC_PRICE, VIDEO_PRICE } from '../constants';
import type { AdditionalOptionsState, UsePriceCalculationReturn } from '../types';

const BASE_PRICE = 1000; // 기본 금액

/**
 * UI 표시용 예상 가격 Hook
 *
 * ⚠️ 이 함수는 UI 표시 목적으로만 사용됩니다.
 * 실제 결제 금액은 백엔드 API 응답(orderData.total_amount)을 사용해야 합니다.
 *
 * @param datePrice 개봉일 금액 (현재 미사용)
 * @param personnelCount 인원 수
 * @param storageCount 이미지 슬롯 수
 * @param selectedOptions 선택된 추가 옵션
 * @returns {UsePriceCalculationReturn} UI 표시용 예상 가격 정보
 */
export const usePriceCalculation = (
  datePrice: number,
  personnelCount: number,
  storageCount: number,
  selectedOptions: AdditionalOptionsState
): UsePriceCalculationReturn => {
  // ============================================
  // UI 표시용 예상 금액 계산
  // ============================================

  const personnelPrice = 0; // 인원 요금 없음

  const storagePrice = useMemo(() => {
    return storageCount * PHOTO_PRICE;
  }, [storageCount]);

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

  const totalPrice = useMemo(() => {
    return BASE_PRICE + storagePrice + optionsPrice;
  }, [storagePrice, optionsPrice]);

  const priceBreakdown = useMemo(
    () => ({
      datePrice: 0,
      personnelPrice: 0,
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
