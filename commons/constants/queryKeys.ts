/**
 * Query Key Factory
 * 모든 React Query Key는 이 Factory 객체를 통해서만 생성합니다.
 * 
 * 사용 예시:
 * - 단일 쿼리: queryKeys.userInfo()
 * - 파라미터 쿼리: queryKeys.capsuleDetail({ capsuleId: '123', lat: 37.5, lng: 127.0 })
 * - 리스트 쿼리: queryKeys.capsules({ lat: 37.5, lng: 127.0, radius_m: 300 })
 */

export const queryKeys = {
  /**
   * 사용자 정보 조회
   * GET /api/auth/me
   */
  userInfo: () => ['userInfo'] as const,

  /**
   * 캡슐 상세 정보 조회
   * GET /api/capsules/{id}?lat={latitude}&lng={longitude}
   */
  capsuleDetail: (params: { capsuleId: string; lat: number; lng: number }) =>
    ['capsuleDetail', params.capsuleId, params.lat, params.lng] as const,

  /**
   * 캡슐 목록 조회
   * GET /api/capsules?lat={latitude}&lng={longitude}&radius_m={radius}&limit={limit}
   */
  capsules: (params: {
    lat: number;
    lng: number;
    radius_m?: number;
    limit?: number;
    include_locationless?: boolean;
    include_consumed?: boolean;
  }) =>
    [
      'capsules',
      params.lat,
      params.lng,
      params.radius_m,
      params.limit,
      params.include_locationless,
      params.include_consumed,
    ] as const,

  /**
   * 이스터에그 슬롯 정보 조회
   * GET /api/capsules/slots
   */
  eggSlotData: () => ['eggSlotData'] as const,

  /**
   * 캡슐 목록 쿼리 무효화용 prefix
   * 모든 캡슐 목록 쿼리를 무효화할 때 사용
   * invalidateQueries에서 prefix 매칭에 사용
   */
  capsulesAll: () => ['capsules'] as const,
} as const;

