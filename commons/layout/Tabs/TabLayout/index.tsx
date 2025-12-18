import { Tabs } from 'expo-router';
import React from 'react';
import Icon, { IconName } from 'react-native-remix-icon';

import { TABS_SCREEN_OPTIONS } from './styles';

/**
 * 탭바에 표시할 화면 목록
 */
const TAB_SCREENS = [
  {
    name: 'alarm',
    title: '소식',
    iconName: 'ri-notification-line',
    iconNameFilled: 'ri-notification-fill',
  },
  {
    name: 'index',
    title: '홈',
    iconName: 'ri-home-line',
    iconNameFilled: 'ri-home-fill',
  },
  {
    name: 'mypage',
    title: '마이',
    iconName: 'ri-user-line',
    iconNameFilled: 'ri-user-fill',
  },
] as const;

/**
 * 탭바에 표시하지 않을 화면 목록 (하단 탭바는 유지)
 */
const HIDDEN_SCREENS = ['timecapsule/create', 'timecapsule/index'] as const;

export interface TabScreenItem {
  name: string;
  title: string;
  iconName: string;
  iconNameFilled: string;
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
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? (screen.iconNameFilled as IconName) : (screen.iconName as IconName)}
                size={size}
                color={color}
              />
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
