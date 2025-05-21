import { Request, Response } from "express";
import { db } from '../db';
import { TMember } from "../types";
import { checkSessionRole, mapMemberDbToObject } from "../utils";

export async function getDashboardStatistics(req: Request, res: Response) {
  const authorization = await checkSessionRole(req, ['admin', 'staff', 'user']);
  if (authorization.errorCode) {
    return res.status(authorization.errorCode).json({
      status: 'Error', message: authorization.message,
    });
  }

  try {
    const result = {
      status: 'OK',
      statistics: {
        totalMembers: await getTotalMembers(authorization.sessionId!),
        male: await getMale(authorization.sessionId!),
        female: await getFemale(authorization.sessionId!),
        categories: {
          associate: await getAssociate(authorization.sessionId!),
          general: await getGeneral(authorization.sessionId!),
          child: await getChild(authorization.sessionId!),
        },
        ageGroups: {
          under18: await getAgeGroupUnder18(authorization.sessionId!),
          from19to25: await getAgeGroupFrom19to25(authorization.sessionId!),
          from26to59: await getAgeGroupFrom26to59(authorization.sessionId!),
          over60: await getAgeGroupOver60(authorization.sessionId!),
          unknown: await getAgeUnknown(authorization.sessionId!),
        },
      },
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internalServerError' });
  }
}

async function getTotalMembers(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getMale(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    gender='M' and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getFemale(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    gender='F' and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getGeneral(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    category='General' and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAssociate(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    category='Associate' and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getChild(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    category='Child' and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupUnder18(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null
    and birth_date >= (now() - INTERVAL '18 years') and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupFrom19to25(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    (birth_date >= (now() - INTERVAL '25 years') and
    birth_date < (now() - INTERVAL '18 years')) and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupFrom26to59(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    (birth_date > (now() - INTERVAL '60 years') and
    birth_date < (now() - INTERVAL '25 years')) and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupOver60(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    birth_date <= (now() - INTERVAL '60 years') and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeUnknown(sessionId: string) {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    birth_date is null and session_id=$1`,
    [sessionId]
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

export async function getUpcomingBirthdays(req: Request, res: Response) {
  const authorization = await checkSessionRole(req, ['admin', 'staff', 'user']);
  if (authorization.errorCode) {
    return res.status(authorization.errorCode).json({
      status: 'Error', message: authorization.message,
    });
  }

  try {
    const { days } = req.params;
    if (!days) {
      res.status(400).json({ error: 'Bad request' });
      return;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const startDateParts = startDate.toISOString().split('T')[0].split('-');
    const endDateParts = endDate.toISOString().split('T')[0].split('-');

    const startDateStr = `${startDateParts[1]}${startDateParts[2]}`;
    const endDateStr = `${endDateParts[1]}${endDateParts[2]}`;

    const members: TMember[] = [];

    const { rows } = await db.query(
      `select * from (
        select id, reg_number, name, gender,
        concat(
          lpad(cast(extract(month from birth_date+interval '7 hour') as varchar), 2, '0'),
          lpad(cast(extract(day from birth_date+interval '7 hour') as varchar), 2, '0')
        ) as birthday,
        birth_date+interval '7 hour' as birth_date,
        marriage_date+interval '7 hour' as marriage_date,
        category
        from members where deleted_at is null and session_id=$3
      ) as t
      where (t.birthday >= $1 and t.birthday <= $2)
      order by t.birthday`,
      [startDateStr, endDateStr, authorization.sessionId!],
    );

    const ids: Array<string> = rows.map(row => row.id.toString());
    const idsForQuery = `'${ids.join("','")}'`;

    if (ids.length > 0) {
      const {rows: addresses} = await db.query(
        `select member_id, address from member_addresses
        where member_id in (${idsForQuery}) and deleted_at is null`
      );
      addresses.forEach((address) => {
        const member = rows.find(member => member.id === address.member_id.toString());
        if (member) {
          member.address = address.address.toString();
        }
      });

      const {rows: phones} = await db.query(
        `select member_id, phone, sequence from member_phones
        where member_id in (${idsForQuery}) and deleted_at is null`
      );
      phones.forEach((phone) => {
        const member = rows.find(member => member.id === phone.member_id.toString());
        if (member) {
          if (phone.sequence === 1) {
            member.phone1 = phone.phone.toString();
          } else if (phone.sequence === 2) {
            member.phone2 = phone.phone.toString();
          }
        }
      });
    }

    rows.forEach((row) => {
      members.push(row);
    });

    res.json({
      status: 'OK',
      data: mapMemberDbToObject(members),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Bad request' });
  }
}
