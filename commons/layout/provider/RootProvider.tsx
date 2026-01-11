/**
 * commons/layout/provider/RootProvider.tsx
 * 앱 전체를 감싸는 최상위 Provider
 */

import { usePushNotifications } from '@/components/notification/hooks/usePushNotifications';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './auth/auth.provider';
import { ModalProvider } from './modal/modal.provider';
import { ReactQueryProvider } from './react-query/react-query.provider';
import { AppSafeAreaProvider } from './safe-area/safe-area.provider';

interface RootProviderProps {
  children: React.ReactNode;
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  // 푸시 알림 초기화 (앱 시작 시 자동으로 권한 요청 및 토큰 등록)
  usePushNotifications();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ReactQueryProvider>
            <ModalProvider>
              <AppSafeAreaProvider>{children}</AppSafeAreaProvider>
            </ModalProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
