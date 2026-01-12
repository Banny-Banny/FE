/**
 * components/toss-payments/components/payment-history/index.tsx
 * 토스페이먼츠 결제 내역 조회 컴포넌트
 *
 * @description
 * - 결제 내역 목록 표시 (실제 API 연동)
 * - 피그마 디자인 기반 UI 구현
 * - 각 카드 클릭 시 상세 Modal 표시
 * - 영수증 상세보기 기능
 */

import { Button } from '@/commons/components/button';
import { Modal } from '@/commons/components/modal';
import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import { formatCurrency } from '@/utils';
import React, { useState } from 'react';
import { FlatList, Linking, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useMyPayments } from './hooks/usePaymentHistory';
import { styles } from './styles';
import type { PaymentListItem } from './types';

/**
 * 날짜 포맷팅 함수
 * ISO 8601 → "YYYY-MM-DD"
 */
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 결제 상태 텍스트 변환
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'DONE':
      return '완료';
    case 'CANCELED':
      return '취소됨';
    default:
      return status;
  }
};

/**
 * PaymentHistory 컴포넌트
 */
export const PaymentHistory: React.FC = () => {
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // API 호출
  const { data, isLoading, error } = useMyPayments({
    page: 1,
    limit: 100, // 일단 많은 양을 가져옴 (추후 무한스크롤 추가 가능)
    status: 'ALL',
  });

  const allPayments = data?.payments || [];

  // 디버깅: API 응답 확인
  React.useEffect(() => {
    if (data) {
      console.log('📊 [PaymentHistory] API 응답 데이터 (상세):', JSON.stringify(data, null, 2));
      console.log('📊 [PaymentHistory] 요약:', {
        paymentsCount: data.payments?.length || 0,
        total: data.total,
        page: data.page,
        limit: data.limit,
      });
      console.log('📊 [PaymentHistory] Payments 배열:', data.payments);

      // 데이터 불일치 체크
      if (data.total && data.total !== (data.payments?.length || 0)) {
        console.warn('⚠️ [PaymentHistory] 데이터 불일치 감지!', {
          total: data.total,
          actualCount: data.payments?.length || 0,
          difference: data.total - (data.payments?.length || 0),
        });
      }
    }
    if (error) {
      console.error('❌ [PaymentHistory] API 에러:', JSON.stringify(error, null, 2));
    }
  }, [data, error]);

  // 헤더 닫기 핸들러
  const handleClose = () => {
    navigation.replace(ROUTES.MY_PAGE);
  };

  // 카드 클릭 핸들러
  const handleCardPress = (payment: PaymentListItem) => {
    setSelectedPayment(payment);
    setIsDetailVisible(true);
  };

  // 영수증 상세보기
  const handleViewReceipt = async (receiptUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(receiptUrl);
      if (supported) {
        await Linking.openURL(receiptUrl);
      } else {
        console.error('[PaymentHistory] 영수증 URL을 열 수 없습니다:', receiptUrl);
      }
    } catch (err) {
      console.error('[PaymentHistory] 영수증 열기 실패:', err);
    }
  };

  // 결제 카드 렌더링
  const renderPaymentCard = ({ item }: { item: PaymentListItem }) => {
    const isDone = item.tossStatus === 'DONE';

    return (
      <Pressable style={styles.paymentCard} onPress={() => handleCardPress(item)}>
        {/* 헤더: 주문명 + 화살표 */}
        <View style={styles.cardHeader}>
          <Text style={styles.orderName} numberOfLines={1}>
            {item.orderName || '타임캡슐 결제'}
          </Text>
          <Icon
            name="arrow-right-s-line"
            size={20}
            color={Colors.black[500]}
            style={styles.cardArrow}
          />
        </View>

        {/* 바디: 날짜 + 상태 뱃지 + 금액 */}
        <View style={styles.cardBody}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardDate}>{formatDate(item.approvedAt)}</Text>
            <View
              style={[
                styles.statusBadge,
                isDone ? styles.statusBadgeDone : styles.statusBadgeCanceled,
              ]}>
              <Text style={styles.statusText}>{getStatusText(item.tossStatus)}</Text>
            </View>
          </View>
          <Text style={styles.cardAmount}>{formatCurrency(item.amount)}</Text>
        </View>
      </Pressable>
    );
  };

  // 빈 화면
  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="inbox-line" size={64} color={Colors.grey[400]} />
        <Text style={styles.emptyText}>결제 내역이 없습니다</Text>
        <Text style={styles.emptySubText}>결제한 내역이 없습니다</Text>
      </View>
    );
  };

  // 상세 정보 Modal (영수증)
  const renderDetailModal = () => {
    if (!selectedPayment) return null;

    return (
      <Modal
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        width={340}
        height="auto"
        padding={0}
        closeOnBackdropPress={true}>
        <View style={styles.modalContent}>
          {/* 닫기 버튼 */}
          <Pressable style={styles.modalCloseButton} onPress={() => setIsDetailVisible(false)}>
            <Icon name={'ri-close-line' as any} size={24} color={Colors.black[500]} />
          </Pressable>

          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>결제 영수증</Text>
            <Text style={styles.modalSubtitle}>Receipt</Text>
          </View>

          <View style={styles.modalDivider} />

          {/* 상세 정보 */}
          <View style={styles.modalSection}>
            <View style={styles.modalInfoItem}>
              <Text style={styles.modalLabel}>주문번호</Text>
              <Text style={styles.modalValue}>{selectedPayment.orderNo}</Text>
            </View>

            <View style={styles.modalInfoItem}>
              <Text style={styles.modalLabel}>결제일</Text>
              <Text style={styles.modalValue}>{formatDate(selectedPayment.approvedAt)}</Text>
            </View>

            <View style={styles.modalInfoItem}>
              <Text style={styles.modalLabel}>결제수단</Text>
              <Text style={styles.modalValue}>{selectedPayment.method}</Text>
            </View>
          </View>

          <View style={styles.modalDivider} />

          {/* 상세 내역 */}
          <View style={styles.modalSection}>
            <View style={styles.modalItemList}>
              <View style={styles.modalItemRow}>
                <Text style={styles.modalItemLabel}>
                  {selectedPayment.orderName || '타임캡슐 결제'}
                </Text>
                <Text style={styles.modalItemValue}>{formatCurrency(selectedPayment.amount)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalDivider} />

          {/* 총 결제금액 */}
          <View style={styles.modalTotalSection}>
            <Text style={styles.modalTotalLabel}>총 결제금액</Text>
            <Text style={styles.modalTotalAmount}>{formatCurrency(selectedPayment.amount)}</Text>
          </View>

          {/* 영수증 상세보기 버튼 */}
          {selectedPayment.receiptUrl && (
            <View style={styles.modalButtonContainer}>
              <Button
                label="영수증 상세보기"
                variant="outline"
                size="M"
                icon="external-link-line"
                iconPosition="left"
                onPress={() => handleViewReceipt(selectedPayment.receiptUrl)}
              />
            </View>
          )}

          {/* 하단 텍스트 */}
          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>이 영수증은 결제 확인용입니다</Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>결제 내역</Text>
          <Text style={styles.headerSubtitle}>
            총 {data?.total ?? allPayments.length}건의 결제
            {data && data.total !== allPayments.length && ` (표시: ${allPayments.length}건)`}
          </Text>
        </View>
        <Pressable style={styles.headerCloseButton} onPress={handleClose}>
          <Icon name={'ri-close-line' as any} size={24} color={Colors.black[500]} />
        </Pressable>
      </View>

      {/* 결제 내역 목록 */}
      <FlatList
        data={allPayments}
        renderItem={renderPaymentCard}
        keyExtractor={(item) => item.orderNo}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* 상세 정보 Modal */}
      {renderDetailModal()}
    </View>
  );
};

export default PaymentHistory;
