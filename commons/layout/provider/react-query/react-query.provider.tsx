/**
 * commons/layout/provider/react-query/ReactQueryProvider.tsx
 * React Query Provider - 전역 데이터 페칭 상태 관리
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// QueryClient 인스턴스 생성
// 기본적인 client-cache 설정으로 불필요한 즉시 재요청 방지
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 fresh한 상태로 간주되는 시간 (1분)
      // 이 시간 동안은 캐시된 데이터를 사용하고 네트워크 요청을 하지 않음
      staleTime: 60 * 1000, // 1분
      // 캐시에서 제거되기 전까지 유지되는 시간 (5분)
      // 이전에는 cacheTime이었지만 v5에서는 gcTime으로 변경됨
      gcTime: 5 * 60 * 1000, // 5분
      // 재시도 횟수
      retry: 1,
      // 에러 발생 시 자동 재시도 여부
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 refetch 여부
      refetchOnReconnect: true,
    },
    mutations: {
      // Mutation 실패 시 재시도 횟수
      retry: 1,
    },
  },
});

// 추후 Axios 사용 시 전역 에러 처리를 위한 설정 예시
// QueryClient의 mutation/query에서 onError를 통해 처리할 수 있음
// 또는 Axios Interceptor를 별도로 설정하여 처리 가능

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
