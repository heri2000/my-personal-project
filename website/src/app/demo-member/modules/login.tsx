import { TechStack } from './about';
import './login.css';
import { LoginForm } from './loginForm';
import { IcKeyboardArrowDownIcon } from '../components/IcIcons';

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
      <div className="flex flex-row justify-center">
        <div>
          <a href="#tech_stack" className="scroll_down_link link_icon">
            <IcKeyboardArrowDownIcon/>
          </a>
        </div>
      </div>
      <div className="login_tech_stack_1">
        <div className="login_tech_stack_2" id="tech_stack">
          <TechStack/>
        </div>
      </div>
    </div>
  );
}
