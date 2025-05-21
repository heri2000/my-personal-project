import React from 'react';
import { setSessionId } from '@/app/utils/session';
import { enEN } from '@/app/translations/enEN';
import { CpSpinner } from '../components/cpSpinner';
// import CpAltcha from '../components/cpAltcha';
import { TCredentials, userLogin } from '../api/user';
import { sleep } from '@/app/utils/utils';

const initialCredentials: TCredentials = { email: "", password: "", acPayload: "" };

export function LoginForm(
  { loginSuccessful } : { loginSuccessful: () => void }
) {
  const translationStrings = enEN;
  const [credentials , setCredentials] = React.useState(initialCredentials);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const passwordInput = React.useRef<HTMLInputElement>(null);
  // const altchaRef = useRef<HTMLInputElement>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (errorMessage) {
      setErrorMessage(null);
    }
    const { name, value } = event.target;
    setCredentials({...credentials, [name]: value });
  }

  async function handleLoginButtonClick() {
    if (errorMessage) {
      setErrorMessage(null);
    }

    const acPayload = "";  // altchaRef.current?.value || "";

    setLoading(true);
    const result = await userLogin({...credentials, acPayload: acPayload});
    if (result.sessionId) {
      setSessionId(result.sessionId);
      await sleep(250);
      loginSuccessful();
      return;
    } else if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
    } else {
      setErrorMessage(translationStrings.unknownError);
    }
    setLoading(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (event.currentTarget.name === 'email') {
        passwordInput.current?.focus();
      } else if (event.currentTarget.name === 'password') {
        handleLoginButtonClick();
      }
    }
  }

  return (
    <div>
      <h1 className="text-center mt-2 !mb-10">
        {translationStrings.login}
      </h1>
      <form>

        <fieldset>
          <label htmlFor="email">{translationStrings.email}</label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full mb-2"
            value={credentials.email}
            onChange={handleChange}
            disabled={loading}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="password">{translationStrings.password}</label>
          <input
            type="password"
            className="w-full mb-4"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            ref={passwordInput}
            onKeyDown={handleKeyDown}
          />
        </fieldset>

        {errorMessage && (
          <div className="error_message flex flex-row mb-4">{errorMessage}</div>
        )}

        {/* <CpAltcha ref={altchaRef}/> */}

        <div className="mt-4">
          <button
            type="button"
            className="primary"
            onClick={handleLoginButtonClick}
            disabled={loading}
          >
            {translationStrings.login}
          </button>
        </div>

      </form>
      <div className="border border-gray-400 bg-gray-200 text-gray-800 rounded-xl p-4 mt-4 text-sm">
        <b>This is a demp app. You can use the following credentials to login:</b>
        <table className="w-full">
          <tr>
            <td className="pr-1">Email</td>
            <td className="pr-1">:</td>
            <td className="pr-1">admin@example.com</td>
          </tr>
          <tr>
            <td className="pr-1">Password</td>
            <td className="pr-1">:</td>
            <td className="pr-1">admin</td>
          </tr>
        </table>
      </div>
      {loading && <CpSpinner/>}
    </div>
  );
}
