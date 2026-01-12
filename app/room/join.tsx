/**
 * app/room/join.tsx
 * 딥링크 호환성을 위한 리다이렉트 파일
 * 
 * 딥링크 형식: timeegg://room/join?invite_code=ABC123
 * 이 파일은 (tabs) 그룹으로 리다이렉트합니다.
 */

import { Redirect } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function RoomJoinRedirect() {
  const params = useLocalSearchParams();
  const capsuleId = Array.isArray(params.capsuleId) ? params.capsuleId[0] : params.capsuleId;
  const inviteCode = Array.isArray(params.invite_code) ? params.invite_code[0] : params.invite_code;

  // 쿼리 파라미터를 유지하면서 (tabs) 그룹으로 리다이렉트
  if (capsuleId) {
    return <Redirect href={`/(tabs)/room/join?capsuleId=${capsuleId}`} />;
  }

  if (inviteCode) {
    return <Redirect href={`/(tabs)/room/join?invite_code=${inviteCode}`} />;
  }

  // 파라미터가 없으면 메인으로
  return <Redirect href="/(tabs)/" />;
}
