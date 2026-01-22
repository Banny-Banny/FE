/**
 * components/notice/index.tsx
 * 공지사항 목록 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { NoticeEmpty } from './components/notice-empty';
import { NoticeList } from './components/notice-list';
import { NoticeSearch } from './components/notice-search';
import { useNoticeSearch } from './hooks/useNoticeSearch';
import { useNotices } from './hooks/useNotices';
import { styles } from './styles';

export default function NoticeFeature() {
  const navigation = useNavigation();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useNoticeSearch();

  const {
    notices,
    total,
    hasNext,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refetch,
  } = useNotices({
    search: debouncedSearchTerm,
    limit: 10,
  });

  const handleLoadMore = () => {
    if (hasNext && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const handleNoticePress = (noticeId: string) => {
    // 동적 라우트로 이동: /(tabs)/notices/[id]
    navigation.push(`${ROUTES.NOTICES}/${noticeId}`);
  };

  const handleClose = () => {
    navigation.replace(ROUTES.MY_PAGE);
  };

  // 로딩 상태 처리
  if (isLoading) {
    // TODO: 로딩 인디케이터 컴포넌트 추가
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>공지사항</Text>
          </View>
          <Pressable style={styles.headerCloseButton} onPress={handleClose}>
            <Icon name="ri-close-line" size={24} color={Colors.black[500]} />
          </Pressable>
        </View>
      </View>
    );
  }

  // 에러 상태 처리
  if (error && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>공지사항</Text>
          </View>
          <Pressable style={styles.headerCloseButton} onPress={handleClose}>
            <Icon name="ri-close-line" size={24} color={Colors.black[500]} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>공지사항</Text>
          {total > 0 && (
            <Text style={styles.headerSubtitle}>총 {total}개의 공지사항</Text>
          )}
        </View>
        <Pressable style={styles.headerCloseButton} onPress={handleClose}>
          <Icon name="ri-close-line" size={24} color={Colors.black[500]} />
        </Pressable>
      </View>

      {/* 검색 입력 */}
      <NoticeSearch searchTerm={searchTerm} onChangeText={setSearchTerm} />

      {/* 공지사항 목록 */}
      <NoticeList
        notices={notices}
        onNoticePress={handleNoticePress}
        ListEmptyComponent={() => (
          <NoticeEmpty
            isSearchEmpty={debouncedSearchTerm.length > 0 && notices.length === 0}
          />
        )}
        onLoadMore={handleLoadMore}
        hasNext={hasNext}
        isLoadingMore={isFetchingNextPage}
      />
    </View>
  );
}
