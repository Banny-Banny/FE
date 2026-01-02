/**
 * components/order-summary-card/index.tsx
 * 주문 상품 카드 컴포넌트
 */

import { formatCurrency } from '@/utils';
import React from 'react';
import { Text, View } from 'react-native';
import { TEXTS } from '../../constants';
import { styles } from './styles';
import type { OrderSummaryCardProps } from './types';

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ orderSummary }) => {
  return (
    <View style={styles.orderSummaryCard}>
      <View style={styles.cardContent}>
        {/* 상단 컨텐츠 영역 */}
        <View style={styles.topContent}>
          {/* 제목 */}
          <View style={styles.orderSummaryHeader}>
            <Text style={styles.orderSummaryTitle}>{TEXTS.orderSummary.title}</Text>
          </View>

          {/* 참여 인원 */}
          <View style={styles.participantRow}>
            <Text style={styles.participantLabel}>{TEXTS.orderSummary.participantLabel}</Text>
            <Text style={styles.participantValue}>{orderSummary.personnelCount}명</Text>
          </View>

          {/* 상품 목록 */}
          <View style={styles.itemsList}>
            {orderSummary.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemLabelContainer}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDetail}>{item.detail}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 합계 - 항상 하단에 고정 */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{TEXTS.orderSummary.totalLabel}</Text>
          <Text style={styles.totalPrice}>{formatCurrency(orderSummary.totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

