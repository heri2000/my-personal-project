import { db } from "../db";
import { SESSION_PREFIX } from "../handlers/user";
import { keyExists } from "../utils";

export async function clearUnusedMembers () {
  const { rowCount, rows } = await db.query('select distinct(session_id) from members');

  if (rowCount) {
    console.log(`--- Found ${rows.length} session IDs`);
    let deleted = 0;

    for (let i=0; i < rows.length; i++) {
      const sessionId = rows[i].session_id;
      const sessionExists = await keyExists(`${SESSION_PREFIX}${sessionId}`);

      if (!sessionExists) {
        await db.query(
          'delete from members where session_id=$1',
          [sessionId],
        );
        console.log(`${sessionId} deleted`);
        deleted++;
      }
    }
    console.log(`--- Done deleting members for ${deleted} expired session IDs.`);
  } else {
    console.log('No session IDs found.')
  }

  db.end();
  process.exit(0);
}
