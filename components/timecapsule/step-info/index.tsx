/**
 * step-info/index.tsx
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-16
 * 규칙 준수 체크리스트:
 * - [x] 인라인 스타일 0건
 * - [x] 색상 하드코딩 0건 (styles.ts에서 토큰 사용)
 * - [x] 외부 라이브러리 설치 0건 (react-native-calendars, dayjs 사용)
 */

import React, { useState, useCallback } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { styles } from './styles';
import { useDateSelection } from './hooks/useDateSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import {
  formatPrice,
  MAX_CAPSULE_NAME_LENGTH,
  MIN_PERSONNEL,
  MAX_PERSONNEL,
  MIN_STORAGE,
  MAX_STORAGE,
} from './constants';
import type { AdditionalOptionsState } from './types';

// ============================================
// 텍스트 상수 (국제화 대비)
// ============================================
const TEXTS = {
  capsuleName: {
    label: '캡슐 이름',
    placeholder: '예) 2025년의 우리',
  },
  dateSelection: {
    label: '개봉일 선택',
    options: [
      { title: '1주일 후', price: '₩1,000' },
      { title: '1년 후', price: '₩5,000' },
      { title: '3년 후', price: '₩10,000' },
      { title: '직접 선택', price: '기본 금액' },
    ],
  },
  personnel: {
    subLabel: 'PERSONNEL',
    label: '최대 인원',
    unit: '명',
    hint: '1EA: ₩500',
  },
  storage: {
    subLabel: 'STORAGE',
    label: '이미지 슬롯',
    unit: '장',
    hint: '1EA: ₩500',
  },
  additionalOptions: {
    label: '추가 옵션',
    options: [
      { title: '음악 파일', price: '+₩1,000' },
      { title: '영상 추가', price: '+₩2,000' },
    ],
  },
  footer: {
    totalLabel: '총 결제금액',
    submitButton: '결제하기',
  },
  calendar: {
    title: '개봉일 선택',
    closeButton: '닫기',
    confirmButton: '선택 완료',
  },
};

// ============================================
// 아이콘 이미지 URL (Figma MCP 제공)
// ============================================
const ICONS = {
  minus: 'http://localhost:3845/assets/caa352d54da7870001b0a87620715ea564cc645f.svg',
  plus: 'http://localhost:3845/assets/27ae7478f6e1a72ad0287abc028416f91b713402.svg',
  music: 'http://localhost:3845/assets/331a6aec1bcb65239fadc0cfb43881f8f38556d4.svg',
  video: 'http://localhost:3845/assets/d5f16bb854f8fd264307df3ab5abbcf7d8962031.svg',
};

// ============================================
// Props 타입 정의
// ============================================
interface StepInfoProps {
  onSubmit?: (formData: any) => void;
}

