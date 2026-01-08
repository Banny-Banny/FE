/**
 * components/my-egg-list/components/modal/mockData.ts
 * 이스터에그 모달용 Mock 데이터
 */

import type { EasterEggDetailData } from './index';

/**
 * Mock 이스터에그 상세 데이터 (발견한 알)
 */
export const MOCK_FOUND_EGG_DATA: EasterEggDetailData = {
  eggId: 123,
  type: 'FOUND',
  isMine: false,

  // 콘텐츠 정보
  title: '오늘의 행운',
  message: '너 오늘 진짜 멋있더라! 계속 웃으면서 살자 ㅎㅎ',
  imageUrl: 'https://example.com/photo.jpg',
  audioUrl: 'https://example.com/audio.mp3',

  // 위치 정보
  location: {
    address: '서울 강남구',
    latitude: 37.1234,
    longitude: 127.1234,
  },

  // 상태 및 통계 정보
  author: {
    id: 1,
    name: '김민수',
    profileUrl: 'https://example.com/profile.jpg',
  },
  createdAt: '2024-11-10',
  foundAt: '2024-12-01',
  expiredAt: null,
};

/**
 * Mock 이스터에그 상세 데이터 (심은 알)
 */
export const MOCK_PLANTED_EGG_DATA: EasterEggDetailData = {
  eggId: 456,
  type: 'PLANTED',
  isMine: true,

  // 콘텐츠 정보
  title: '좋은 하루',
  message: '오늘도 웃으면서 보내! 넌 최고야',
  imageUrl: 'https://example.com/photo2.jpg',
  videoUrl: 'https://example.com/video.mp4',

  // 위치 정보
  location: {
    address: '서울 서초구',
    latitude: 37.5678,
    longitude: 127.5678,
  },

  // 상태 및 통계 정보
  author: {
    id: 2,
    name: '나',
    profileUrl: 'https://example.com/my-profile.jpg',
  },
  createdAt: '2024-11-15',
  expiredAt: null,
  discoveredCount: 3,
  viewer: {
    id: 3,
    name: '최근 방문자',
    profileUrl: 'https://example.com/viewer.jpg',
  },
};

/**
 * Mock 이스터에그 상세 데이터 리스트 (여러 개)
 */
export const MOCK_EGG_DATA_LIST: EasterEggDetailData[] = [
  MOCK_FOUND_EGG_DATA,
  MOCK_PLANTED_EGG_DATA,
  {
    eggId: 789,
    type: 'FOUND',
    isMine: false,
    title: '행복한 순간',
    message: '이 순간을 잊지 말자. 너는 소중해!',
    location: {
      address: '서울 마포구',
      latitude: 37.9012,
      longitude: 127.9012,
    },
    author: {
      id: 4,
      name: '이영희',
    },
    createdAt: '2024-11-20',
    foundAt: '2024-12-05',
    expiredAt: null,
  },
];

