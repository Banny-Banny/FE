/**
 * EggDetailFind Component Constants
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { EggDiscoveryData } from './types';

/**
 * Mock 데이터 - 첫번째 발견자 (이미지 O, 음원 X, 동영상 X)
 */
export const MOCK_DATA_FIRST: EggDiscoveryData = {
  eggId: 'egg-001',
  discoveryOrder: 'first',
  author: {
    name: '김서연',
    emoji: '☕️',
  },
  createdAt: '03.15',
  title: '우리의 첫 만남',
  content:
    '2024년 3월, 그날의 카페에서 우연히 마주친 순간을 기억해? 네가 주문한 아이스 아메리카노를 받으러 가는데 내 이름을 불러서 깜짝 놀랐었지. 그게 우리 우정의 시작이었어! ☕️',
  media: [
    {
      id: 'media-001',
      type: 'IMAGE',
      url: 'http://localhost:3845/assets/f67dbfe5ab381e5af79b699522b53fc3d40ed2f2.png',
    },
  ],
  viewCount: {
    current: 1,
    max: 3,
  },
};

/**
 * Mock 데이터 - 두번째 발견자 (이미지 O, 음원 O, 동영상 O)
 */
export const MOCK_DATA_SECOND: EggDiscoveryData = {
  eggId: 'egg-002',
  discoveryOrder: 'second',
  author: {
    name: '김서연',
    emoji: '☕️',
  },
  createdAt: '03.15',
  title: '우리의 첫 만남',
  content:
    '2024년 3월, 그날의 카페에서 우연히 마주친 순간을 기억해? 네가 주문한 아이스 아메리카노를 받으러 가는데 내 이름을 불러서 깜짝 놀랐었지. 그게 우리 우정의 시작이었어! ☕️',
  media: [
    {
      id: 'media-002',
      type: 'IMAGE',
      url: 'http://localhost:3845/assets/f67dbfe5ab381e5af79b699522b53fc3d40ed2f2.png',
    },
    {
      id: 'media-003',
      type: 'AUDIO',
      url: 'http://localhost:3845/assets/audio-sample.mp3',
    },
    {
      id: 'media-004',
      type: 'VIDEO',
      url: 'http://localhost:3845/assets/video-sample.mp4',
      thumbnailUrl: 'http://localhost:3845/assets/1a5305d481814bf4fdf0bb6459731d00332e402c.png',
    },
  ],
  viewCount: {
    current: 2,
    max: 3,
  },
};

/**
 * Mock 데이터 - 마지막 발견자 (이미지 X, 음원 O, 동영상 X)
 */
export const MOCK_DATA_LAST: EggDiscoveryData = {
  eggId: 'egg-003',
  discoveryOrder: 'last',
  author: {
    name: '박지우',
    emoji: '🎂',
  },
  createdAt: '11.08',
  title: '2024 생일 포카',
  content:
    '내 생일에 몰래 준비한 깜짝 파티 진짜 최고였어! 케이크 들고 나타났을 때 울컥했었다는 거 들켰지? 평생 못 잊을 추억 만들어줘서 고마워. 너희가 있어서 정말 행복해 🎂💕',
  media: [
    {
      id: 'media-005',
      type: 'AUDIO',
      url: 'http://localhost:3845/assets/audio-sample.mp3',
    },
  ],
  viewCount: {
    current: 3,
    max: 3,
  },
  isExpiring: true,
};

/**
 * Figma에서 가져온 이미지 URL 상수
 */
export const FIGMA_IMAGES = {
  container: 'http://localhost:3845/assets/139ef261f3f8e3d974bb85b56440d1e7e59685e5.svg',
  icon: 'http://localhost:3845/assets/e4505f0b1b0046e59ca56d0222593c0dc708afa6.svg',
  icon1: 'http://localhost:3845/assets/89c5e6e0afdb493770f11dae7d35effe98ac92ac.svg',
  icon2: 'http://localhost:3845/assets/7401bf1026a71017113362c5199e280af9ca0730.svg',
  icon3: 'http://localhost:3845/assets/2c71746fc25a0f2ddcb440c04b35809fceb8052d.svg',
  icon4: 'http://localhost:3845/assets/347a1eb7a8e04ed54518a4ffbbf633f1f74a8e2a.svg',
  videoThumbnail: 'http://localhost:3845/assets/1a5305d481814bf4fdf0bb6459731d00332e402c.png',
} as const;
