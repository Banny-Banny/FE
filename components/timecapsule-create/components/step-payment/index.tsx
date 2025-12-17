/**
 * step-payment/index.tsx
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] 인라인 스타일 0건
 * - [x] 색상 하드코딩 0건 (styles.ts에서 토큰 사용)
 * - [x] 외부 라이브러리 설치 0건
 * - [x] Figma 디자인과 1:1 대응
 * - [x] 기능 구현 완료 (약관 동의, 주문 상품 계산, 검증)
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaymentValidation } from './hooks/usePaymentValidation';
import { styles } from './styles';
import { StepPaymentProps } from './types';
import { calculateOrderSummary } from './utils/calculateOrderSummary';

// ============================================
// 텍스트 상수 (국제화 대비)
// ============================================
const TEXTS = {
  header: {
    title: '결제하기',
  },
  orderSummary: {
    title: '주문 상품',
    participantLabel: '참여 인원',
    totalLabel: '합계',
  },
  agreements: {
    allAgree: '전체 동의',
    items: ['이용약관 동의 (필수)', '개인정보 처리방침 동의 (필수)', '결제 진행 동의 (필수)'],
  },
  footer: {
    submitButton: '카카오페이로 결제하기',
  },
  alerts: {
    agreementRequired: '모든 약관에 동의해주세요',
  },
};

// ============================================
// 약관 상세 내용
// ============================================
const AGREEMENT_DETAILS = [
  {
    title: '이용약관',
    content: [
      {
        sectionTitle: '제1조 (목적)',
        text: '본 약관은 타임캡슐 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.',
      },
      {
        sectionTitle: '제2조 (서비스의 제공)',
        text: '회사는 이용자에게 타임캡슐 생성, 저장, 공유 서비스를 제공합니다. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 하되, 시스템 점검 등 불가피한 사유가 있는 경우 서비스 제공이 일시 중단될 수 있습니다.',
      },
      {
        sectionTitle: '제3조 (이용자의 의무)',
        text: '이용자는 본 약관 및 관계 법령을 준수하여야 하며, 타인의 권리를 침해하거나 불법적인 내용을 게시해서는 안 됩니다. 또한 서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.',
      },
    ],
  },
  {
    title: '개인정보 처리방침',
    content: [
      {
        sectionTitle: '제1조 (수집하는 개인정보)',
        text: '회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다: 이름, 이메일 주소, 프로필 사진, 타임캡슐에 업로드하는 콘텐츠(텍스트, 사진, 음악, 동영상 등).',
      },
      {
        sectionTitle: '제2조 (개인정보의 이용 목적)',
        text: '수집된 개인정보는 타임캡슐 서비스 제공, 회원 관리, 서비스 개선, 고객 지원 등의 목적으로 이용됩니다. 회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.',
      },
      {
        sectionTitle: '제3조 (개인정보의 보유 및 파기)',
        text: '회사는 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우에는 일정 기간 동안 보관합니다.',
      },
    ],
  },
  {
    title: '결제 진행 동의',
    content: [
      {
        sectionTitle: '제1조 (결제 정보)',
        text: '타임캡슐 서비스는 기본 텍스트는 무료이며, 사진은 1장당 500원, 음악은 1개당 1,000원, 동영상은 1개당 2,000원의 요금이 부과됩니다. 최종 결제 금액은 참여 인원과 선택한 옵션에 따라 계산됩니다.',
      },
      {
        sectionTitle: '제2조 (결제 수단)',
        text: '결제는 카카오페이를 통해 진행되며, 카카오페이의 이용약관 및 정책이 적용됩니다. 결제 과정에서 문제가 발생한 경우 고객센터로 문의해 주시기 바랍니다.',
      },
      {
        sectionTitle: '제3조 (환불 정책)',
        text: '타임캡슐 생성 후 24시간 이내에는 전액 환불이 가능합니다. 단, 타임캡슐이 이미 공개된 경우 환불이 제한될 수 있습니다. 환불 요청은 고객센터를 통해 신청할 수 있습니다.',
      },
    ],
  },
];

// ============================================
// 아이콘 이미지 URL (Figma MCP 제공)
// ============================================
const ICONS = {
  back: 'http://localhost:3845/assets/e0b41fc17e9381f094bcd08143ab0a49a9693e34.svg',
  chevronRight: 'http://localhost:3845/assets/d08dfdc6418083d70b0711231d8e01c1aff7c746.svg',
};

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 숫자를 천단위 콤마 형식으로 변환
 * @param value 숫자
 * @returns 포맷된 문자열 (예: "5,000")
 */
const formatPrice = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

/**
 * 가격을 원화 형식으로 변환
 * @param value 숫자
 * @returns 원화 형식 문자열 (예: "₩5,000")
 */
const formatCurrency = (value: number): string => {
  return `₩${formatPrice(value)}`;
};

