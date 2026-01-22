/**
 * components/notice/index.tsx
 * 공지사항 목록 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import React from 'react';
import { View } from 'react-native';
import { NoticeEmpty } from './components/notice-empty';
import { NoticeList } from './components/notice-list';
import { useNotices } from './hooks/useNotices';
import { styles } from './styles';

export default function NoticeFeature() {
  const navigation = useNavigation();
  const { notices, total, limit, offset, hasNext, isLoading, error } = useNotices();

  const handleNoticePress = (noticeId: string) => {
    // 동적 라우트로 이동: /(tabs)/notices/[id]
    navigation.push(`${ROUTES.NOTICES}/${noticeId}`);
  };

  // 로딩 상태 처리
  if (isLoading) {
    // TODO: 로딩 인디케이터 컴포넌트 추가
    return <View style={styles.container} />;
  }

  // 에러 상태 처리
  if (error) {
    // TODO: 에러 메시지 컴포넌트 추가
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <NoticeList
        notices={notices}
        onNoticePress={handleNoticePress}
        ListEmptyComponent={() => <NoticeEmpty />}
      />
    </View>
  );
}
