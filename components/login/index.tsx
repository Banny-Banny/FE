import { LoginView } from './components/login-view';

/**
 * 로그인 Feature Container
 * 비즈니스 로직은 login-view 내부 hooks에서 관리
 */
export default function LoginFeature() {
  return <LoginView />;
}