// ============================================
// 컴포넌트
// ============================================
export const StepPayment = ({ formData, onSubmit, onBack }: StepPaymentProps) => {
  // ============================================
  // Hooks
  // ============================================

  /** 약관 동의 및 검증 Hook */
  const { allAgreed, agreements, isPaymentEnabled, handleAllAgreeToggle, handleAgreementToggle } =
    usePaymentValidation();

  /** 약관 상세 모달 상태 */
  const [selectedAgreementIndex, setSelectedAgreementIndex] = useState<number | null>(null);

  // ============================================
  // 주문 상품 계산 (useMemo로 최적화)
  // ============================================

  /** 주문 요약 정보 */
  const orderSummary = useMemo(() => {
    return calculateOrderSummary(formData);
  }, [formData]);

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /** 뒤로가기 버튼 핸들러 */
  const handleBackPress = useCallback(() => {
    console.log('🔙 뒤로가기 버튼 클릭!');
    console.log('🔙 onBack 존재 여부:', !!onBack);
    if (onBack) {
      console.log('🔙 onBack 호출!');
      onBack();
    } else {
      console.log('❌ onBack이 없습니다!');
    }
  }, [onBack]);

  /** 약관 상세 보기 핸들러 */
  const handleAgreementDetailPress = useCallback((index: number) => {
    setSelectedAgreementIndex(index);
  }, []);

  /** 약관 상세 모달 닫기 핸들러 */
  const handleModalClose = useCallback(() => {
    setSelectedAgreementIndex(null);
  }, []);

  /** 결제하기 버튼 핸들러 */
  const handleSubmitPress = useCallback(() => {
    // 약관 동의 검증
    if (!isPaymentEnabled) {
      Alert.alert('알림', TEXTS.alerts.agreementRequired);
      return;
    }

    // 검증 통과 시 onSubmit 호출 (주문 정보 전달)
    if (onSubmit) {
      onSubmit(orderSummary);
    }
  }, [isPaymentEnabled, onSubmit, orderSummary]);

  // ============================================
  // 렌더링
  // ============================================

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기">
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{TEXTS.header.title}</Text>
        </View>
        <View style={styles.headerBorder} />
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 주문 상품 카드 */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.cardBorder} />
          <View style={styles.cardContent}>
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

            {/* 합계 */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{TEXTS.orderSummary.totalLabel}</Text>
              <Text style={styles.totalPrice}>{formatCurrency(orderSummary.totalPrice)}</Text>
            </View>
          </View>
        </View>

        {/* 약관 동의 카드 */}
        <View style={styles.agreementsCard}>
          <View style={styles.cardBorder} />

          {/* 전체 동의 */}
          <View style={styles.allAgreeRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={handleAllAgreeToggle}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: allAgreed }}>
              <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
                <View style={styles.checkboxBorder} />
                {allAgreed && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={styles.allAgreeText}>{TEXTS.agreements.allAgree}</Text>
            </TouchableOpacity>
          </View>

          {/* 개별 약관 목록 */}
          <View style={styles.agreementsList}>
            {TEXTS.agreements.items.map((item, index) => {
              const key = ['terms', 'privacy', 'payment'][index] as 'terms' | 'privacy' | 'payment';
              const isChecked = agreements[key];

              return (
                <View key={index} style={styles.agreementRow}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => handleAgreementToggle(key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isChecked }}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      <View style={styles.checkboxBorder} />
                      {isChecked && <Text style={styles.checkboxCheckmark}>✓</Text>}
                    </View>
                    <Text style={styles.agreementText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.chevronButton}
                    onPress={() => handleAgreementDetailPress(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item} 상세보기`}>
                    <Text style={styles.chevronText}>›</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 하단 결제 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !isPaymentEnabled && styles.submitButtonDisabled]}
          onPress={handleSubmitPress}
          disabled={!isPaymentEnabled}
          accessibilityRole="button"
          accessibilityLabel={TEXTS.footer.submitButton}
          accessibilityState={{ disabled: !isPaymentEnabled }}>
          <Text style={styles.submitButtonText}>{TEXTS.footer.submitButton}</Text>
          <Text style={styles.submitButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* 약관 상세 모달 */}
      <Modal
        visible={selectedAgreementIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleModalClose}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}>
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedAgreementIndex !== null
                  ? AGREEMENT_DETAILS[selectedAgreementIndex].title
                  : ''}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleModalClose}
                accessibilityRole="button"
                accessibilityLabel="닫기">
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 모달 콘텐츠 */}
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={true}>
              {selectedAgreementIndex !== null &&
                AGREEMENT_DETAILS[selectedAgreementIndex].content.map((section, index) => (
                  <View key={index} style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{section.sectionTitle}</Text>
                    <Text style={styles.modalText}>{section.text}</Text>
                  </View>
                ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default StepPayment;