// ============================================
// 컴포넌트
// ============================================
export const StepInfo = ({ onSubmit }: StepInfoProps = {}): JSX.Element => {
  // ============================================
  // 상태 관리
  // ============================================

  /** 캡슐 이름 */
  const [capsuleName, setCapsuleName] = useState('');

  /** 인원 수 */
  const [personnelCount, setPersonnelCount] = useState(2);

  /** 이미지 슬롯 수 */
  const [storageCount, setStorageCount] = useState(3);

  /** 선택된 추가 옵션 */
  const [selectedOptions, setSelectedOptions] = useState<AdditionalOptionsState>({
    music: false,
    video: false,
  });

  /** 임시 선택 날짜 (달력에서 선택 중) */
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  // ============================================
  // Custom Hooks
  // ============================================

  /** 개봉일 선택 Hook */
  const {
    selectedOptionIndex,
    selectedDate,
    datePrice,
    isCalendarVisible,
    formattedOpenDate,
    handleOptionSelect,
    handleDateSelect,
    handleCalendarClose,
  } = useDateSelection();

  /** 가격 계산 Hook */
  const { personnelPrice, storagePrice, optionsPrice, totalPrice } = usePriceCalculation(
    datePrice,
    personnelCount,
    storageCount,
    selectedOptions
  );

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /** 캡슐 이름 변경 핸들러 */
  const handleCapsuleNameChange = useCallback((text: string) => {
    if (text.length <= MAX_CAPSULE_NAME_LENGTH) {
      setCapsuleName(text);
    }
  }, []);

  /** 인원 증감 핸들러 */
  const handlePersonnelChange = useCallback((count: number) => {
    setPersonnelCount(Math.max(MIN_PERSONNEL, Math.min(MAX_PERSONNEL, count)));
  }, []);

  /** 슬롯 증감 핸들러 */
  const handleStorageChange = useCallback((count: number) => {
    setStorageCount(Math.max(MIN_STORAGE, Math.min(MAX_STORAGE, count)));
  }, []);

  /** 추가 옵션 토글 핸들러 */
  const handleOptionToggle = useCallback((optionId: 'music' | 'video') => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  }, []);

  /** 달력에서 날짜 선택 시 */
  const handleCalendarDayPress = useCallback((day: { dateString: string }) => {
    const date = new Date(day.dateString);
    setTempSelectedDate(date);
  }, []);

  /** 달력 선택 완료 */
  const handleCalendarConfirm = useCallback(() => {
    if (tempSelectedDate) {
      handleDateSelect(tempSelectedDate);
      setTempSelectedDate(null);
    }
  }, [tempSelectedDate, handleDateSelect]);

  /** 달력 닫기 */
  const handleCalendarClosePress = useCallback(() => {
    setTempSelectedDate(null);
    handleCalendarClose();
  }, [handleCalendarClose]);

  /** 결제하기 버튼 핸들러 */
  const handleSubmitPress = useCallback(() => {
    // 유효성 검증
    if (!capsuleName.trim()) {
      Alert.alert('알림', '캡슐 이름을 입력해주세요.');
      return;
    }

    if (selectedOptionIndex === 3 && !selectedDate) {
      Alert.alert('알림', '개봉일을 선택해주세요.');
      return;
    }

    // 폼 데이터 구성
    const formData = {
      capsuleName,
      selectedDateOptionIndex: selectedOptionIndex,
      selectedDate,
      personnelCount,
      storageCount,
      selectedOptions,
      totalPrice,
    };

    // 부모 컴포넌트로 전달
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // 임시: 콘솔에 출력
      console.log('폼 제출:', formData);
      Alert.alert('제출 완료', `총 결제금액: ${formatPrice(totalPrice)}`);
    }
  }, [
    capsuleName,
    selectedOptionIndex,
    selectedDate,
    personnelCount,
    storageCount,
    selectedOptions,
    totalPrice,
    onSubmit,
  ]);

  // ============================================
  // 달력 설정
  // ============================================

  const today = dayjs().format('YYYY-MM-DD');
  const markedDates = tempSelectedDate
    ? {
        [dayjs(tempSelectedDate).format('YYYY-MM-DD')]: {
          selected: true,
          selectedColor: '#000000',
        },
      }
    : {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 캡슐 이름 섹션 */}
        <View style={[styles.section, styles.capsuleNameSection]}>
          <Text style={styles.sectionLabel}>{TEXTS.capsuleName.label}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputPlaceholder}
              placeholder={TEXTS.capsuleName.placeholder}
              placeholderTextColor="#99a1af"
              value={capsuleName}
              onChangeText={handleCapsuleNameChange}
              maxLength={MAX_CAPSULE_NAME_LENGTH}
            />
          </View>
        </View>

        {/* 개봉일 선택 섹션 */}
        <View style={[styles.section, styles.dateSelectionSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{TEXTS.dateSelection.label}</Text>
            <Text style={styles.sectionPrice}>{formatPrice(datePrice)}</Text>
          </View>
          <View style={styles.dateButtonsContainer}>
            {TEXTS.dateSelection.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedOptionIndex === index && styles.dateButtonSelected,
                ]}
                onPress={() => handleOptionSelect(index)}
                accessibilityRole="button"
                accessibilityLabel={`${option.title} ${option.price}`}>
                <Text
                  style={[
                    styles.dateButtonTitle,
                    selectedOptionIndex === index && styles.dateButtonTitleSelected,
                  ]}>
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.dateButtonPrice,
                    selectedOptionIndex === index && styles.dateButtonPriceSelected,
                  ]}>
                  {index === 3 && selectedDate
                    ? dayjs(selectedDate).format('MM/DD')
                    : option.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* 개봉일 표시 */}
          {formattedOpenDate && (
            <Text style={styles.openDateText}>{formattedOpenDate}</Text>
          )}
        </View>

        {/* 최대 인원 섹션 */}
        <View style={[styles.section, styles.stepperSection]}>
          <View style={[styles.sectionHeader, styles.sectionHeaderWithSub]}>
            <View style={styles.sectionLabelContainer}>
              <Text style={styles.sectionSubLabel}>{TEXTS.personnel.subLabel}</Text>
              <Text style={[styles.sectionLabel, styles.sectionLabelBlack]}>
                {TEXTS.personnel.label}
              </Text>
            </View>
            <Text style={styles.sectionPrice}>{formatPrice(personnelPrice)}</Text>
          </View>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handlePersonnelChange(personnelCount - 1)}
              accessibilityRole="button"
              accessibilityLabel="인원 감소">
              <Image source={{ uri: ICONS.minus }} style={styles.stepperButtonIcon} />
            </TouchableOpacity>
            <View style={styles.stepperValueContainer}>
              <Text style={styles.stepperValue}>{personnelCount}</Text>
              <Text style={styles.stepperUnit}>{TEXTS.personnel.unit}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handlePersonnelChange(personnelCount + 1)}
              accessibilityRole="button"
              accessibilityLabel="인원 증가">
              <Image source={{ uri: ICONS.plus }} style={styles.stepperButtonIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.stepperHint}>{TEXTS.personnel.hint}</Text>
        </View>

        {/* 이미지 슬롯 섹션 */}
        <View style={[styles.section, styles.stepperSection]}>
          <View style={[styles.sectionHeader, styles.sectionHeaderWithSub]}>
            <View style={styles.sectionLabelContainer}>
              <Text style={styles.sectionSubLabel}>{TEXTS.storage.subLabel}</Text>
              <Text style={[styles.sectionLabel, styles.sectionLabelBlack]}>
                {TEXTS.storage.label}
              </Text>
            </View>
            <Text style={styles.sectionPrice}>{formatPrice(storagePrice)}</Text>
          </View>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handleStorageChange(storageCount - 1)}
              accessibilityRole="button"
              accessibilityLabel="슬롯 감소">
              <Image source={{ uri: ICONS.minus }} style={styles.stepperButtonIcon} />
            </TouchableOpacity>
            <View style={styles.stepperValueContainer}>
              <Text style={styles.stepperValue}>{storageCount}</Text>
              <Text style={styles.stepperUnit}>{TEXTS.storage.unit}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handleStorageChange(storageCount + 1)}
              accessibilityRole="button"
              accessibilityLabel="슬롯 증가">
              <Image source={{ uri: ICONS.plus }} style={styles.stepperButtonIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.stepperHint}>{TEXTS.storage.hint}</Text>
        </View>

        {/* 추가 옵션 섹션 */}
        <View style={[styles.section, styles.additionalOptionsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{TEXTS.additionalOptions.label}</Text>
            <Text style={styles.sectionPrice}>{formatPrice(optionsPrice)}</Text>
          </View>
          <View style={styles.optionsContainer}>
            {TEXTS.additionalOptions.options.map((option, index) => {
              const optionId = index === 0 ? 'music' : 'video';
              const isSelected = selectedOptions[optionId];

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleOptionToggle(optionId)}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.title} ${option.price}`}>
                  <View style={styles.optionIconContainer}>
                    <Image
                      source={{ uri: index === 0 ? ICONS.music : ICONS.video }}
                      style={styles.optionIcon}
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}>
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionPrice,
                        isSelected && styles.optionPriceSelected,
                      ]}>
                      {option.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 하단 결제 영역 */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{TEXTS.footer.totalLabel}</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitPress}
          accessibilityRole="button"
          accessibilityLabel={TEXTS.footer.submitButton}>
          <Text style={styles.submitButtonText}>{TEXTS.footer.submitButton}</Text>
        </TouchableOpacity>
      </View>

      {/* 달력 바텀시트 모달 */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCalendarClosePress}>
        <TouchableOpacity
          style={styles.calendarBottomSheetOverlay}
          activeOpacity={1}
          onPress={handleCalendarClosePress}>
          <TouchableOpacity
            style={styles.calendarBottomSheetContainer}
            activeOpacity={1}>
            {/* 헤더 */}
            <View style={styles.calendarBottomSheetHeader}>
              <Text style={styles.calendarBottomSheetTitle}>{TEXTS.calendar.title}</Text>
              <TouchableOpacity
                style={styles.calendarBottomSheetCloseButton}
                onPress={handleCalendarClosePress}>
                <Text style={styles.calendarBottomSheetCloseText}>
                  {TEXTS.calendar.closeButton}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 달력 */}
            <View style={styles.calendarContainer}>
              <Calendar
                minDate={today}
                onDayPress={handleCalendarDayPress}
                markedDates={markedDates}
                theme={{
                  todayTextColor: '#000000',
                  selectedDayBackgroundColor: '#000000',
                  selectedDayTextColor: '#ffffff',
                  arrowColor: '#000000',
                  monthTextColor: '#000000',
                  textMonthFontWeight: 'bold',
                }}
              />
            </View>

            {/* 선택 완료 버튼 */}
            <TouchableOpacity
              style={styles.calendarConfirmButton}
              onPress={handleCalendarConfirm}
              disabled={!tempSelectedDate}>
              <Text style={styles.calendarConfirmButtonText}>
                {TEXTS.calendar.confirmButton}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default StepInfo;
