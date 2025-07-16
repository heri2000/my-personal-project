import React, { useRef } from 'react';
import { enEN } from '@/app/translations/enEN';
import { CpSpinner } from '../components/cpSpinner';
import { TRegisterCredentials, userRegister } from '../api/user';
import { sleep } from '@/app/utils/utils';

import dynamic from 'next/dynamic';
const CpAltcha = dynamic(
  () => import('../components/cpAltcha'),
  { ssr: false }
);

const MINIMUM_PASSWORD_LENGTH = 8;

const initialCredentials: TRegisterCredentials = {
  email: "", password: "", confirmPassword: "", acPayload: ""
};

export function RegisterForm(
  { showLogin } : { showLogin: () => void }
) {
  const translationStrings = enEN;
  const [credentials , setCredentials] = React.useState(initialCredentials);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInput = React.useRef<HTMLInputElement>(null);
  const altchaRef = useRef<HTMLInputElement>(null)
  const [registrationSuccessful, setRegistrationSuccessful] = React.useState(false);

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
        confirmPasswordInput.current?.focus();
      } else if (event.currentTarget.name === 'confirmPassword') {
        handleRegisterButtonClick();
      }
    }
  }

  async function handleRegisterButtonClick() {
    if (errorMessage) {
      setErrorMessage(null);
    }

    const acPayload = altchaRef.current?.value || "";

    if (acPayload === "") {
      setErrorMessage(translationStrings.proveYoureNotARobot);
      return;
    }

    if (!isValidEmail(credentials.email.trim())) {
      setErrorMessage(translationStrings.invalidEmailFormat);
      return;
    }

    if (credentials.password.length < MINIMUM_PASSWORD_LENGTH) {
      setErrorMessage(`${translationStrings.passwordLengthShoud}
      ${MINIMUM_PASSWORD_LENGTH} ${translationStrings.charactersOrMore}.`);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setErrorMessage(translationStrings.passwordsAreNotTheSame);
      return;
    }

    setLoading(true);
    const result = await userRegister({...credentials, acPayload});
    if (result.status === 'OK') {
      await sleep(250)
      setRegistrationSuccessful(true);
    } else if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
    } else {
      setErrorMessage(translationStrings.unknownError);
    }
    setLoading(false);
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  if (registrationSuccessful) {
    return(
      <div className='flex flex-row w-full h-full justify-center'>
        <div className='flex flex-col w-full h-full justify-center'>
          <h3 className='text-center'>{translationStrings.accountWasCreatedSuccessfully}</h3>
          <div className="flex flex-row justify-center">
            <a
              href="#"
              className="login_link"
              onClick={showLogin}
            >
              {translationStrings.log_in}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mt-2 !mb-0">
        {translationStrings.createNewAccount}
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
            className="w-full mb-2"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            ref={passwordInput}
            onKeyDown={handleKeyDown}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="confirmPassword">{translationStrings.confirmPassword}</label>
          <input
            type="password"
            className="w-full mb-4"
            name="confirmPassword"
            id="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            ref={confirmPasswordInput}
            onKeyDown={handleKeyDown}
          />
        </fieldset>

        <CpAltcha ref={altchaRef}/>

        <div className="flex flex-col mt-4">
          {errorMessage && (
            <div className="error_message mb-4">{errorMessage}</div>
          )}
          <div>
            <button
              type="button"
              className="primary"
              onClick={handleRegisterButtonClick}
              disabled={loading}
            >
              {translationStrings.createAccount}
            </button>
          </div>
        </div>

      </form>
      <div className="mt-4">
        {translationStrings.alreadyHaveAnAccount}?&nbsp;
        <a
          href="#"
          className="login_link"
          onClick={showLogin}
        >
          {translationStrings.log_inHere}
        </a>.
      </div>
      {loading && <CpSpinner/>}
    </div>
  );
}
