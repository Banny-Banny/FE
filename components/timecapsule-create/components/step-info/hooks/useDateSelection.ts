/**
 * step-info/hooks/useDateSelection.ts
 * 생성 시각: 2024-12-16
 * 수정 시각: 2024-12-23 (개봉일 가격 제거)
 * 개봉일 선택 Hook
 */

import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DATE_OPTION_INDEX } from '../constants';
import type { UseDateSelectionReturn } from '../types';

/**
 * 개봉일 선택 상태 관리 및 가격 계산 Hook
 *
 * @param initialData 초기 데이터 (뒤로가기 시 복원용)
 * @returns {UseDateSelectionReturn} 개봉일 선택 관련 상태 및 핸들러
 *
 * @example
 * const {
 *   selectedOptionIndex,
 *   selectedDate,
 *   datePrice,
 *   isCalendarVisible,
 *   handleOptionSelect,
 *   handleDateSelect,
 *   handleCalendarClose
 * } = useDateSelection(initialData);
 */
export const useDateSelection = (initialData?: any): UseDateSelectionReturn => {
  // ============================================
  // 상태 관리
  // ============================================

  /** 선택된 옵션 인덱스 (기본값: 1 = 1년 후) */
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(
    initialData?.selectedDateOptionIndex ?? DATE_OPTION_INDEX.ONE_YEAR,
  );

  /** 선택된 날짜 (직접 선택 시) */
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialData?.selectedDate || null);

  /** 개봉일 가격 (현재 백엔드에서 계산 안 함, 항상 0) */
  const datePrice = 0;

  /** 달력 바텀시트 표시 여부 */
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /**
   * 개봉일 옵션 선택 핸들러
   * @param index 선택된 옵션 인덱스 (0: 1주일, 1: 1년, 2: 3년, 3: 직접선택)
   */
  const handleOptionSelect = useCallback((index: number) => {
    setSelectedOptionIndex(index);

    // 직접 선택이 아닌 경우 선택된 날짜 초기화
    if (index !== DATE_OPTION_INDEX.CUSTOM) {
      setSelectedDate(null);
    } else {
      // 직접 선택인 경우 달력 바텀시트 표시
      setIsCalendarVisible(true);
    }
  }, []);

  /**
   * 달력에서 날짜 선택 핸들러
   * @param date 선택된 날짜
   */
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);

    // 달력 바텀시트 닫기
    setIsCalendarVisible(false);
  }, []);

  /**
   * 달력 바텀시트 닫기 핸들러
   */
  const handleCalendarClose = useCallback(() => {
    setIsCalendarVisible(false);

    // 날짜가 선택되지 않았으면 이전 옵션으로 돌아가기
    if (!selectedDate && selectedOptionIndex === DATE_OPTION_INDEX.CUSTOM) {
      setSelectedOptionIndex(DATE_OPTION_INDEX.ONE_YEAR);
    }
  }, [selectedDate, selectedOptionIndex]);

  // ============================================
  // 계산된 값
  // ============================================

  /**
   * 포맷된 개봉일 문자열 계산
   * "YYYY년 MM월 DD일에 개봉됩니다" 형식
   */
  const formattedOpenDate = useMemo(() => {
    let openDate: dayjs.Dayjs | null = null;

    // 선택된 옵션에 따라 개봉일 계산
    if (selectedOptionIndex === DATE_OPTION_INDEX.ONE_WEEK) {
      openDate = dayjs().add(7, 'day');
    } else if (selectedOptionIndex === DATE_OPTION_INDEX.ONE_YEAR) {
      openDate = dayjs().add(1, 'year');
    } else if (selectedOptionIndex === DATE_OPTION_INDEX.THREE_YEARS) {
      openDate = dayjs().add(3, 'year');
    } else if (selectedOptionIndex === DATE_OPTION_INDEX.CUSTOM && selectedDate) {
      openDate = dayjs(selectedDate);
    }

    // 개봉일이 계산되었으면 포맷팅
    if (openDate) {
      return `${openDate.format('YYYY년 MM월 DD일')}에 개봉됩니다`;
    }

    return null;
  }, [selectedOptionIndex, selectedDate]);

  // ============================================
  // 반환값
  // ============================================

  return {
    selectedOptionIndex,
    selectedDate,
    datePrice,
    isCalendarVisible,
    formattedOpenDate,
    handleOptionSelect,
    handleDateSelect,
    handleCalendarClose,
  };
};
