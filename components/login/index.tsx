import { LoginView } from './components/login-view';

/**
 * 로그인 Feature Container
 * login-view가 복잡한 컴포넌트이므로 내부에서 hooks를 관리
 */
export default function LoginFeature() {
  return <LoginView />;
}
