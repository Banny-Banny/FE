/**
 * step-info/types.ts
 * 생성 시각: 2024-12-16
 * 타임캡슐 정보 입력 화면 타입 정의
 */

// ============================================
// 개봉일 관련 타입
// ============================================

/**
 * 개봉일 옵션 타입
 */
export type DateOption = '1week' | '1year' | '3years' | 'custom';

/**
 * 개봉일 선택 상태
 */
export interface DateSelectionState {
  /** 선택된 옵션 인덱스 (0: 1주일, 1: 1년, 2: 3년, 3: 직접선택) */
  selectedOptionIndex: number;
  /** 선택된 날짜 (직접 선택 시) */
  selectedDate: Date | null;
  /** 계산된 개봉일 가격 */
  datePrice: number;
  /** 달력 바텀시트 표시 여부 */
  isCalendarVisible: boolean;
}

// ============================================
// 추가 옵션 관련 타입
// ============================================

/**
 * 추가 옵션 ID
 */
export type AdditionalOptionId = 'music' | 'video';

/**
 * 추가 옵션 선택 상태
 */
export interface AdditionalOptionsState {
  music: boolean;
  video: boolean;
}

// ============================================
// 가격 관련 타입
// ============================================

/**
 * 가격 상세 내역
 */
export interface PriceBreakdown {
  /** 개봉일 금액 */
  datePrice: number;
  /** 인원 금액 */
  personnelPrice: number;
  /** 이미지 슬롯 금액 */
  storagePrice: number;
  /** 추가 옵션 금액 */
  optionsPrice: number;
  /** 총 금액 */
  totalPrice: number;
}

// ============================================
// 폼 데이터 타입
// ============================================

/**
 * 타임캡슐 정보 입력 폼 데이터
 */
export interface StepInfoFormData {
  /** 캡슐 이름 */
  capsuleName: string;
  /** 선택된 개봉일 옵션 인덱스 */
  selectedDateOptionIndex: number;
  /** 선택된 개봉일 (직접 선택 시) */
  selectedDate: Date | null;
  /** 최대 인원 */
  personnelCount: number;
  /** 이미지 슬롯 */
  storageCount: number;
  /** 선택된 추가 옵션 */
  selectedOptions: AdditionalOptionsState;
}

// ============================================
// Hook 반환 타입
// ============================================

/**
 * useDateSelection Hook 반환 타입
 */
export interface UseDateSelectionReturn {
  /** 선택된 옵션 인덱스 */
  selectedOptionIndex: number;
  /** 선택된 날짜 */
  selectedDate: Date | null;
  /** 계산된 개봉일 가격 */
  datePrice: number;
  /** 달력 표시 여부 */
  isCalendarVisible: boolean;
  /** 포맷된 개봉일 문자열 ("YYYY년 MM월 DD일에 개봉됩니다") */
  formattedOpenDate: string | null;
  /** 옵션 선택 핸들러 */
  handleOptionSelect: (index: number) => void;
  /** 날짜 선택 핸들러 */
  handleDateSelect: (date: Date) => void;
  /** 달력 닫기 핸들러 */
  handleCalendarClose: () => void;
}

/**
 * usePriceCalculation Hook 반환 타입
 */
export interface UsePriceCalculationReturn {
  /** 인원 금액 */
  personnelPrice: number;
  /** 이미지 슬롯 금액 */
  storagePrice: number;
  /** 추가 옵션 금액 */
  optionsPrice: number;
  /** 총 금액 */
  totalPrice: number;
  /** 가격 상세 내역 */
  priceBreakdown: PriceBreakdown;
}

// ============================================
// 유효성 검증 결과 타입
// ============================================

/**
 * 폼 유효성 검증 결과
 */
export interface ValidationResult {
  /** 유효성 검증 통과 여부 */
  isValid: boolean;
  /** 에러 메시지 (검증 실패 시) */
  errorMessage?: string;
}
