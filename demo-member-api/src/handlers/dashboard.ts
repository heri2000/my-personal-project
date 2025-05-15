import { Request, Response } from "express";
import { db, type TMember } from '../db';
import { mapMemberDbToObject } from "../utils";
import { start } from "repl";

export async function getDashboardStatistics(req: Request, res: Response) {
  try {
    const result = {
      status: 'OK',
      statistics: {
        totalMembers: await getTotalMembers(),
        male: await getMale(),
        female: await getFemale(),
        categories: {
          associate: await getAssociate(),
          general: await getGeneral(),
          child: await getChild(),
        },
        ageGroups: {
          under18: await getAgeGroupUnder18(),
          from19to25: await getAgeGroupFrom19to25(),
          from26to59: await getAgeGroupFrom26to59(),
          over60: await getAgeGroupOver60(),
          unknown: await getAgeUnknown(),
        },
      },
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internalServerError' });
  }
}

async function getTotalMembers() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getMale() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and gender='M'`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getFemale() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and gender='F'`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getGeneral() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and category='General'`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAssociate() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and category='Associate'`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getChild() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and category='Child'`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupUnder18() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and birth_date >= (now() - INTERVAL '18 years')`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupFrom19to25() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    (birth_date >= (now() - INTERVAL '25 years') and  birth_date < (now() - INTERVAL '18 years'))`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupFrom26to59() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and
    (birth_date > (now() - INTERVAL '60 years') and  birth_date < (now() - INTERVAL '25 years'))`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeGroupOver60() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and birth_date <= (now() - INTERVAL '60 years')`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

async function getAgeUnknown() {
  let count = 0;
  const { rowCount, rows } = await db.query(
    `select count(*) as rc from members where deleted_at is null and birth_date is null`
  );
  if (rowCount) {
    count = rows[0].rc;
  }
  return count;
}

export async function getUpcomingBirthdays(req: Request, res: Response) {
  try {
    const { days } = req.params;
    if (!days) {
      res.status(400).json({ error: 'Bad request' });
      return;
    }

    const startDate = new Date();
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
        date_part('day', birth_date+interval '7 hour') as day,
        birth_date+interval '7 hour' as birth_date,
        marriage_date+interval '7 hour' as marriage_date,
        category
        from members where deleted_at is null
      ) as t
      where (t.birthday >= $1 and t.birthday <= $2)
      order by t.birthday`,
      [startDateStr, endDateStr],
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
