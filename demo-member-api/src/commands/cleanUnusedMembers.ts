import { db } from "../db";
import { getSessionDataFromVals } from "../handlers/user";

export async function cleanUnusedMembers () {
  const { rowCount, rows } = await db.query('select distinct(session_id) from members');

  if (rowCount) {
    console.log(`--- Found ${rows.length} session IDs`);
    let deleted = 0;

    for (let i=0; i < rows.length; i++) {
      const sessionId = rows[i].session_id;
      const sessionData = await getSessionDataFromVals(sessionId);

      if (!sessionData) {
        await db.query(
          'delete from members where session_id=$1',
          [sessionId],
        );
        console.log(`${sessionId} deleted`);
        deleted++;
      }
    }
    console.log(`--- Done deleting ${deleted} unused session IDs.`);
  } else {
    console.log('No session IDs found.')
  }

  db.end();
  process.exit(0);
}
