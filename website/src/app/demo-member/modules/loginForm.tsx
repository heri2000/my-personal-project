import React, { useRef } from 'react';
import { setSessionId } from '@/app/utils/session';
import { enEN } from '@/app/translations/enEN';
import { CpSpinner } from '../components/cpSpinner';
import { TCredentials, userLogin } from '../api/user';
import { sleep } from '@/app/utils/utils';

import dynamic from 'next/dynamic';
const CpAltcha = dynamic(
  () => import('../components/cpAltcha'),
  { ssr: false }
);

const initialCredentials: TCredentials = { email: "", password: "", acPayload: "" };

export function LoginForm(
  { loginSuccessful, showRegister } : {
    loginSuccessful: () => void,
    showRegister: () => void
  }
) {
  const translationStrings = enEN;
  const [credentials , setCredentials] = React.useState(initialCredentials);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const altchaRef = useRef<HTMLInputElement>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (errorMessage) {
      setErrorMessage(null);
    }
    const { name, value } = event.target;
    setCredentials({...credentials, [name]: value });
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

  async function handleLoginButtonClick() {
    if (errorMessage) {
      setErrorMessage(null);
    }

    const acPayload = altchaRef.current?.value || "";

    if (acPayload === "") {
      setErrorMessage(translationStrings.proveYoureNotARobot);
      return;
    }

    setLoading(true);
    const result = await userLogin({...credentials, acPayload});
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

  return (
    <div>
      <h1 className="text-center mt-2 !mb-0">
        {translationStrings.login}
      </h1>
      <form className="mt-4">
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

        <CpAltcha ref={altchaRef}/>

        <div className="flex flex-row items-center mt-4">
          <button
            type="button"
            className="primary me-2"
            onClick={handleLoginButtonClick}
            disabled={loading}
          >
            {translationStrings.log_in}
          </button>
          {errorMessage && (
            <div className="error_message flex flex-row">{errorMessage}</div>
          )}
        </div>

      </form>
      <div className="mt-4">
        {translationStrings.dontHaveAnAccountYet}?&nbsp;
        <a
          href="#"
          className="login_link"
          onClick={showRegister}
        >
          {translationStrings.createOne}
        </a>.
      </div>
      <div className="bg-yellow-200 dark:bg-cyan-800 text-gray-800 dark:text-gray-100 border border-orange-800 dark:border-cyan-500 rounded-md p-4 mt-6 my-2 text-sm">
        <b>Don't want to create an account? Use the following credentials to log in:</b>
        <table className="w-full">
          <tbody>
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
          </tbody>
        </table>
      </div>
      {loading && <CpSpinner/>}
    </div>
  );
}
