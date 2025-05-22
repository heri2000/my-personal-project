import './login.css';
import { LoginForm } from './loginForm';

export const CURRENT_PAGE_LOGIN = "current_page_login";

export function LoginPage(
  { loginSuccessful } : { loginSuccessful: () => void }
) {
  return (
    <div className="login_page">
      <div className="login_wrapper_1">
        <div className="login_wrapper_2">
          <div className="flex flex-col w-sm md:w-1/2 p-4 rounded-lg md:rounded-e-none">
            <LoginForm
              loginSuccessful={loginSuccessful}
            />
          </div>
          <div
            className="flex flex-col w-0 md:w-1/2 bg-[url('/illustration.jpg')] bg-cover bg-center rounded-e-lg"
          ></div>
        </div>
      </div>
    </div>
  );
}
