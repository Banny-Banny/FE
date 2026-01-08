/**
 * components/timecapsule-create/components/step-room/api/capsule.ts
 * 캡슐 대기실 API 함수
 */

import { apiClient, publicApiClient } from '@/utils/apiClient';
import type {
  CapsuleSubmitRequest,
  CapsuleSubmitResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  InviteCodeQueryResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  OrderResponse,
  RoomDetailResponse,
  RoomSettingsResponse,
} from '../types';

/**
 * 대기실 생성 및 설정값 조회 API (1단계)
 * @param orderId 주문 ID (UUID)
 * @returns 대기실 생성 응답 (snake_case) - 실제 API 응답 구조
 * @throws 400: 잘못된 order_id 형식
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 404: 존재하지 않는 order_id
 * @throws 500: 서버 내부 오류
 */
export async function createRoomAndGetSettings(orderId: string): Promise<CreateRoomResponse> {
  try {
    console.log('🔄 [API] 대기실 생성 및 설정값 조회 시작 - orderId:', orderId);

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    const response = await apiClient.post<CreateRoomResponse, CreateRoomRequest>(
      '/api/capsules/step-rooms/create',
      {
        order_id: orderId,
      },
    );

    console.log('✅ [API] 대기실 생성 및 설정값 조회 성공:', response.data);

    // 🔍 백엔드 변경사항 확인용 상세 로그
    console.log('🔍 [API] capsule_title 확인:', (response.data as any).capsule_title || response.data.title);
    console.log('🔍 [API] invite_code 확인:', response.data.invite_code);
    console.log('🔍 [API] 딥링크 확인:', (response.data as any).deep_link || `timeegg://room/join?invite_code=${response.data.invite_code}`);
    console.log('🔍 [API] 전체 응답 객체:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error('❌ [API] 잘못된 order_id 형식 (400)');
      throw new Error('잘못된 주문 ID 형식입니다.');
    }
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 order_id (404)');
      throw new Error('주문 정보를 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 대기실 생성 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 1단계) 주문 정보 조회 API (레거시 호환용)
 * @deprecated 새로운 코드에서는 createRoomAndGetSettings 사용 권장
 * @param orderId 주문 ID (UUID)
 * @returns 주문 정보 (snake_case), order.capsule_id를 추출하여 2단계에서 사용
 * @throws 404: 존재하지 않는 orderId
 * @throws 500: 서버 내부 오류
 */
export async function getOrderInfo(orderId: string): Promise<OrderResponse> {
  try {
    console.log('🔄 [API] 1단계: Order 조회 시작 - orderId:', orderId);

    const response = await apiClient.get<OrderResponse>(`/api/orders/${orderId}`);

    console.log('✅ [API] 1단계: Order 조회 성공 - capsule_id:', response.data.order.capsule_id);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error('❌ [API] 1단계: 주문 정보를 찾을 수 없습니다 (404)');
      throw new Error('주문 정보를 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 1단계: 서버 내부 오류 (500)');
      throw new Error(`Order API 호출 실패: 500`);
    }
    console.error('❌ [API] 1단계: Order 조회 실패:', error.message);
    throw new Error(`Order API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 2단계) 대기실 설정값 조회 API (레거시 호환용)
 * @deprecated 새로운 코드에서는 createRoomAndGetSettings 사용 권장
 * @param capsuleId 캡슐 ID (UUID) - 1단계에서 추출한 order.capsule_id
 * @returns 대기실 설정값 (snake_case)
 * @throws 404: 존재하지 않는 capsuleId 또는 주문 정보 없음
 * @throws 500: 서버 내부 오류
 */
export async function getRoomSettings(capsuleId: string): Promise<RoomSettingsResponse> {
  try {
    console.log('🔄 [API] 2단계: Room Settings 조회 시작 - capsuleId:', capsuleId);

    const response = await apiClient.get<RoomSettingsResponse>(
      `/api/capsules/step-rooms/${capsuleId}/settings`,
    );

    console.log('✅ [API] 2단계: Room Settings 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error('❌ [API] 2단계: 대기실 또는 주문 정보를 찾을 수 없습니다 (404)');
      throw new Error('대기실 또는 주문 정보를 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 2단계: 서버 내부 오류 (500)');
      throw new Error(`Room Settings API 호출 실패: 500`);
    }
    console.error('❌ [API] 2단계: Room Settings 조회 실패:', error.message);
    throw new Error(`Room Settings API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 2단계 API 호출 통합 함수 (레거시 호환용)
 * - fetchRoomSettings는 기존 useRoomData.ts에서 사용되던 함수명
 * - capsuleId를 받아서 바로 Room Settings를 조회
 * - orderId 기반 2단계 플로우가 아닌 직접 capsuleId 조회용
 * @deprecated 새로운 코드에서는 getOrderInfo → getRoomSettings 2단계 플로우 사용 권장
 */
export async function fetchRoomSettings(capsuleId: string): Promise<RoomSettingsResponse> {
  console.log('⚠️ [API] fetchRoomSettings (레거시) 호출 - capsuleId:', capsuleId);
  return getRoomSettings(capsuleId);
}

/**
 * 대기실 상세 조회 API (참여자 슬롯 정보 포함)
 * @param capsuleId 캡슐 ID (UUID)
 * @returns 대기실 상세 정보 (슬롯 정보 포함)
 * @throws 400: 잘못된 UUID 형식
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 403: 참여자가 아닌 사용자의 접근
 * @throws 404: 존재하지 않는 capsuleId
 * @throws 500: 서버 내부 오류
 */
export async function getRoomDetail(capsuleId: string): Promise<RoomDetailResponse> {
  try {
    console.log('🔄 [API] 대기실 상세 조회 시작 - capsuleId:', capsuleId);

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    const response = await apiClient.get<RoomDetailResponse>(
      `/api/capsules/step-rooms/${capsuleId}`,
    );

    console.log('✅ [API] 대기실 상세 조회 성공:', response.data);
    console.log('🔍 [API] slots 상세:', JSON.stringify(response.data.slots, null, 2));
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error('❌ [API] 잘못된 UUID 형식 (400)');
      throw new Error('잘못된 캡슐 ID 형식입니다.');
    }
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 403) {
      console.error('❌ [API] 권한 없음 (403)');
      throw new Error('참여자만 조회할 수 있습니다.');
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 capsuleId (404)');
      throw new Error('대기실을 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 대기실 상세 조회 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 초대 코드로 대기실 조회 API (Public API - 인증 불필요)
 * @param inviteCode 초대 코드 (6자리 영숫자, 대소문자 구분 없음)
 * @returns 대기실 정보 (snake_case)
 * @throws 400: 초대 코드 누락/형식 오류
 * @throws 404: 존재하지 않는 초대 코드
 */
export async function fetchRoomByInviteCode(inviteCode: string): Promise<InviteCodeQueryResponse> {
  try {
    // 초대 코드 검증 (6자리 영숫자)
    if (!inviteCode || !/^[A-Za-z0-9]{6}$/.test(inviteCode)) {
      throw new Error('유효하지 않은 초대 코드입니다. (6자리 영숫자)');
    }

    // 대소문자 구분 없이 처리 (대문자로 변환하여 일관성 유지)
    const normalizedCode = inviteCode.toUpperCase();

    console.log('🔄 [API] 초대 코드로 대기실 조회 시작 - inviteCode:', normalizedCode);

    const response = await publicApiClient.get<InviteCodeQueryResponse>(
      `/api/capsules/step-rooms/by-code?invite_code=${encodeURIComponent(normalizedCode)}`,
    );

    console.log('✅ [API] 초대 코드로 대기실 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error('❌ [API] 초대 코드 형식 오류 (400)');
      throw new Error('유효하지 않은 초대 코드입니다.');
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 초대 코드입니다 (404)');
      throw new Error('존재하지 않는 초대 코드입니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    // 클라이언트 검증 에러 (형식 검증)
    if (error.message && error.message.includes('유효하지 않은 초대 코드')) {
      console.error('❌ [API] 유효하지 않은 초대 코드 형식:', inviteCode);
      throw error;
    }
    console.error('❌ [API] 초대 코드로 대기실 조회 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 대기실 참여 (슬롯 배정) API
 * @param capsuleId 캡슐 ID (UUID)
 * @param inviteCode 초대 코드 (6자리 영숫자)
 * @returns 슬롯 배정 결과
 * @throws 403: 잘못된 초대 코드, 마감시한 경과, 또는 정원 초과
 * @throws 404: 존재하지 않는 대기실
 * @throws 409: 이미 참여 중
 */
export async function joinRoom(capsuleId: string, inviteCode: string): Promise<JoinRoomResponse> {
  try {
    console.log('🔄 [API] 대기실 참여 (슬롯 배정) 시작 - capsuleId:', capsuleId, 'inviteCode:', inviteCode);

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    const response = await apiClient.post<JoinRoomResponse, JoinRoomRequest>(
      `/api/capsules/step-rooms/${capsuleId}/join`,
      {
        invite_code: inviteCode.toUpperCase(),
      },
    );

    console.log('✅ [API] 대기실 참여 성공:', response.data);
    console.log('  🎫 배정받은 슬롯 번호:', response.data.slot_number);
    console.log('  👤 닉네임:', response.data.nickname);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.error;
      if (errorCode === 'INVALID_INVITE_CODE') {
        console.error('❌ [API] 잘못된 초대 코드 (403)');
        throw new Error('잘못된 초대 코드입니다.');
      }
      if (errorCode === 'DEADLINE_EXPIRED') {
        console.error('❌ [API] 마감시한 경과 (403)');
        throw new Error('작성 마감시한이 지났습니다.');
      }
      if (errorCode === 'SLOTS_FULL') {
        console.error('❌ [API] 정원 초과 (403)');
        throw new Error('정원이 초과되었습니다.');
      }
      console.error('❌ [API] 참여 권한 없음 (403)');
      throw new Error('대기실에 참여할 수 없습니다.');
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 대기실 (404)');
      throw new Error('대기실을 찾을 수 없습니다.');
    }
    if (error.response?.status === 409) {
      // 이미 참여 중이면 에러가 아니라 정상 케이스로 처리 (슬롯 번호 반환)
      const slotNumber = error.response?.data?.data?.slot_number;
      if (slotNumber) {
        console.log('✅ [API] 이미 참여 중입니다. 기존 슬롯 번호:', slotNumber);
        // 이미 참여 중이면 성공 응답처럼 반환
        return {
          success: true,
          room_id: capsuleId,
          slot_number: slotNumber,
          nickname: '', // 닉네임은 별도로 조회 필요
          joined_at: new Date().toISOString(),
        };
      }
      console.error('❌ [API] 이미 참여 중이지만 슬롯 번호를 받지 못함 (409)');
      throw new Error('이미 참여 중입니다.');
    }
    console.error('❌ [API] 대기실 참여 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 타임캡슐 최종 제출 API (위치 지정 및 매장)
 * @param roomId 캡슐 ID (UUID)
 * @param location 매장 위치 (latitude, longitude)
 * @returns 매장 결과 정보
 * @throws 400: INCOMPLETE_PARTICIPANTS (미완료 참여자), INVALID_LOCATION (유효하지 않은 위치), PAYMENT_NOT_COMPLETED (결제 미완료)
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 403: 방장이 아닌 사용자의 제출 시도
 * @throws 404: 존재하지 않는 roomId
 * @throws 409: 이미 제출된 캡슐 (중복 제출)
 * @throws 500: 서버 내부 오류
 */
export async function submitCapsule(
  roomId: string,
  location: CapsuleSubmitRequest,
): Promise<CapsuleSubmitResponse> {
  try {
    console.log('🔄 [API] 타임캡슐 제출 시작 - roomId:', roomId, 'location:', location);

    // 클라이언트 측 위치 검증
    if (
      location.latitude < -90 ||
      location.latitude > 90 ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      throw new Error('유효하지 않은 위도 또는 경도입니다.');
    }

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    const response = await apiClient.post<CapsuleSubmitResponse>(
      `/api/capsules/step-rooms/${roomId}/submit`,
      location,
    );

    console.log('✅ [API] 타임캡슐 제출 성공:', response.data);
    return response.data;
  } catch (error: any) {
    // 400 에러 상세 처리
    if (error.response?.status === 400) {
      const errorCode = error.response?.data?.error;
      if (errorCode === 'INCOMPLETE_PARTICIPANTS') {
        console.error('❌ [API] 모든 참여자가 작성을 완료하지 않음 (400)');
        throw new Error('모든 참여자가 저장을 완료해야 제출할 수 있습니다.');
      }
      if (errorCode === 'INVALID_LOCATION') {
        console.error('❌ [API] 유효하지 않은 위치 (400)');
        throw new Error('유효하지 않은 위도 또는 경도입니다.');
      }
      if (errorCode === 'PAYMENT_NOT_COMPLETED') {
        console.error('❌ [API] 결제가 완료되지 않음 (400)');
        throw new Error('결제를 완료해주세요.');
      }
      console.error('❌ [API] 잘못된 요청 (400)');
      throw new Error('잘못된 요청입니다.');
    }
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 403) {
      console.error('❌ [API] 방장이 아닌 사용자의 제출 시도 (403)');
      throw new Error('방장만 최종 제출할 수 있습니다.');
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 roomId (404)');
      throw new Error('캡슐을 찾을 수 없습니다.');
    }
    if (error.response?.status === 409) {
      console.error('❌ [API] 이미 제출된 캡슐 (409)');
      throw new Error('이미 제출된 캡슐입니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 타임캡슐 제출 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}
