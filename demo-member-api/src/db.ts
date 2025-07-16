import { Pool } from 'postgres-pool';
import 'dotenv/config';

export const db = new Pool({
  connectionString: (
    process.env.POSTGRES_URL ?
    process.env.POSTGRES_URL :
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`
  )
});
