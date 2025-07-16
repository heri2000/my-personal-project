import { enEN } from '@/app/translations/enEN';
import { config } from '@/app/utils/config';
import { getSessionId } from '@/app/utils/session';

type TLoginResult = {
  sessionId: string | null;
  errorMessage: string | null;
};

type TRegistrationResult = {
  status: string | null;
  errorMessage: string | null;
};

export type TSessionData = {
  sessionId: string;
  userId: string;
  email: string;
  displayName: string;
  role: string;
  shouldChangePwd: string;
  validUntil: string;
};

export type TCredentials = {
  email: string;
  password: string;
  acPayload: string;
}

export type TRegisterCredentials = {
  email: string;
  password: string;
  confirmPassword: string;
  acPayload: string;
}

export async function userLogin(
  credentials: TCredentials
): Promise<TLoginResult> {
  const translationStrings = enEN;

  const result: TLoginResult = {
    sessionId: null,
    errorMessage: null,
  };

  try {
    const response = await fetch(`${config.api.user}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials),
    });
    const responseJson = await response.json();
    if (response.status === 200 && responseJson.sessionId) {
      result.sessionId = responseJson.sessionId;
    } else if (response.status === 417) {
      result.errorMessage = translationStrings.incorrectCaptcha;
    } else if (response.status === 400 || response.status === 401) {
      result.errorMessage = translationStrings.incorrectEmailOrPassword;
    } else {
      result.errorMessage = translationStrings.internalServerError;
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

export async function userLogout() {
  const sessionId = getSessionId();
  if (sessionId) {
    try {
      await fetch(`${config.api.user}/logout/${sessionId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export async function userRegister(
  credentials: TRegisterCredentials
): Promise<TRegistrationResult> {
  const translationStrings = enEN;

  const result: TRegistrationResult = {
    status: null,
    errorMessage: null,
  }

  try {
    const response = await fetch(`${config.api.user}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials),
    });
    const responseJson = await response.json();
    if (response.status === 201) {
      result.status = responseJson.status;
    } else if (response.status === 417) {
      result.errorMessage = translationStrings.incorrectCaptcha;
    } else if (response.status === 400 || response.status === 401) {
      result.errorMessage = translationStrings.incorrectEmailOrPassword;
    } else if (response.status === 403) {
      result.errorMessage = translationStrings.emailWasAlreadyRegistered;
    } else {
      result.errorMessage = translationStrings.internalServerError;
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

export function getSessionData(): Promise<TSessionData | null> {
  return new Promise(async(resolve) => {
    const sessionId = getSessionId();
    if (!sessionId) {
      resolve(null);
      return;
    }

    const response = await fetch(`${config.api.user}/session-data/${sessionId}`, {
      method: 'GET',
    });
    if (response.status === 200 && sessionId) {
      const data = await response.json();
      resolve({
        sessionId,
        userId: data.data.user_id,
        email: data.data.email,
        displayName: data.data.display_name,
        role: data.data.role,
        shouldChangePwd: data.data.should_change_pwd,
        validUntil: data.data.valid_until,
      });
    } else {
      resolve(null);
    }
  });
}
