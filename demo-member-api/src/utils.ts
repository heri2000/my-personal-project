import { GlideClient, TimeUnit } from '@valkey/valkey-glide';
import { valkeyConfig } from './valkey';
import { Request } from 'express';
import { type TMember, type TAuthorization } from './types';
import { getSessionDataFromVals } from './handlers/user';
import { db } from './db';

export const SESSION_VALIDY_MINUTES = 720;

export function getCommandLineArgs() {
  return process.argv.slice(2);
};

export async function checkServerStatus() {
  const status = {
    status: 'OK',
    postgresql: 'OK',
    valkey: 'OK',
  };

  try {
    const { rowCount, rows } = await db.query('select 1=1 as status');
    if (!rowCount) {
      status.postgresql = 'error';
    } else {
      if (!rows[0].status) {
        status.postgresql = 'error';
      }
    }
  } catch (error) {
    console.error(error);
    status.postgresql = 'error';
  }

  try {
    const valkey = await GlideClient.createClient(valkeyConfig);
    const pingResponse = await valkey.ping();
    if (!pingResponse || pingResponse.toString() !== 'PONG') {
      status.valkey = 'error';
    }
  } catch (error) {
    console.error(error);
    status.valkey = 'error';
  }

  return status;
}

export async function checkSessionRole(
  req: Request, allowedRoles: string[]
): Promise<TAuthorization> {
  if (!req.headers.authorization) {
    return {
      sessionId: null,
      errorCode: 401,
      message: 'unauthorized',
    };
  }

  const sessionId = req.headers.authorization.split(' ')[1];
  const sessionData = await getSessionDataFromVals(sessionId);

  if (!sessionData) {
    return {
      sessionId: null,
      errorCode: 401,
      message: 'unauthorized',
    };
  }

  for (let i = 0; i < allowedRoles.length; i++) {
    if (sessionData.role === allowedRoles[i]) {
      return {
        sessionId,
        errorCode: null,
        message: null,
      };
    }
  }

  return {
    sessionId: null,
    errorCode: 403,
    message: 'forbidden',
  };
}

export function getCurrentDateTimeSql(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getSessionValidityDateTimeSql(): string {
  let sessionValidityMinutes = Number(process.env.SESSION_VALIDITY_MINUTES);
  if (isNaN(sessionValidityMinutes)) {
    sessionValidityMinutes = SESSION_VALIDY_MINUTES;
  }
  const now = new Date();
  const sessionValidityDate = new Date(now.getTime() + sessionValidityMinutes * 60000);
  const year = sessionValidityDate.getFullYear();
  const month = String(sessionValidityDate.getMonth() + 1).padStart(2, '0');
  const day = String(sessionValidityDate.getDate()).padStart(2, '0');
  const hours = String(sessionValidityDate.getHours()).padStart(2, '0');
  const minutes = String(sessionValidityDate.getMinutes()).padStart(2, '0');
  const seconds = String(sessionValidityDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function dateStringToSqlDate(date: string): string {
  let [day, month, year] = date.split('-');
  if (!day) {
    day = '00';
  }
  if (!month) {
    month = '00';
  }
  if (!year) {
    year = '1970';
  }
  return `${year.trim()}-${month.trim().padStart(2, '0')}-${day.trim().padStart(2, '0')}`;
}

export function swapDayMonthYear(date: string | null): string | null {
  if (!date || date.length !== 10) {
    return null;
  }
  const [day, month, year] = date.split('-');
  return `${year}-${month}-${day}`;
}

export async function getVals(key: string): Promise<string | null> {
  let result: string | null = null;
  const valkey = await GlideClient.createClient(valkeyConfig);
  try {
    const getResponse = await valkey.get(key);

    if (getResponse) {
      result = getResponse.toString();
    }
  } catch (error) {
    console.error(error);
  }
  valkey.close();
  return result;
}

export async function getKeys(): Promise<string[]> {
  let result: string[] = [];
  const valkey = await GlideClient.createClient(valkeyConfig);
  try {
    const response = await valkey.customCommand(['keys', '*']);
    if (response) {
      result = response.toString().split(',');
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

export async function keyExists(key: string): Promise<boolean> {
  let exists = false;
  const valkey = await GlideClient.createClient(valkeyConfig);
  try {
    exists = await valkey.exists([key]) > 0;
  } catch (error) {
    console.error(error);
  }
  return exists;
}

export async function setVals(
  key: string,
  vals: string,
  expirySeconds: number | null = null,
): Promise<boolean> {
  let result = true;
  const valkey = await GlideClient.createClient(valkeyConfig);
  try {
    if (expirySeconds) {
      const setResponse = await valkey.set(
        key,
        vals,
        { expiry: { type: TimeUnit.Seconds, count: expirySeconds } },
      );
      if (setResponse !== 'OK') {
        result = false;
      }
    } else {
      const setResponse = await valkey.set(
        key,
        vals,
      );
      if (setResponse !== 'OK') {
        result = false;
      }
    }
  } catch (error) {
    console.error(error);
    result = false;
  }
  valkey.close();
  return result;
}

export async function deleteVals(keys: string[]): Promise<boolean> {
  let result = true;
  const valkey = await GlideClient.createClient(valkeyConfig);
  try {
    const delResult = await valkey.del(keys);
    if (delResult === 0) {
      result = false;
    }
  } catch (error) {
    result = false;
  }
  valkey.close();
  return result;
}

export function mapMemberDbToObject(member: Array<any>): Array<TMember> {
  return member.map((m: any) => {
    return {
      id: m.id,
      regNumber: m.reg_number,
      name: m.name,
      gender: m.gender,
      address: m.address,
      birthDate: m.birth_date,
      phone1: m.phone1,
      phone2: m.phone2,
      marriageDate: m.marriage_date,
      category: m.category,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
      deletedAt: m.deleted_at,
    };
  });
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
