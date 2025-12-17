/**
 * step-payment/utils/calculateOrderSummary.ts
 * 생성 시각: 2024-12-16
 * 주문 상품 계산 로직
 */

import { formatCurrency } from '@/utils';
import { MUSIC_PRICE, PHOTO_PRICE, TEXT_PRICE, VIDEO_PRICE } from '../../../constants';
import { StepInfoFormData } from '../../step-info/types';
import { OrderItem, OrderSummary } from '../types';

// ============================================
// 주문 상품 계산 함수
// ============================================

/**
 * 이전 단계(step-info)의 폼 데이터를 기반으로 주문 상품 계산
 * @param formData 이전 단계 폼 데이터
 * @returns 주문 요약 정보
 */
export const calculateOrderSummary = (formData: StepInfoFormData): OrderSummary => {
  const { personnelCount, storageCount, selectedOptions } = formData;

  const items: OrderItem[] = [];

  // 1. 텍스트 항목 (무료, 항상 포함)
  items.push({
    label: '텍스트',
    detail: `${personnelCount}명 × 기본 × ${formatCurrency(TEXT_PRICE)}`,
    price: TEXT_PRICE,
  });

  // 2. 사진 항목 (항상 포함)
  const photoTotalPrice = personnelCount * storageCount * PHOTO_PRICE;
  items.push({
    label: '사진',
    detail: `${personnelCount}명 × ${storageCount}개 × ${formatCurrency(PHOTO_PRICE)}`,
    price: photoTotalPrice,
  });

  // 3. 음악 항목 (선택 시만 포함)
  if (selectedOptions.music) {
    const musicTotalPrice = personnelCount * 1 * MUSIC_PRICE;
    items.push({
      label: '음악',
      detail: `${personnelCount}명 × 1개 × ${formatCurrency(MUSIC_PRICE)}`,
      price: musicTotalPrice,
    });
  }

  // 4. 동영상 항목 (선택 시만 포함)
  if (selectedOptions.video) {
    const videoTotalPrice = personnelCount * 1 * VIDEO_PRICE;
    items.push({
      label: '동영상',
      detail: `${personnelCount}명 × 1개 × ${formatCurrency(VIDEO_PRICE)}`,
      price: videoTotalPrice,
    });
  }

  // 5. 총 금액 계산
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return {
    personnelCount,
    items,
    totalPrice,
  };
};
