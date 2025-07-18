import { Request, Response } from 'express';
import { SHA3 } from 'sha3';
import { nanoid } from 'nanoid';
import { createChallenge, verifySolution } from 'altcha-lib';
import {
  getSessionValidityDateTimeSql,
  setVals,
  getVals,
  deleteVals,
  getCurrentDateTimeSql,
} from '../utils';
import { db } from '../db';
import { SESSION_VALIDY_MINUTES } from '../utils';
import 'dotenv/config';

export const SESSION_PREFIX = 'session-';

export async function login(req: Request, res: Response) {
  try {
    const { email, password, acPayload } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'Error', message: 'Email or password is missing' });
      return;
    }

    const hmacKey = process.env.HMAC_KEY;
    let ok = false;
    if (hmacKey) {
      ok = await verifySolution(acPayload, hmacKey);
      if (!ok) {
        res.status(417).json({ status: 'Error', message: 'Invalid captcha' });
        return;
      }
    } else {
      res.status(500).json({ status: 'Error', message: 'internalSeverError' });
      return;
    }

    const hash = new SHA3(512);
    hash.update(password);
    const hashedPwd = hash.digest('hex');

    const { rowCount, rows } = await db.query(
      'select id, email, display_name, role, should_change_pwd from users where email=$1 and pwd=$2',
      [email, hashedPwd]
    );
    if (!rowCount) {
      res.status(401).json({ status: 'Error', message: 'Invalid email or password' });
      return;
    }

    const sessionId = nanoid(25);
    const validUntil = getSessionValidityDateTimeSql();

    const vals = {
      user_id: rows[0].id,
      email: rows[0].email,
      display_name: rows[0].display_name,
      role: rows[0].role,
      should_change_pwd: rows[0].should_change_pwd,
      valid_until: validUntil
    };

    const setResult = await setVals(
      `${SESSION_PREFIX}${sessionId}`,
      JSON.stringify(vals),
      SESSION_VALIDY_MINUTES * 60,
    );

    if (!setResult) {
      res.status(500).json({ status: 'Error', message: 'internalSeverError' });
      return;
    }

    res.json({ status: 'OK', sessionId: sessionId });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    await deleteVals([`${SESSION_PREFIX}${sessionId}`]);

    res.json({ status: 'OK' });
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, confirmPassword, acPayload } = req.body;

    if (!email || !password || !confirmPassword) {
      res.status(400).json({ status: 'Error', message: 'Email or password is missing' });
      return;
    }

    const hmacKey = process.env.HMAC_KEY;
    let ok = false;
    if (hmacKey) {
      ok = await verifySolution(acPayload, hmacKey);
      if (!ok) {
        res.status(417).json({ status: 'Error', message: 'Invalid captcha' });
        return;
      }
    } else {
      res.status(500).json({ status: 'Error', message: 'internalSeverError' });
      return;
    }

    const hash = new SHA3(512);
    hash.update(password);
    const hashedPwd = hash.digest('hex');

    if (await emailExists(email)) {
      res.status(403).json({ status: 'Error', message: 'duplicateEmail'});
    }

    try {
      const now = getCurrentDateTimeSql();

      await db.query(
        `insert into users (id, email, pwd, display_name, role, onetime_token, created_at, updated_at)
        values ($1, $2, $3, $4, $5, $6, $7, $7)`,
        [nanoid(), email, hashedPwd, email, 'admin', nanoid(25), now],
      );
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
      return;
    }

    res.status(201).json({ status: 'OK' });
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

async function emailExists(email: string): Promise<boolean> {
  const { rowCount } = await db.query(
    `select id from users where email=$1`,
    [email],
  );

  if (rowCount) {
    return true;
  }

  return false;
}

export async function getSessionData(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    const result = await getSessionDataFromVals(sessionId);
    if (!result) {
      res.status(401).json({ status: 'Error', message: 'sessionExpired' });
      return;
    } else {
      res.json({ status: 'OK', data: result });
    }
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function getSessionDataFromVals(sessionId: string) {
  const getResult = await getVals(`${SESSION_PREFIX}${sessionId}`);
  if (!getResult) {
    return null;
  }
  const jsonData = JSON.parse(getResult);
  if (new Date(jsonData.valid_until) < new Date()) {
    return null;
  }
  return jsonData;
}

export async function getChallenge(req: Request, res: Response) {
  const hmacKey = process.env.HMAC_KEY;
  if (!hmacKey) {
    res.status(500).json({ status: 'Error', message: 'internalSeverError' });
    return;
  }
  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 100000,
  });
  res.json(challenge);
}
