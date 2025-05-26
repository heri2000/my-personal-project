import { db } from "../db";
import { SESSION_PREFIX } from "../handlers/user";
import { getKeys } from "../utils";

export async function checkSessions () {
  const keys = await getKeys();
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].slice(SESSION_PREFIX.length);
  }
  console.log(`-- ${keys.length} Active sessions`);
  console.log(keys);

  const { rowCount, rows } = await db.query('select distinct(session_id) from members');
  const sessionIds = rows.map((row) => row.session_id);
  console.log(`-- ${rowCount} session ids in members table:`)
  console.log(sessionIds);

  db.end();
  process.exit(0);
}
