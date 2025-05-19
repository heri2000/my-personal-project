// import mysql, { PoolOptions } from 'mysql2/promise';
import { Pool } from 'postgres-pool';
import 'dotenv/config';

// const poolOptions: PoolOptions = {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   dateStrings: true,
// };

// export const db = mysql.createPool(poolOptions);

export const db = new Pool({
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`
});
