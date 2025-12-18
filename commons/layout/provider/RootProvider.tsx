/**
 * commons/layout/provider/RootProvider.tsx
 * 앱 전체를 감싸는 최상위 Provider
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReactQueryProvider } from './react-query/react-query.provider';

interface RootProviderProps {
  children: React.ReactNode;
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
