import { SHA3 } from 'sha3';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { getCurrentDateTimeSql } from '../utils';
import 'dotenv/config';

export async function initUser () {
  const hash = new SHA3(512);
  hash.update(process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD : '');
  const hashedPwd = hash.digest('hex');

  const adminUser = {
    email: 'admin@example.com',
    displayName: 'Admin',
    role: 'admin'
  } as const;

  const now = getCurrentDateTimeSql();

  const { rowCount } = await db.query('select * from users where email=$1', ['admin@example.com']);
  if (!rowCount) {
    await db.query(
      `insert into users (id, email, pwd, display_name, role, should_change_pwd, onetime_token, created_at, updated_at)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [nanoid(), adminUser.email, hashedPwd, adminUser.displayName, adminUser.role, true, nanoid(25), now, now]
    );
    console.log("Admin user added.");
  } else {
    console.log("Admin user already exists.");
  }

  db.end();
  process.exit(0);
};
