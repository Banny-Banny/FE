/**
 * step-payment/hooks/useOrderSummary.ts
 * 생성 시각: 2024-12-17
 * 수정 시각: 2024-12-23 (백엔드 응답 데이터 사용하도록 변경)
 * 주문 상품 계산 Hook
 */

import { formatCurrency } from '@/utils';
import { useMemo } from 'react';
import { CreateOrderResponse } from '../../step-info/api/types/order';
import { OrderItem, OrderSummary } from '../types';

/**
 * 주문 상품 요약 Hook (백엔드 응답 데이터 기반)
 * @param orderData 백엔드에서 받은 주문 데이터
 * @returns 주문 요약 정보
 *
 * @example
 * const orderSummary = useOrderSummary(orderData);
 * // orderSummary.items => 주문 항목 배열
 * // orderSummary.totalPrice => 총 금액 (백엔드에서 계산된 값)
 * // orderSummary.personnelCount => 참여 인원
 */
export const useOrderSummary = (orderData: CreateOrderResponse): OrderSummary => {
  return useMemo(() => {
    const {
      headcount,
      base_amount,
      photo_amount,
      music_amount,
      video_amount,
      time_option_amount,
      time_option,
      total_amount,
      photo_count,
    } = orderData;

    const items: OrderItem[] = [];

    // 1. 기본 금액 (항상 포함)
    if (base_amount > 0) {
      items.push({
        label: '기본 금액',
        detail: `${headcount}명`,
        price: base_amount,
      });
    }

    // 2. 사진 항목 (photo_amount > 0일 때만)
    if (photo_amount > 0) {
      items.push({
        label: '사진',
        detail: `${photo_count}장 × ${formatCurrency(photo_amount / photo_count)}`,
        price: photo_amount,
      });
    }

    // 3. 음악 항목 (music_amount > 0일 때만)
    if (music_amount > 0) {
      items.push({
        label: '음악',
        detail: `${headcount}명 × ${formatCurrency(music_amount / headcount)}`,
        price: music_amount,
      });
    }

    // 4. 동영상 항목 (video_amount > 0일 때만)
    if (video_amount > 0) {
      items.push({
        label: '동영상',
        detail: `${headcount}명 × ${formatCurrency(video_amount / headcount)}`,
        price: video_amount,
      });
    }

    // 5. 개봉일 옵션 항목 (time_option_amount > 0일 때만)
    if (time_option_amount > 0) {
      const timeOptionLabels: Record<string, string> = {
        '1_WEEK': '1주일 후',
        '1_MONTH': '1개월 후',
        '1_YEAR': '1년 후',
        CUSTOM: '직접 선택',
      };

      items.push({
        label: '개봉일 옵션',
        detail: timeOptionLabels[time_option] || time_option,
        price: time_option_amount,
      });
    }

    return {
      personnelCount: headcount,
      items,
      totalPrice: total_amount, // 백엔드에서 계산된 총 금액 사용
    };
  }, [orderData]);
};
