import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { TABS_SCREEN_OPTIONS } from './styles';

/**
 * 탭바에 표시할 화면 목록
 */
const TAB_SCREENS = [
  {
    name: 'alarm',
    title: '소식',
  },
  {
    name: 'index',
    title: '홈',
  },
  {
    name: 'mypage',
    title: '마이',
  },
] as const;

/**
 * 탭바에 표시하지 않을 화면 목록 (하단 탭바는 유지)
 */
const HIDDEN_SCREENS = ['timecapsule/[id]'] as const;

export interface TabScreenItem {
  name: string;
  title: string;
}

/**
 * Tabs Layout 설정
 * - TAB_SCREENS에 정의된 화면만 탭바에 표시
 * - HIDDEN_SCREENS는 탭바 버튼 없이 하단 탭바만 유지
 */
export function TabsLayoutConfig() {
  return (
    <Tabs screenOptions={TABS_SCREEN_OPTIONS}>
      {TAB_SCREENS.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ color, size }) => (
              <View style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
      ))}

      {/* 탭바에 표시하지 않을 화면들 */}
      {HIDDEN_SCREENS.map((screenName) => (
        <Tabs.Screen
          key={screenName}
          name={screenName}
          options={{
            href: null, // 탭바 버튼 숨김
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  );
}

export { HIDDEN_SCREENS, TAB_SCREENS, TABS_SCREEN_OPTIONS };
export default TabsLayoutConfig;
