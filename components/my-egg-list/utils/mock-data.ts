/**
 * components/my-egg-list/utils/mock-data.ts
 * 백엔드 API 응답 구조와 일치하는 Mock 데이터
 *
 * @description
 * - 백엔드 API 응답 타입(PlantedEggsResponse, FoundEggsResponse)과 일치하는 mock 데이터
 * - transformers.ts의 변환 함수를 통해 UI 타입으로 변환 가능
 * - 개발/테스트 목적으로 사용
 */

import type {
  FoundEggItem,
  FoundEggsResponse,
  PlantedEggItem,
  PlantedEggsResponse,
} from '../types';

/**
 * Mock 데이터: 심은 알 API 응답
 * - activeEggs와 expiredEggs를 포함
 * - 실제 백엔드 응답 구조와 일치
 */
export const MOCK_PLANTED_EGGS_RESPONSE: PlantedEggsResponse = {
  summary: {
    totalPlantedCount: 5,
    activeCount: 3,
  },
  data: {
    activeEggs: [
      {
        eggId: 101,
        title: '응원의 메시지',
        content: '너는 할 수 있어! 항상 응원할게 파이팅!!',
        viewCount: 1,
        location: '서울 명동',
        createdDate: '2024-12-01T10:00:00Z',
        hasImage: true,
        hasAudio: true,
        status: 'ACTIVE',
      },
      {
        eggId: 102,
        title: '우리의 첫 만남',
        content:
          '2024년 3월, 그날의 카페에서 우연히 마주친 순간을 기억해? 네가 주문한 아이스 아메리카노를 받으러 가는데 내 이름을 불러서 깜짝 놀랐었지.',
        viewCount: 0,
        location: '서울 강남',
        createdDate: '2024-03-15T14:30:00Z',
        hasImage: true,
        hasAudio: false,
        status: 'ACTIVE',
      },
      {
        eggId: 103,
        title: '졸업 축하',
        content: '드디어 졸업했구나! 정말 축하해. 앞으로도 화이팅!',
        viewCount: 2,
        location: '서울 홍대',
        createdDate: '2024-10-30T09:15:00Z',
        hasImage: true,
        hasAudio: true,
        status: 'ACTIVE',
      },
    ],
    expiredEggs: [
      {
        eggId: 104,
        title: '추억의 순간',
        content: '이 노래 들으면서 이 사진 보면 그날 생각날 거야!',
        viewCount: 3,
        location: '인천 송도',
        createdDate: '2024-12-01T08:00:00Z',
        hasImage: true,
        hasAudio: true,
        status: 'EXPIRED',
      },
      {
        eggId: 105,
        title: '2024 생일 포카',
        content: '내 생일에 몰래 준비한 깜짝 파티 진짜 최고였어!',
        viewCount: 1,
        location: '부산 해운대',
        createdDate: '2024-11-08T16:20:00Z',
        hasImage: false,
        hasAudio: true,
        status: 'EXPIRED',
      },
    ],
  },
};

/**
 * Mock 데이터: 발견한 알 API 응답
 * - foundDate 기준으로 정렬됨 (최신순)
 * - 실제 백엔드 응답 구조와 일치
 */
export const MOCK_FOUND_EGGS_RESPONSE: FoundEggsResponse = {
  summary: {
    totalFoundCount: 5,
  },
  data: [
    {
      eggId: 201,
      title: '추억의 순간',
      content: '이 노래 들으면서 이 사진 보면 그날 생각날 거야! 정말 좋은 날이었지?',
      viewCount: 1,
      location: '인천 송도',
      foundDate: '2024-12-01T14:30:00Z',
      plantedDate: '2024-11-25T10:00:00Z',
      hasImage: true,
      hasAudio: true,
    },
    {
      eggId: 202,
      title: '생일 파티',
      content: '내 생일에 몰래 준비한 깜짝 파티 진짜 최고였어! 케이크 들고 나타났을 때 울컥했었다는 거 들켰지?',
      viewCount: 0,
      location: '서울 강남',
      foundDate: '2024-11-28T18:45:00Z',
      plantedDate: '2024-11-20T12:00:00Z',
      hasImage: true,
      hasAudio: false,
    },
    {
      eggId: 203,
      title: '졸업 여행',
      content: '우리 첫 해외 여행! 일본에서 먹은 라멘이 아직도 생각나. 다음엔 어디 갈까?',
      viewCount: 2,
      location: '부산 해운대',
      foundDate: '2024-11-25T11:20:00Z',
      plantedDate: '2024-11-15T09:00:00Z',
      hasImage: false,
      hasAudio: true,
    },
    {
      eggId: 204,
      title: '좋아하는 노래',
      content: '이 노래 들을 때마다 네 생각이 나. 우리가 함께 들었던 그날처럼.',
      viewCount: 5,
      location: '서울 홍대',
      foundDate: '2024-11-20T15:10:00Z',
      plantedDate: '2024-11-10T14:00:00Z',
      hasImage: false,
      hasAudio: true,
    },
    {
      eggId: 205,
      title: '응원의 메시지',
      content: '힘들 때마다 이 메시지 읽어봐. 넌 할 수 있어! 항상 응원할게.',
      viewCount: 3,
      location: '인천 송도',
      foundDate: '2024-11-15T10:30:00Z',
      plantedDate: '2024-11-05T08:00:00Z',
      hasImage: false,
      hasAudio: false,
    },
  ],
};

