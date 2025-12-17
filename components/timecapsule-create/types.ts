/**
 * components/timecapsule/types.ts
 * 타임캡슐 기능 전반에서 사용하는 공통 타입
 */

export interface TimeCapsule {
  id: string;
  title: string;
  openDate: string;
  createdAt: string;
  participants: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface TimeCapsuleFeatureProps {
  // 필요시 추가
}

