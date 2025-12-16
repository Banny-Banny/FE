/**
 * step-payment/index.tsx
 * 생성 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] 인라인 스타일 0건
 * - [x] 색상 하드코딩 0건 (styles.ts에서 토큰 사용)
 * - [x] 외부 라이브러리 설치 0건
 * - [x] Figma 디자인과 1:1 대응
 */

import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

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
    participantValue: '2명',
    items: [
      { label: '텍스트', detail: '2명 × 3개 × 100원', price: '600원' },
      { label: '사진', detail: '2명 × 3개 × 200원', price: '1,200원' },
      { label: '음악', detail: '2명 × 1개 × 300원', price: '600원' },
      { label: '동영상', detail: '2명 × 1개 × 400원', price: '800원' },
    ],
    totalLabel: '합계',
    totalPrice: '4,000원',
  },
  agreements: {
    allAgree: '전체 동의',
    items: [
      '이용약관 동의 (필수)',
      '개인정보 처리방침 동의 (필수)',
      '결제 진행 동의 (필수)',
    ],
  },
  footer: {
    submitButton: '카카오페이로 결제하기',
  },
};

// ============================================
// 아이콘 이미지 URL (Figma MCP 제공)
// ============================================
const ICONS = {
  back: 'http://localhost:3845/assets/e0b41fc17e9381f094bcd08143ab0a49a9693e34.svg',
  chevronRight: 'http://localhost:3845/assets/d08dfdc6418083d70b0711231d8e01c1aff7c746.svg',
};

// ============================================
// Props 타입 정의
// ============================================
interface StepPaymentProps {
  onSubmit?: () => void;
  onBack?: () => void;
}

// ============================================
// 컴포넌트
// ============================================
export const StepPayment = ({ onSubmit, onBack }: StepPaymentProps = {}): JSX.Element => {
  // ============================================
  // 상태 관리
  // ============================================

  /** 전체 동의 체크 상태 */
  const [allAgreed, setAllAgreed] = useState(false);

  /** 개별 동의 체크 상태 */
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    payment: false,
  });

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /** 뒤로가기 버튼 핸들러 */
  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  /** 전체 동의 토글 핸들러 */
  const handleAllAgreeToggle = useCallback(() => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setAgreements({
      terms: newValue,
      privacy: newValue,
      payment: newValue,
    });
  }, [allAgreed]);

  /** 개별 동의 토글 핸들러 */
  const handleAgreementToggle = useCallback((key: 'terms' | 'privacy' | 'payment') => {
    setAgreements((prev) => {
      const newAgreements = {
        ...prev,
        [key]: !prev[key],
      };

      // 모든 항목이 체크되면 전체 동의도 체크
      const allChecked = Object.values(newAgreements).every((v) => v);
      setAllAgreed(allChecked);

      return newAgreements;
    });
  }, []);

  /** 약관 상세 보기 핸들러 */
  const handleAgreementDetailPress = useCallback((index: number) => {
    // TODO: 약관 상세 페이지로 이동
    console.log(`약관 상세 보기: ${index}`);
  }, []);

  /** 결제하기 버튼 핸들러 */
  const handleSubmitPress = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

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
            <View style={styles.backButtonIconContainer}>
              <Image source={{ uri: ICONS.back }} style={styles.backButtonIcon} />
            </View>
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
              <Text style={styles.participantLabel}>
                {TEXTS.orderSummary.participantLabel}
              </Text>
              <Text style={styles.participantValue}>
                {TEXTS.orderSummary.participantValue}
              </Text>
            </View>

            {/* 상품 목록 */}
            <View style={styles.itemsList}>
              {TEXTS.orderSummary.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemLabelContainer}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemDetail}>{item.detail}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>

            {/* 합계 */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{TEXTS.orderSummary.totalLabel}</Text>
              <Text style={styles.totalPrice}>{TEXTS.orderSummary.totalPrice}</Text>
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
              </View>
              <Text style={styles.allAgreeText}>{TEXTS.agreements.allAgree}</Text>
            </TouchableOpacity>
          </View>

          {/* 개별 약관 목록 */}
          <View style={styles.agreementsList}>
            {TEXTS.agreements.items.map((item, index) => {
              const key = ['terms', 'privacy', 'payment'][index] as
                | 'terms'
                | 'privacy'
                | 'payment';
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
                    </View>
                    <Text style={styles.agreementText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.chevronButton}
                    onPress={() => handleAgreementDetailPress(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item} 상세보기`}>
                    <Image
                      source={{ uri: ICONS.chevronRight }}
                      style={styles.chevronIcon}
                    />
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
          style={styles.submitButton}
          onPress={handleSubmitPress}
          accessibilityRole="button"
          accessibilityLabel={TEXTS.footer.submitButton}>
          <Text style={styles.submitButtonText}>{TEXTS.footer.submitButton}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StepPayment;
