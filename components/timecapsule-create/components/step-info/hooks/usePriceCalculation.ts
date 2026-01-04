/**
 * step-info/hooks/usePriceCalculation.ts
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-26 (백엔드 가격 정책 적용)
 * UI 표시용 가격 정보 Hook
 *
 * ⚠️ 주의: 이 Hook은 UI 표시용 "예상 금액"만 보여줍니다.
 * 실제 결제 금액은 백엔드(createOrder API)에서 계산됩니다.
 */

import { useMemo } from 'react';
import { MUSIC_PRICE, PHOTO_PRICE, VIDEO_PRICE } from '../constants';
import type { AdditionalOptionsState, UsePriceCalculationReturn } from '../types';

/**
 * UI 표시용 예상 가격 Hook
 *
 * ⚠️ 이 함수는 UI 표시 목적으로만 사용됩니다.
 * 실제 결제 금액은 백엔드 API 응답(orderData.total_amount)을 사용해야 합니다.
 *
 * @param datePrice 개봉일 금액
 * @param personnelCount 인원 수
 * @param storageCount 이미지 슬롯 수
 * @param selectedOptions 선택된 추가 옵션
 * @returns {UsePriceCalculationReturn} UI 표시용 예상 가격 정보
 */
export const usePriceCalculation = (
  datePrice: number,
  personnelCount: number,
  storageCount: number,
  selectedOptions: AdditionalOptionsState,
): UsePriceCalculationReturn => {
  // ============================================
  // UI 표시용 예상 금액 계산
  // ============================================

  // 인원 요금 없음
  const personnelPrice = 0;

  // 이미지: 500원 × 개수 × 인원
  const storagePrice = useMemo(() => {
    return storageCount * PHOTO_PRICE * personnelCount;
  }, [storageCount, personnelCount]);

  // 추가 옵션: 인원당 가격
  const optionsPrice = useMemo(() => {
    let total = 0;

    if (selectedOptions.music) {
      total += personnelCount * MUSIC_PRICE; // 인원당 1000원
    }

    if (selectedOptions.video) {
      total += personnelCount * VIDEO_PRICE; // 인원당 2000원
    }

    return total;
  }, [selectedOptions, personnelCount]);

  // 총 가격 = 개봉일 가격 + 이미지 가격 + 옵션 가격
  const totalPrice = useMemo(() => {
    return datePrice + storagePrice + optionsPrice;
  }, [datePrice, storagePrice, optionsPrice]);

  const priceBreakdown = useMemo(
    () => ({
      datePrice,
      personnelPrice: 0,
      storagePrice,
      optionsPrice,
      totalPrice,
    }),
    [datePrice, storagePrice, optionsPrice, totalPrice],
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
