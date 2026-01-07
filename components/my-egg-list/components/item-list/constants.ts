/**
 * components/my-egg-list/components/item-list/constants.ts
 * 이스터에그 목록 Mock 데이터
 *
 * @description
 * - 피그마 디자인 기준으로 작성된 Mock 데이터
 * - UI 컴포넌트에서 직접 사용 가능한 ItemProps 타입
 * - ⚠️ 추후 백엔드 API로 교체될 예정
 * - 백엔드 API 응답 구조와 일치하는 mock 데이터는 utils/transformers.ts 참고
 */

import type { ItemProps } from '../item';

// assets/images의 이미지 사용
const EGG_ICON_1 = require('@/assets/images/filled_egg.svg');
const EGG_ICON_2 = require('@/assets/images/unfilled_egg.svg');
const EGG_ICON_3 = require('@/assets/images/unfilled_egg1.svg');
const EGG_ICON_4 = require('@/assets/images/modal_egg.png');

/**
 * Mock 데이터: 발견한 알 목록
 */
export const MOCK_DISCOVERED_ITEMS: ItemProps[] = [
  {
    id: '1',
    title: '추억의 순간',
    description: '이 노래 들으면서 이 사진 보면 그날 생각날 거야! 정말 좋은 날이었지?',
    location: '인천 송도',
    date: '2024-12-01',
    eggIcon: EGG_ICON_1,
    hasImage: true,
    hasAudio: true,
  },
  {
    id: '2',
    title: '생일 파티',
    description: '내 생일에 몰래 준비한 깜짝 파티 진짜 최고였어! 케이크 들고 나타났을 때 울컥했었다는 거 들켰지?',
    location: '서울 강남',
    date: '2024-11-28',
    eggIcon: EGG_ICON_2,
    hasImage: true,
    hasAudio: false,
  },
  {
    id: '3',
    title: '졸업 여행',
    description: '우리 첫 해외 여행! 일본에서 먹은 라멘이 아직도 생각나. 다음엔 어디 갈까?',
    location: '부산 해운대',
    date: '2024-11-25',
    eggIcon: EGG_ICON_3,
    hasImage: false,
    hasAudio: true,
  },
  {
    id: '4',
    title: '좋아하는 노래',
    description: '이 노래 들을 때마다 네 생각이 나. 우리가 함께 들었던 그날처럼.',
    location: '서울 홍대',
    date: '2024-11-20',
    eggIcon: EGG_ICON_4,
    hasImage: false,
    hasAudio: true,
  },
  {
    id: '5',
    title: '응원의 메시지',
    description: '힘들 때마다 이 메시지 읽어봐. 넌 할 수 있어! 항상 응원할게.',
    location: '인천 송도',
    date: '2024-11-15',
    eggIcon: EGG_ICON_1,
    hasImage: false,
    hasAudio: false,
  },
];

/**
 * Mock 데이터: 심은 알 목록
 */
export const MOCK_PLANTED_ITEMS: ItemProps[] = [
  {
    id: '6',
    title: '우리의 첫 만남',
    description: '2024년 3월, 그날의 카페에서 우연히 마주친 순간을 기억해? 네가 주문한 아이스 아메리카노를 받으러 가는데 내 이름을 불러서 깜짝 놀랐었지.',
    location: '서울 강남',
    date: '2024-03-15',
    eggIcon: EGG_ICON_2,
    hasImage: true,
    hasAudio: false,
  },
  {
    id: '7',
    title: '2024 생일 포카',
    description: '내 생일에 몰래 준비한 깜짝 파티 진짜 최고였어! 케이크 들고 나타났을 때 울컥했었다는 거 들켰지?',
    location: '부산 해운대',
    date: '2024-11-08',
    eggIcon: EGG_ICON_3,
    hasImage: false,
    hasAudio: true,
  },
  {
    id: '8',
    title: '졸업 축하',
    description: '드디어 졸업했구나! 정말 축하해. 앞으로도 화이팅!',
    location: '서울 홍대',
    date: '2024-10-30',
    eggIcon: EGG_ICON_4,
    hasImage: true,
    hasAudio: true,
  },
  {
    id: '9',
    title: '여행 추억',
    description: '제주도 여행에서 찍은 사진들. 바다가 정말 예뻤지? 다음엔 더 오래 머물러야겠어.',
    location: '제주 서귀포',
    date: '2024-10-20',
    eggIcon: EGG_ICON_1,
    hasImage: true,
    hasAudio: false,
  },
  {
    id: '10',
    title: '일상의 소중함',
    description: '평범한 하루도 너와 함께라면 특별해지는 것 같아. 고마워.',
    location: '인천 송도',
    date: '2024-10-10',
    eggIcon: EGG_ICON_2,
    hasImage: false,
    hasAudio: true,
  },
];

