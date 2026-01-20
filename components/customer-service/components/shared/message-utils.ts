/**
 * components/customer-service/components/shared/message-utils.ts
 * 채팅 메시지 관련 유틸리티 함수
 */

import { Alert, Linking } from 'react-native';

/**
 * 파일 크기 포맷팅 함수
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * 파일 아이콘 이름 가져오기
 */
export function getFileIconName(mimeType?: string): string {
  if (!mimeType) return 'file-line';

  if (mimeType.startsWith('image/')) {
    return 'image-line';
  } else if (mimeType.startsWith('video/')) {
    return 'video-line';
  } else if (mimeType.startsWith('audio/')) {
    return 'music-line';
  } else if (mimeType.includes('pdf')) {
    return 'file-pdf-line';
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'file-word-line';
  } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'file-excel-line';
  } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
    return 'file-zip-line';
  }

  return 'file-line';
}

/**
 * 파일 다운로드 처리 (선택사항)
 */
export async function handleFileDownload(url: string, fileName: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('오류', '파일을 열 수 없습니다.');
    }
  } catch (error) {
    Alert.alert('오류', '파일 다운로드에 실패했습니다.');
  }
}

/**
 * 메시지 시간 포맷팅
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (messageDate.getTime() === today.getTime()) {
    return timeStr; // 오늘: HH:mm
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return `어제 ${timeStr}`; // 어제: 어제 HH:mm
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day} ${timeStr}`; // 그 외: MM/DD HH:mm
  }
}
