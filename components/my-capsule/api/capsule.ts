/**
 * components/my-capsule/api/capsule.ts
 * 참여중인 타임캡슐 리스트 조회 API
 */

import { apiClient } from '@/utils/apiClient';
import type {
  AudioMedia,
  Author,
  CapsuleSlot,
  CapsuleStats,
  ImageMedia,
  MyCapsuleListResponse,
  OpenedCapsuleDetailResponse,
  SlotContent,
  VideoMedia,
} from '../types';

/**
 * 참여중인 타임캡슐 리스트 조회 API
 * ⭐ 기본 동작: 전체 데이터를 자동으로 페이지네이션하여 가져옴
 *
 * @param fetchAll true면 전체 데이터 자동 수집 (기본값: true)
 * @param limit 한 페이지 크기 (기본값: 20)
 * @param offset 단일 페이지 조회 시 시작 위치 (fetchAll=false일 때만 사용)
 * @returns 참여중인 타임캡슐 리스트 (camelCase)
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 500: 서버 내부 오류
 */
export async function getMyCapsules(
  fetchAll: boolean = true,
  limit: number = 20,
  offset: number = 0,
): Promise<MyCapsuleListResponse> {
  try {
    // 첫 번째 요청으로 total 확인
    const firstResponse = await apiClient.get<MyCapsuleListResponse>('/api/me/capsules', {
      params: { limit, offset },
    });

    // fetchAll이 false이거나 전체 데이터가 이미 다 왔으면 바로 반환
    if (!fetchAll || firstResponse.data.items.length >= firstResponse.data.total) {
      return firstResponse.data;
    }

    // 전체 데이터 수집 필요 - 병렬로 나머지 페이지 요청
    const allItems = [...firstResponse.data.items];
    const totalCount = firstResponse.data.total;
    const remainingCount = totalCount - allItems.length;

    if (remainingCount > 0) {
      // 필요한 추가 요청 계산
      const additionalRequests: Promise<MyCapsuleListResponse>[] = [];
      let currentOffset = limit;

      while (currentOffset < totalCount) {
        additionalRequests.push(
          apiClient
            .get<MyCapsuleListResponse>('/api/me/capsules', {
              params: { limit, offset: currentOffset },
            })
            .then((res) => res.data),
        );
        currentOffset += limit;
      }

      // 모든 요청을 병렬로 실행
      const additionalResponses = await Promise.all(additionalRequests);

      // 모든 아이템 합치기
      additionalResponses.forEach((response) => {
        allItems.push(...response.items);
      });
    }

    // 전체 데이터 반환
    return {
      items: allItems,
      total: totalCount,
      limit: allItems.length,
      offset: 0,
      hasNext: false,
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 500) {
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * API 응답의 snake_case 슬롯을 camelCase로 변환
 */
interface ApiSlotResponse {
  slot_id: string;
  slot_index: number;
  user_id: string | null;
  nickname: string | null;
  profile_img: string | null;
  entry_id: string | null;
  wrote_at: string | null;
  text_message: string | null; // ⭐ API는 content가 아닌 text_message를 반환
  images_ids: Array<{
    media_id: string;
    object_key: string;
  }> | null;
  audio_id: {
    media_id: string;
    object_key: string;
  } | null;
  video_id: {
    media_id: string;
    object_key: string;
  } | null;
}

interface ApiCapsuleDetailResponse {
  id: string;
  title: string;
  description: string | null;
  open_at: string;
  is_locked: boolean;
  headcount: number;
  product: {
    id: string;
    product_type: string;
    max_media_count: number;
    media_types: string[];
  };
  slots: ApiSlotResponse[];
  stats?: {
    total_slots: number;
    filled_slots: number;
    empty_slots: number;
  };
}

function transformSlotContent(
  textMessage: string | null,
  imagesIds: ApiSlotResponse['images_ids'],
  audioId: ApiSlotResponse['audio_id'],
  videoId: ApiSlotResponse['video_id'],
): SlotContent | undefined {
  if (!textMessage && (!imagesIds || imagesIds.length === 0) && !audioId && !videoId) {
    return undefined;
  }

  const result: SlotContent = {};

  // 텍스트 콘텐츠
  if (textMessage) {
    result.text = textMessage;
  }

  // 이미지 변환 - media_id만 저장 (URL은 컴포넌트에서 가져옴)
  if (imagesIds && imagesIds.length > 0) {
    result.images = imagesIds.map((img) => ({
      id: img.media_id,
      url: '', // 컴포넌트에서 getMediaUrl로 가져옴
      objectKey: img.object_key, // object_key도 저장해두기
    }));
  }

  // 비디오 변환
  if (videoId) {
    result.video = {
      id: videoId.media_id,
      url: '', // 컴포넌트에서 getMediaUrl로 가져옴
      thumbnailUrl: '', // 컴포넌트에서 처리
      objectKey: videoId.object_key,
    };
  }

  // 오디오 변환
  if (audioId) {
    result.audio = {
      id: audioId.media_id,
      title: '오디오',
      url: '', // 컴포넌트에서 getMediaUrl로 가져옴
      objectKey: audioId.object_key,
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function transformApiResponse(apiResponse: ApiCapsuleDetailResponse): OpenedCapsuleDetailResponse {
  const isLocked = apiResponse.is_locked;

  const slots: CapsuleSlot[] = apiResponse.slots.map((slot) => {
    // 작성 여부 판단:
    // ⭐ entry_id가 있으면 작성된 것으로 간주 (가장 중요!)
    const hasEntry = slot.entry_id !== null;

    // entry_id가 없어도 text_message나 media가 있으면 작성된 것으로 간주
    const hasContent = slot.text_message !== null && slot.text_message.trim() !== '';
    const hasImages = slot.images_ids && slot.images_ids.length > 0;
    const hasAudio = slot.audio_id !== null;
    const hasVideo = slot.video_id !== null;
    const hasMedia = hasImages || hasAudio || hasVideo;

    // 작성 여부: entry_id가 있거나, text_message/media가 있으면 작성된 것
    const isWritten = hasEntry || hasContent || hasMedia;

    // 작성자 정보 (user_id가 있으면 작성자가 있는 것)
    const author: Author = slot.user_id
      ? {
          id: slot.user_id,
          name: slot.nickname || '익명',
          emoji: '😊', // 기본 이모지 (API에 이모지 필드가 없음)
          profileImg: slot.profile_img || undefined,
        }
      : {
          id: '',
          name: '빈 슬롯',
          emoji: '🥚',
        };

    // 🔒 잠긴 상태일 때는 콘텐츠를 숨김
    // 🔓 열린 상태일 때만 콘텐츠 표시
    const content = isLocked
      ? undefined
      : transformSlotContent(slot.text_message, slot.images_ids, slot.audio_id, slot.video_id);

    return {
      slotId: slot.slot_id,
      author,
      isWritten,
      content: isWritten && !isLocked ? content : undefined,
    };
  });

  // 통계 정보 변환 (있는 경우만)
  const stats: CapsuleStats | undefined = apiResponse.stats
    ? {
        totalSlots: apiResponse.stats.total_slots,
        filledSlots: apiResponse.stats.filled_slots,
        emptySlots: apiResponse.stats.empty_slots,
      }
    : undefined;

  return {
    id: apiResponse.id,
    title: apiResponse.title,
    headcount: apiResponse.headcount,
    isLocked,
    slots,
    stats,
  };
}

/**
 * 타임캡슐 상세 조회 API
 * ⭐ 결제 완료된 캡슐만 조회 가능
 * @param id 캡슐 ID (UUID)
 * @param userId 사용자 ID (UUID) - 다른 사람 게시물을 보기 위해 필요
 * @returns 타임캡슐 상세 정보 (camelCase)
 * @throws 403: 권한 없음 또는 미결제
 * @throws 404: 캡슐 미존재
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 500: 서버 내부 오류
 */
export async function getOpenedCapsuleDetail(
  id: string,
  userId: string,
): Promise<OpenedCapsuleDetailResponse> {
  try {
    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킨다
    const response = await apiClient.get<ApiCapsuleDetailResponse>(`/api/timecapsules/${id}`, {
      params: { user_id: userId },
    });

    // snake_case 응답을 camelCase로 변환
    const transformedData = transformApiResponse(response.data);

    return transformedData;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('결제가 완료되지 않았거나 권한이 없습니다.');
    }
    if (error.response?.status === 404) {
      throw new Error('캡슐을 찾을 수 없습니다.');
    }
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 500) {
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}
