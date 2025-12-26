/**
 * step-payment/hooks/useOrderSummary.ts
 * 생성 시각: 2024-12-17
 * 수정 시각: 2024-12-26 (백엔드 가격 정책 변경에 따른 로직 수정)
 * 주문 상품 계산 Hook
 */

import { formatCurrency } from '@/utils';
import dayjs from 'dayjs';
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
      image_amount,
      audio_amount,
      video_amount,
      time_option_amount,
      time_option,
      custom_open_at,
      total_amount,
      photo_count,
    } = orderData;

    const items: OrderItem[] = [];

    // 1. 개봉일 옵션 금액 (time_option_amount)
    if (time_option_amount > 0) {
      let optionLabel = '개봉일 옵션';

      // time_option에 따라 레이블 변경
      if (time_option === '1_WEEK') {
        optionLabel = '개봉일 (1주일)';
      } else if (time_option === '1_MONTH') {
        optionLabel = '개봉일 (1개월)';
      } else if (time_option === '1_YEAR') {
        optionLabel = '개봉일 (1년)';
      } else if (time_option === 'CUSTOM') {
        // custom_open_at 날짜 파싱해서 표시
        if (custom_open_at) {
          const openDate = dayjs(custom_open_at).format('YYYY.MM.DD');
          optionLabel = `개봉일 (${openDate})`;
        } else {
          optionLabel = '개봉일 (직접 선택)';
        }
      }

      items.push({
        label: optionLabel,
        detail: '',
        price: time_option_amount,
      });
    }

    // 2. 이미지 슬롯
    if (image_amount > 0) {
      items.push({
        label: `이미지 (${photo_count}장)`,
        detail: '',
        price: image_amount,
      });
    }

    // 3. 음악 파일 (파일당 고정 금액)
    if (audio_amount > 0) {
      items.push({
        label: '음악 파일',
        detail: '',
        price: audio_amount,
      });
    }

    // 4. 영상 추가 (파일당 고정 금액)
    if (video_amount > 0) {
      items.push({
        label: '영상 파일',
        detail: '',
        price: video_amount,
      });
    }

    return {
      personnelCount: headcount,
      items,
      totalPrice: total_amount, // 백엔드에서 계산된 총 금액 사용
    };
  }, [orderData]);
};
