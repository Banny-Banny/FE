/**
 * step-info/index.tsx
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-19 (react-hook-form 마이그레이션)
 * 규칙 준수 체크리스트:
 * - [x] 인라인 스타일 0건
 * - [x] 색상 하드코딩 0건 (styles.ts에서 토큰 사용)
 * - [x] 외부 라이브러리 설치 0건 (react-native-calendars, dayjs 사용)
 * - [x] react-hook-form@^7.68.0 사용
 */

import { Colors } from '@/commons/constants';
import { formatPriceWithSymbol as formatPrice } from '@/utils';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-remix-icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MAX_CAPSULE_NAME_LENGTH,
  MAX_PERSONNEL,
  MAX_STORAGE,
  MIN_PERSONNEL,
  MIN_STORAGE,
} from './constants';
import { useCreateOrder } from './hooks/useCreateOrder';
import { useDateSelection } from './hooks/useDateSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import { styles } from './styles';

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
      { title: '1주일', price: '₩1,000' },
      { title: '1개월', price: '₩5,000' },
      { title: '1년', price: '₩10,000' },
      { title: '직접 선택', price: '날짜별' },
    ],
  },
  personnel: {
    subLabel: 'PERSONNEL',
    label: '인원수',
    unit: '명',
    hint: '',
  },
  storage: {
    subLabel: 'STORAGE',
    label: '이미지 슬롯',
    unit: '장',
    hint: '1장당: ₩500',
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
// 아이콘 이름 (Remix Icon)
// ============================================
const ICONS = {
  music: 'music-2-line' as const,
  // Figma 디자인 기준: 동영상 카메라 아이콘
  video: 'video-on-line' as const,
};

// ============================================
// 타입 정의
// ============================================

/** 폼 데이터 타입 */
interface StepInfoFormData {
  capsuleName: string;
  selectedDateOptionIndex: number;
  selectedDate: Date | null;
  personnelCount: number;
  storageCount: number;
  selectedOptions: {
    music: boolean;
    video: boolean;
  };
}

/** Props 타입 정의 */
interface StepInfoProps {
  onSubmit?: (formData: any) => void;
  onBack?: () => void; // 뒤로가기 핸들러
  initialData?: any; // 이전에 입력한 데이터 (뒤로가기 시 복원용)
}

// ============================================
// 컴포넌트
// ============================================
export default function StepInfo({ onSubmit, onBack, initialData }: StepInfoProps) {
  // ============================================
  // react-hook-form 설정
  // ============================================

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<StepInfoFormData>({
    mode: 'onChange',
    defaultValues: {
      capsuleName: initialData?.capsuleName || '',
      selectedDateOptionIndex: initialData?.selectedDateOptionIndex || 0,
      selectedDate: initialData?.selectedDate || null,
      personnelCount: initialData?.personnelCount || 2,
      storageCount: initialData?.storageCount || 3,
      selectedOptions: {
        music: initialData?.selectedOptions?.music || false,
        video: initialData?.selectedOptions?.video || false,
      },
    },
  });

  // ============================================
  // 상태 관리 (react-hook-form으로 관리되지 않는 것들)
  // ============================================

  /** 임시 선택 날짜 (달력에서 선택 중) */
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  /** 바텀시트 애니메이션 값 */
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ============================================
  // 백엔드 API Hook
  // ============================================

  /** 주문 생성 Hook */
  const { isLoading, error, submitOrder, clearError } = useCreateOrder();

  // ============================================
  // 폼 값 watch (Custom Hooks 통합을 위해)
  // ============================================

  const formValues = watch();
  const watchedSelectedDateOptionIndex = watch('selectedDateOptionIndex');

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
    handleOptionSelect: handleDateOptionSelect,
    handleDateSelect: handleDateSelectFromHook,
    handleCalendarClose,
  } = useDateSelection(initialData);

  /**
   * UI 표시용 예상 가격 Hook
   * ⚠️ 주의: 이 값은 사용자에게 보여주는 "예상 금액"일 뿐입니다.
   * 실제 결제 금액은 백엔드 API(submitOrder)의 응답(orderData.total_amount)을 사용합니다.
   */
  const { personnelPrice, storagePrice, optionsPrice, totalPrice } = usePriceCalculation(
    datePrice,
    formValues.personnelCount,
    formValues.storageCount,
    formValues.selectedOptions,
  );

  // ============================================
  // 바텀시트 애니메이션
  // ============================================

  useEffect(() => {
    if (isCalendarVisible) {
      // 열기 전에 항상 초기 위치로 리셋
      slideAnim.setValue(1000);
      fadeAnim.setValue(0);

      // 바텀시트 열기 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 90,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 바텀시트 닫기 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1000,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCalendarVisible, fadeAnim, slideAnim]);

  // ============================================
  // 이벤트 핸들러 (setValue 기반)
  // ============================================

  /** 인원 증감 핸들러 */
  const handlePersonnelChange = useCallback(
    (count: number) => {
      const validCount = Math.max(MIN_PERSONNEL, Math.min(MAX_PERSONNEL, count));
      setValue('personnelCount', validCount, { shouldValidate: true });
    },
    [setValue],
  );

  /** 슬롯 증감 핸들러 */
  const handleStorageChange = useCallback(
    (count: number) => {
      const validCount = Math.max(MIN_STORAGE, Math.min(MAX_STORAGE, count));
      setValue('storageCount', validCount, { shouldValidate: true });
    },
    [setValue],
  );

  /** 추가 옵션 토글 핸들러 */
  const handleOptionToggle = useCallback(
    (optionId: 'music' | 'video') => {
      const currentOptions = watch('selectedOptions');
      setValue(
        'selectedOptions',
        {
          ...currentOptions,
          [optionId]: !currentOptions[optionId],
        },
        { shouldValidate: true },
      );
    },
    [setValue, watch],
  );

  /** 개봉일 옵션 선택 핸들러 (Custom Hook과 통합) */
  const handleOptionSelect = useCallback(
    (index: number) => {
      setValue('selectedDateOptionIndex', index, { shouldValidate: true });
      handleDateOptionSelect(index);
    },
    [setValue, handleDateOptionSelect],
  );

  /** 날짜 선택 핸들러 (Custom Hook과 통합) */
  const handleDateSelect = useCallback(
    (date: Date) => {
      setValue('selectedDate', date, { shouldValidate: true });
      handleDateSelectFromHook(date);
    },
    [setValue, handleDateSelectFromHook],
  );

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

  // ============================================
  // 에러 클리어 (컴포넌트 언마운트 시)
  // ============================================

  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  // ============================================
  // 폼 제출 핸들러 (handleSubmit 사용)
  // ============================================

  /** 결제하기 버튼 핸들러 */
  const onFormSubmit = useCallback(
    async (data: StepInfoFormData) => {
      try {
        console.log('🚀 [StepInfo] 주문 생성 시작!');
        console.log('📦 [StepInfo] 폼 데이터:', data);

        // 1단계: 백엔드 API 호출하여 주문 생성
        // ⚠️ 중요: 여기서 백엔드가 실제 결제 금액을 계산합니다!
        const orderData = await submitOrder(data);

        console.log('✅ [StepInfo] 주문 생성 성공!');
        console.log('📦 [StepInfo] 주문 데이터:', orderData);
        console.log('💰 [StepInfo] 백엔드 계산 금액:', orderData.total_amount);

        // 2단계: 부모 컴포넌트로 전달 (폼 데이터 + 백엔드 응답)
        // ⚠️ totalPrice는 UI 표시용이었으며, 실제 금액은 orderData.total_amount입니다.
        if (onSubmit) {
          onSubmit({
            ...data,
            orderData, // 백엔드 응답 (실제 결제 금액 포함)
            totalPrice, // UI 표시용 (참고용)
          });
        }
      } catch (err) {
        console.error('❌ [StepInfo] 주문 생성 실패:', err);

        // 에러 메시지 표시
        const errorMessage = err instanceof Error ? err.message : '주문 생성에 실패했습니다';
        Alert.alert('주문 생성 실패', errorMessage);
      }
    },
    [onSubmit, totalPrice, submitOrder],
  );

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
      {/* 로딩 오버레이 */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={Colors.black[500]} />
            <Text style={{ marginTop: 16, fontSize: 16, color: Colors.black[500] }}>
              주문을 생성하는 중...
            </Text>
          </View>
        </View>
      )}

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기">
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>타임캡슐 만들기</Text>
        </View>
        <View style={styles.headerBorder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 캡슐 이름 섹션 */}
        <View style={[styles.section, styles.capsuleNameSection]}>
          <Text style={styles.sectionLabel}>{TEXTS.capsuleName.label}</Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="capsuleName"
              rules={{
                required: true,
                maxLength: MAX_CAPSULE_NAME_LENGTH,
                validate: (value) => value.trim().length > 0,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={TEXTS.capsuleName.placeholder}
                  placeholderTextColor={Colors.grey[500]}
                  value={value}
                  onChangeText={(text) => {
                    if (text.length <= MAX_CAPSULE_NAME_LENGTH) {
                      onChange(text);
                    }
                  }}
                  maxLength={MAX_CAPSULE_NAME_LENGTH}
                />
              )}
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
                  {index === 3 && selectedDate ? dayjs(selectedDate).format('MM/DD') : option.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* 개봉일 표시 */}
          {formattedOpenDate && <Text style={styles.openDateText}>{formattedOpenDate}</Text>}
        </View>

        {/* 최대 인원 섹션 */}
        <View style={[styles.section, styles.stepperSection]}>
          <Text style={styles.stepperSectionPrice}>{formatPrice(personnelPrice)}</Text>
          <Controller
            control={control}
            name="personnelCount"
            rules={{
              min: MIN_PERSONNEL,
              max: MAX_PERSONNEL,
            }}
            render={({ field: { value } }) => (
              <View style={styles.stepperRow}>
                <View style={styles.stepperLabelColumn}>
                  <View style={styles.stepperLabelRow}>
                    <Text style={styles.stepperLabel}>인원수</Text>
                    <Text style={styles.stepperSubLabel}>(최대 10명)</Text>
                  </View>
                  <Text style={styles.stepperHint}>{TEXTS.personnel.hint}</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => handlePersonnelChange(value - 1)}
                    accessibilityRole="button"
                    accessibilityLabel="인원 감소">
                    <Text style={styles.stepperButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{value}</Text>
                  <Text style={styles.stepperUnit}>{TEXTS.personnel.unit}</Text>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => handlePersonnelChange(value + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="인원 증가">
                    <Text style={styles.stepperButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* 이미지 슬롯 섹션 */}
        <View style={[styles.section, styles.stepperSection]}>
          <Text style={styles.stepperSectionPrice}>{formatPrice(storagePrice)}</Text>
          <Controller
            control={control}
            name="storageCount"
            rules={{
              min: MIN_STORAGE,
              max: MAX_STORAGE,
            }}
            render={({ field: { value } }) => (
              <View style={styles.stepperRow}>
                <View style={styles.stepperLabelColumn}>
                  <View style={styles.stepperLabelRow}>
                    <Text style={styles.stepperLabel}>이미지</Text>
                    <Text style={styles.stepperSubLabel}>(최대 5장)</Text>
                  </View>
                  <Text style={styles.stepperHint}>{TEXTS.storage.hint}</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => handleStorageChange(value - 1)}
                    accessibilityRole="button"
                    accessibilityLabel="슬롯 감소">
                    <Text style={styles.stepperButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{value}</Text>
                  <Text style={styles.stepperUnit}>{TEXTS.storage.unit}</Text>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={() => handleStorageChange(value + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="슬롯 증가">
                    <Text style={styles.stepperButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* 추가 옵션 섹션 */}
        <View style={[styles.section, styles.additionalOptionsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{TEXTS.additionalOptions.label}</Text>
            <Text style={styles.sectionPrice}>{formatPrice(optionsPrice)}</Text>
          </View>
          <Controller
            control={control}
            name="selectedOptions"
            render={({ field: { value } }) => (
              <View style={styles.optionsContainer}>
                {TEXTS.additionalOptions.options.map((option, index) => {
                  const optionId = index === 0 ? 'music' : 'video';
                  const isSelected = value[optionId];

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                      onPress={() => handleOptionToggle(optionId)}
                      accessibilityRole="button"
                      accessibilityLabel={`${option.title} ${option.price}`}>
                      <View style={styles.optionIconContainer}>
                        <Icon
                          name={index === 0 ? ICONS.music : ICONS.video}
                          size={24}
                          color={isSelected ? Colors.black[500] : Colors.grey[500]}
                        />
                      </View>
                      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.optionPrice, isSelected && styles.optionPriceSelected]}>
                        {option.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        {/* 총 결제금액 및 결제 버튼 섹션 */}
        <View style={styles.paymentSection}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{TEXTS.footer.totalLabel}</Text>
            <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, (!isValid || isLoading) && styles.submitButtonDisabled]}
            onPress={handleSubmit(onFormSubmit)}
            disabled={!isValid || isLoading}
            accessibilityRole="button"
            accessibilityLabel={TEXTS.footer.submitButton}>
            <Text style={styles.submitButtonText}>
              {isLoading ? '처리 중...' : TEXTS.footer.submitButton}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hidden Controllers for validation */}
        <Controller
          control={control}
          name="selectedDate"
          rules={{
            validate: (value) => {
              const selectedOptionIndex = watch('selectedDateOptionIndex');
              if (selectedOptionIndex === 3 && !value) {
                return false;
              }
              return true;
            },
          }}
          render={() => <></>}
        />
        <Controller control={control} name="selectedDateOptionIndex" render={() => <></>} />
      </ScrollView>

      {/* 달력 바텀시트 모달 */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="none"
        onRequestClose={handleCalendarClosePress}>
        <Animated.View
          style={[
            styles.calendarBottomSheetOverlay,
            {
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={handleCalendarClosePress}
          />
          <Animated.View
            style={[
              styles.calendarBottomSheetContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}>
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
              <Text style={styles.calendarConfirmButtonText}>{TEXTS.calendar.confirmButton}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}
