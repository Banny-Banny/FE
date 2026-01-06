/**
 * app/room/join.tsx
 * 딥링크로 타임캡슐 대기실 참여하기
 *
 * 딥링크 형식: timeegg://room/join?invite_code=ABC123
 *
 * 플로우:
 * 1. URL 파라미터에서 invite_code 추출
 * 2. fetchRoomByInviteCode() API 호출 → room_id(=capsule_id) 받음
 * 3. StepRoom 컴포넌트 렌더링 (role='guest', capsuleId, inviteCode 전달)
 */

import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import { Colors } from '@/commons/constants/color';
import { useNavigation } from '@/commons/hooks';
import { fetchRoomByInviteCode } from '@/components/timecapsule-create/components/step-room/api/capsule';
import StepRoom from '@/components/timecapsule-create/components/step-room';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export default function RoomJoinScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // URL 파라미터에서 invite_code 추출
  useEffect(() => {
    const code = Array.isArray(params.invite_code) ? params.invite_code[0] : params.invite_code;

    if (!code) {
      setError('초대 코드가 없습니다.');
      setIsLoading(false);
      return;
    }

    console.log('🔗 [RoomJoin] 딥링크로 입장:', code);
    setInviteCode(code);

    // 초대 코드로 대기실 조회
    const joinRoom = async () => {
      try {
        setIsLoading(true);
        const response = await fetchRoomByInviteCode(code);

        console.log('✅ [RoomJoin] 대기실 조회 성공:', response);
        console.log('🔍 [RoomJoin] capsule_id:', response.room_id);

        setCapsuleId(response.room_id);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ [RoomJoin] 대기실 조회 실패:', err);
        setError(err instanceof Error ? err.message : '대기실을 찾을 수 없습니다.');
        setIsLoading(false);
      }
    };

    joinRoom();
  }, [params.invite_code]);

  // 로딩 중
  if (isLoading) {
    return (
      <View style={styles.container}>
        <TimeCapsuleHeader title="대기실 참여 중..." onBack={() => navigation.back()} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.blue[500]} />
          <Text style={styles.loadingText}>대기실 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <View style={styles.container}>
        <TimeCapsuleHeader title="참여 실패" onBack={() => navigation.back()} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorDescription}>초대 링크가 올바른지 확인해주세요.</Text>
        </View>
      </View>
    );
  }

  // 대기실 입장 성공 - StepRoom 렌더링
  if (capsuleId && inviteCode) {
    return (
      <StepRoom
        role="guest"
        capsuleId={capsuleId}
        inviteCode={inviteCode}
        onSubmit={() => {
          console.log('✅ [RoomJoin] 타임캡슐 제출 완료!');
          router.replace('/(tabs)/'); // 메인으로 이동
        }}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[50],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.grey[600],
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.red[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});
