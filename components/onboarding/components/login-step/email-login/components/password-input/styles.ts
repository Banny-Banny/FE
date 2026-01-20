/**
 * components/onboarding/components/login-step/email-login/components/password-input/styles.ts
 * 비밀번호 입력 필드 컴포넌트 스타일
 */

import { BorderRadius, Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 8, // 라벨과 입력 필드 간 간격
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'PretendardVariable',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48, // 토글 버튼 공간 확보
    textAlignVertical: 'center',
    backgroundColor: Colors.white[500],
    borderRadius: BorderRadius.md, // 12px
    borderWidth: 1,
    borderColor: Colors.border.light,
    color: Colors.black[500],
    flex: 1,
  },
  inputError: {
    borderColor: Colors.red[500],
  },
  toggleButton: {
    marginLeft: -40, // 입력 필드와 겹치도록 배치
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // 입력 필드 위에 표시
  },
});
