/**
 * components/timecapsule-create/components/step-room/api/capsule.ts
 * 캡슐 대기실 API 함수
 */

import { apiClient } from '@/utils/apiClient';
import type { OrderResponse, RoomSettingsResponse } from '../types';

/**
 * 1단계) 주문 정보 조회 API
 * @param orderId 주문 ID (UUID)
 * @returns 주문 정보 (snake_case), order.capsule_id를 추출하여 2단계에서 사용
 * @throws 404: 존재하지 않는 orderId
 * @throws 500: 서버 내부 오류
 */
export async function getOrderInfo(orderId: string): Promise<OrderResponse> {
  try {
    console.log('🔄 [API] 1단계: Order 조회 시작 - orderId:', orderId);

    const response = await apiClient.get<OrderResponse>(
      `/api/orders/${orderId}`,
    );

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
 * 2단계) 대기실 설정값 조회 API
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
