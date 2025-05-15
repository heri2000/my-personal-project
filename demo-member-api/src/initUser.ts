// import mysql, { ConnectionOptions, RowDataPacket, FieldPacket } from 'mysql2/promise';
import { Pool } from 'postgres-pool';
import { SHA3 } from 'sha3';
import { nanoid } from 'nanoid';
import { getCurrentDateTimeSql } from './utils';
import 'dotenv/config';

export async function initUser () {
  // const access: ConnectionOptions = {
  //   host: process.env.MYSQL_HOST,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD,
  //   database: process.env.MYSQL_DATABASE,
  // };

  // const conn = await mysql.createConnection(access);

  // const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await conn.execute('select * from users where email=?', ['admin@example.com']);
  // if (rows.length > 0) {
  //   console.log("User already exists.");
  // } else {
  //   console.log("User does not exist. Adding admin user...");

    const hash = new SHA3(512);
    hash.update('admin');
    const hashedPwd = hash.digest('hex');

    const adminUser = {
      email: 'admin@example.com',
      displayName: 'Admin',
      role: 'admin'
    } as const;

    const now = getCurrentDateTimeSql();

  //   await conn.execute(
  //     'insert into users (id, email, pwd, display_name, role, should_change_pwd, onetime_token, created_at, updated_at) values (?,?,?,?,?,?,?,?,?)',
  //     [nanoid(), adminUser.email, hashedPwd, adminUser.displayName, adminUser.role, true, nanoid(25), now, now]
  //   );
  //   console.log("Admin user added.");
  // }

  // await conn.end();

  const pool = new Pool({
    connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`
  });

  const { rowCount } = await pool.query('select * from users where email=$1', ['admin@example.com']);
  if (rowCount === 0) {
    await pool.query(
      `insert into users (id, email, pwd, display_name, role, should_change_pwd, onetime_token, created_at, updated_at)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [nanoid(), adminUser.email, hashedPwd, adminUser.displayName, adminUser.role, true, nanoid(25), now, now]
    );
    console.log("Admin user added.");
  } else {
    console.log("Admin user already exists.");
  }

  pool.end();
  process.exit(0);
};
