/**
 * components/mypage/index.tsx
 * 마이페이지 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import React from 'react';
import { View } from 'react-native';
import { ProfileSection } from './components/profile-section';
// 다른 컴포넌트들도 필요시 추가
// import { ActivityStats } from './components/activity-stats';
// import { MenuList } from './components/menu-list';
// import { LogoutButton } from './components/logout-button';

export default function MyPageFeature() {
  return (
    <View>
      <ProfileSection />
      {/* 다른 섹션들 추가 예정 */}
    </View>
  );
}
