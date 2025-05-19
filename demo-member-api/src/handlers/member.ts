import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import ExcelJS, { Borders } from 'exceljs';
import {
  getCurrentDateTimeSql,
  dateStringToSqlDate,
  swapDayMonthYear,
  getVals,
  setVals,
  deleteVals,
  mapMemberDbToObject,
  sleep,
  SESSION_VALIDY_MINUTES,
  checkAuthorization,
} from '../utils';
import { db } from '../db';
import { TMember } from '../types';

const memberImportPrefix = 'member-import-';
const memberExportPrefix = 'member-export-';

export async function template(req: Request, res: Response) {
  const filePath = path.join(__dirname, '../../template/data_jemaat.xlsx');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath, 'data_jemaat.xlsx', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error sending file');
    }
  });
}

export async function upload(req: Request, res: Response) {
  const form = formidable({});
  let fields;
  let files;

  try {
    [fields, files] = await form.parse(req);
  } catch (err: any) {
    // example to check for a very specific error
    // if (err.code === formidableErrors.maxFieldsExceeded) {}
    console.error(err);
    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
    res.end(String(err));
    return;
  }
  const uploadId = nanoid(25);
  const timeStamp = getCurrentDateTimeSql();

  const vals = {
    uploadId: uploadId,
    status: 'inProgress',
    progressPercent: 0,
    timeStamp,
  };
  if (!await setVals(
    `${memberImportPrefix}${uploadId}`,
    JSON.stringify(vals),
    SESSION_VALIDY_MINUTES * 60,
  )) {
    res.status(500).json({ status: 'Error', message: 'internalServerError' });
    return;
  }

  importMember(uploadId, files.file?.at(0));

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status:'OK', uploadId }, null, 2));
}

export async function importProgress(req: Request, res: Response) {
  try {
    const { uploadId } = req.params;

    const vals = await getVals(`${memberImportPrefix}${uploadId}`);
    if (!vals) {
      res.status(404).json({ status: 'Error', message: 'Upload progress not found' });
      return;
    }

    const data = JSON.parse(vals);
    if (data.progressPercent >= 100 || data.status === 'done' || data.status === 'error') {
      deleteVals([`${memberImportPrefix}${uploadId}`]);
    }
    if (data.status === 'error') {
      res.status(500).json({ status: 'error', data: data });
      return;
    }

    res.json({ status: 'OK', data: data });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'internalServerError' });
  }
}

async function importMember(uploadId: string, file: any) {
  const sourceFilePath: string = file.filepath;
  const destinationFilePath: string = path.join(__dirname, `../../temp/${file.newFilename}.xlsx`);

  const vals = await getVals(`${memberImportPrefix}${uploadId}`);
  const progressData = JSON.parse(vals!);

  try {
    fs.rename(
      sourceFilePath,
      destinationFilePath,
      async (error) => {
        if (error) {
          console.error(error)
          progressData.status = 'error';
          await setVals(`${memberImportPrefix}${uploadId}`, JSON.stringify(progressData));
        };
      }
    );
    await sleep(500);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(destinationFilePath);
    const worksheet = workbook.getWorksheet(1);

    const memberList: Array<TMember> = [];

    worksheet!.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      const regNumber = row.getCell('B').value;
      const name = row.getCell('C').value;
      const gender = row.getCell('D').value;
      if (
        regNumber?.toString().startsWith('REG-') &&
        name !== null && gender !== null
      ) {
        let address = row.getCell('E').value;
        let birthDate = row.getCell('F').value;
        let phone1 = row.getCell('G').value;
        let phone2 = row.getCell('H').value;
        let marriageDate = row.getCell('I').value;
        const category = row.getCell('J').value;

        if (address) {
          address = address.toString().trim();
        }
        if (phone1) {
          phone1 = phone1.toString().trim();
        }
        if (phone2) {
          phone2 = phone2.toString().trim();
        }
        if (birthDate) {
          birthDate = dateStringToSqlDate(birthDate.toString().trim());
        }
        if (marriageDate) {
          marriageDate = dateStringToSqlDate(marriageDate.toString().trim());
        }

        memberList.push({
          id: "",
          regNumber: regNumber.toString(),
          name: name!.toString(),
          gender: gender!.toString(),
          address: address ? address.toString() : null,
          birthDate: birthDate ? birthDate.toString() : null,
          phone1: phone1 ? phone1.toString() : null,
          phone2: phone2 ? phone2.toString() : null,
          marriageDate: marriageDate ? marriageDate.toString() : null,
          category: category ? category.toString() : null,
          createdAt: null,
          updatedAt: null,
          deletedAt: null,
        });
      }
    });

    const timeStamp = getCurrentDateTimeSql();

    for (let i = 0; i < memberList.length; i++) {
      const {
        regNumber,
        name,
        gender,
        address,
        birthDate,
        phone1,
        phone2,
        marriageDate,
        category
      } = memberList[i];

      let id = nanoid();
      const {rowCount, rows} = await db.query(
        'select id from members where reg_number=$1',
        [regNumber],
      );
      if (rowCount) {
        id = rows[0].id.toString();
      }

      await db.query(
        `insert into members (id, reg_number, name, gender, birth_date, marriage_date, category,
        created_at, updated_at)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$8)
        on conflict (id) do update set name=$3, gender=$4, birth_date=$5, marriage_date=$6, category=$7,
        updated_at=$8`,
        [
          id,
          regNumber,
          name,
          gender,
          birthDate,
          marriageDate,
          category,
          timeStamp,
        ],
      );

      await db.query(
        'update member_addresses set deleted_at=$1 where member_id=$2 and deleted_at is null',
        [timeStamp, id]
      );

      if (address) {
        const {rowCount, rows} = await db.query(
          'select id, address from member_addresses where member_id=$1',
          [id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_addresses (id, member_id, address, created_at, updated_at)
            values ($1,$2,$3,$4,$5)`,
            [nanoid(), id, address, timeStamp, timeStamp],
          );
        } else {
          if (rows[0].address === address) {
            await db.query(
              'update member_addresses set deleted_at=null where id=$1',
              [rows[0].id],
            );
          } else {
            await db.query(
              'update member_addresses set address=$1, updated_at=$2, deleted_at=null where id=$3',
              [address, timeStamp, rows[0].id],
            );
          }
        }
      }

      await db.query(
        'update member_phones set deleted_at=$1 where member_id=$2 and deleted_at is null',
        [timeStamp, id],
      );

      if (phone1) {
        const {rowCount, rows} = await db.query(
          'select id from member_phones where member_id=$1 and phone=$2 and sequence=1',
          [id, phone1],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), id, phone1, 1, timeStamp],
          );
        } else {
          await db.query(
            'update member_phones set deleted_at=null where id=$1',
            [rows[0].id],
          );
        }
      }

      if (phone2) {
        const {rowCount, rows} = await db.query(
          'select id from member_phones where member_id=$1 and phone=$2 and sequence=2',
          [id, phone2],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), id, phone2, 2, timeStamp],
          );
        } else {
          await db.query(
            'update member_phones set deleted_at=null where id=$1',
            [rows[0].id],
          );
        }
      }

      await db.query(
        'delete from member_phones where member_id=$1 and deleted_at=$2',
        [id, timeStamp],
      );

      progressData.progressPercent = Math.floor((i + 1) / memberList.length * 100);
      setVals(`${memberImportPrefix}${uploadId}`, JSON.stringify(progressData));
    }

    progressData.status = 'done';
    progressData.progressPercent = 100;
    await setVals(`${memberImportPrefix}${uploadId}`, JSON.stringify(progressData));

  } catch (error) {
    console.error(error);
    progressData.status = 'error';
    await setVals(`${memberImportPrefix}${uploadId}`, JSON.stringify(progressData));
  }

  setTimeout(() => {
    fs.unlink(destinationFilePath, (err) => {
      if (err) console.error(err);
    });
  }, 2000);
}

export async function exportMember(req: Request, res: Response) {
  try {
    const { search, order } = req.query;

    let orderBy = 'regNumber asc';
    if (order) {
      orderBy = order.toString();
      orderBy = orderBy.replace('regNumber', 'reg_number');
      orderBy = orderBy.replace('birthDate', 'birth_date');
      orderBy = orderBy.replace('marriageDate', 'marriage_date');
    }

    let qs = 'select count(*) as total from members where deleted_at is null';
    let params: Array<String> = [];
    if (search) {
      const searchStr = `%${search.toString()}%`;
      qs = `${qs} and (reg_number ilike $1 or name ilike $1)`;
      params = [searchStr];
    }

    const {rowCount, rows} = await db.query(qs, params);
    let totalMemberCount = 0;
    if (rowCount) {
      totalMemberCount = rows[0].total;
    }

    const exportId = nanoid(25);
    const timeStamp = getCurrentDateTimeSql();

    const vals = {
      exportId,
      progressPercent: 0,
      status: 'inProgress',
      timeStamp,
    };
    if (!await setVals(`${memberExportPrefix}${exportId}`, JSON.stringify(vals))) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
      return;
    }

    res.json({
      status: 'OK',
      totalMemberCount,
      exportId,
    });

    qs = `select id, reg_number, name, gender,
      birth_date+interval '7 hour' as birth_date,
      marriage_date+interval '7 hour' as marriage_date, category, created_at,
      updated_at, deleted_at
      from members
      where deleted_at is null
      order by ${orderBy}`;
    params = [];
    if (search) {
      const searchStr = `%${search.toString()}%`;
      qs = `select id, reg_number, name, gender,
        birth_date+interval '7 hour' as birth_date,
        marriage_date+interval '7 hour' as marriage_date, category, created_at,
        updated_at, deleted_at
        from members
        where deleted_at is null
        and (reg_number ilike $1 or name ilike $1)
        order by ${orderBy}`;
      params = [searchStr];
    }

    try {
      const {rows: members} = await db.query(qs, params);

      const ids: Array<string> = members.map(row => row.id.toString());
      const idsForQuery = `'${ids.join("','")}'`;

      if (ids.length > 0) {
        const {rows: addresses} = await db.query(
          `select member_id, address from member_addresses
          where member_id in (${idsForQuery}) and deleted_at is null`
        );
        addresses.forEach((address) => {
          const member = members.find(member => member.id === address.member_id.toString());
          if (member) {
            member.address = address.address.toString();
          }
        });

        const {rows: phones} = await db.query(
          `select member_id, phone, sequence from member_phones
          where member_id in (${idsForQuery}) and deleted_at is null`
        );
        phones.forEach((phone) => {
          const member = members.find(member => member.id === phone.member_id.toString());
          if (member) {
            if (phone.sequence === 1) {
              member.phone1 = phone.phone.toString();
            } else if (phone.sequence === 2) {
              member.phone2 = phone.phone.toString();
            }
          }
        });
      }

      const workbook = new ExcelJS.Workbook();
      workbook.properties.date1904 = true;
      const worksheet = workbook.addWorksheet('Sheet 1');

      worksheet.getColumn("A").width = 5;
      worksheet.getColumn("B").width = 14;
      worksheet.getColumn("C").width = 25;
      worksheet.getColumn("D").width = 4;
      worksheet.getColumn("E").width = 40;
      worksheet.getColumn("F").width = 10;
      worksheet.getColumn("G").width = 20;
      worksheet.getColumn("H").width = 20;
      worksheet.getColumn("I").width = 14;
      worksheet.getColumn("J").width = 12;

      let row = worksheet.getRow(1);
      row.getCell("A").value = "#";
      row.getCell("B").value = "Reg. Number";
      row.getCell("C").value = "Name";
      row.getCell("D").value = "Gender";
      row.getCell("E").value = "Address";
      row.getCell("F").value = "Birth Date";
      row.getCell("G").value = "Phone 1";
      row.getCell("H").value = "Phone 2";
      row.getCell("I").value = "Marriage Date";
      row.getCell("J").value = "Category";

      const borders: Partial<Borders> = {
        top: {style:'hair'},
        left: {style:'hair'},
        bottom: {style:'hair'},
        right: {style:'hair'},
      };

      for (let i = 1; i <= 10; i++) {
        row.getCell(i).border = borders;
      }

      for (let i = 1; i <= 10; i++) {
        const styleBold = row.getCell(i).style;
        styleBold.font = {bold: true};
      }

      row.getCell("A").alignment = {horizontal: 'right'};
      row.getCell("D").alignment = {horizontal: 'center'};

      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        row = worksheet.getRow(i+2);

        row.getCell("A").value = i+1;
        row.getCell("B").value = member["reg_number"];
        row.getCell("C").value = member["name"];
        row.getCell("D").value = member["gender"];
        row.getCell("E").value = member["address"];
        row.getCell("F").value = swapDayMonthYear(member["birth_date"]);
        row.getCell("G").value = member["phone1"];
        row.getCell("H").value = member["phone2"];
        row.getCell("I").value = swapDayMonthYear(member["marriage_date"]);
        row.getCell("J").value = member["category"];

        for (let j = 1; j <= 10; j++) {
          row.getCell(j).border = borders;
        }

        row.getCell("A").alignment = {horizontal: 'right'};
        row.getCell("D").alignment = {horizontal: 'center'};

        vals.progressPercent = Math.floor((i + 1) / members.length * 100);
        await setVals(`${memberExportPrefix}${exportId}`, JSON.stringify(vals));
      }

      const destinationFilePath: string = path.join(__dirname, `../../temp/${exportId}.xlsx`);
      await workbook.xlsx.writeFile(destinationFilePath);

      vals.status = 'done';
      vals.progressPercent = 100;
      await setVals(`${memberExportPrefix}${exportId}`, JSON.stringify(vals));
    } catch (error) {
      console.error(error);
      vals.status = 'error';
      await setVals(`${memberExportPrefix}${exportId}`, JSON.stringify(vals));
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function exportProgress(req: Request, res: Response) {
  try {
    const { exportId } = req.params;

    try {
      const vals = await getVals(`${memberExportPrefix}${exportId}`);
      if (!vals) {
        res.status(404).json({ status: 'Error', message: 'Export progress not found' });
        return;
      }

      const data = JSON.parse(vals);
      if (data.status === "done" || data.status === "error") {
        deleteVals([`${memberExportPrefix}${exportId}`]);
      }

      if (data.status === "error") {
        res.status(500).json({ status: 'error', data: data });
        return;
      }

      res.json({ status: 'OK', data: data });
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function downloadExportedFile(req: Request, res: Response) {
  try {
    const { exportId } = req.params;

    try {
      const filePath = path.join(__dirname, `../../temp/${exportId}.xlsx`);

      if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
      }

      const fileName = getCurrentDateTimeSql();

      res.download(filePath, `member ${fileName}.xlsx`, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error sending file');
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function memberList(req: Request, res: Response) {
  const authorization = await checkAuthorization(req, ['admin', 'staff']);
  if (authorization.errorCode) {
    return res.status(authorization.errorCode).json({
      status: 'Error', message: authorization.message,
    });
  }

  try {
    const { search, order, limit, offset } = req.query;

    let orderBy = 'regNumber asc';
    if (order) {
      orderBy = order.toString();
      orderBy = orderBy.replace('regNumber', 'reg_number');
      orderBy = orderBy.replace('birthDate', 'birth_date');
      orderBy = orderBy.replace('marriageDate', 'marriage_date');
    }

    let qs = 'select count(*) as total from members where deleted_at is null';
    let params: Array<String> = [];
    if (search) {
      const searchStr = `%${search.toString()}%`;
      qs = `${qs} and (reg_number ilike $1 or name ilike $1)`;
      params = [searchStr];
    }

    const {rowCount, rows} = await db.query(qs, params);
    let totalMemberCount = 0;
    if (rowCount) {
      totalMemberCount = rows[0].total;
    }

    qs = `select id, reg_number, name, gender,
      birth_date+interval '7 hour' as birth_date,
      marriage_date+interval '7 hour' as marriage_date, category, created_at,
      updated_at, deleted_at
      from members
      where deleted_at is null
      order by ${orderBy}
      limit $1 offset $2`;
    params = [limit!.toString(), offset!.toString()];
    if (search) {
      const searchStr = `%${search.toString()}%`;
      qs = `select id, reg_number, name, gender,
        birth_date+interval '7 hour' as birth_date,
        marriage_date+interval '7 hour' as marriage_date, category, created_at,
        updated_at, deleted_at
        from members
        where deleted_at is null
        and (reg_number ilike $1 or name ilike $1)
        order by ${orderBy}
        limit $2 offset $3`;
      params = [searchStr, limit!.toString(), offset!.toString()];
    }

    try {
      const {rows: members} = await db.query(qs, params);

      const ids: Array<string> = members.map(row => row.id.toString());
      const idsForQuery = `'${ids.join("','")}'`;

      if (ids.length > 0) {
        const {rows: addresses} = await db.query(
          `select member_id, address from member_addresses
          where member_id in (${idsForQuery}) and deleted_at is null`
        );
        addresses.forEach((address) => {
          const member = members.find(member => member.id === address.member_id.toString());
          if (member) {
            member.address = address.address.toString();
          }
        });

        const {rows: phones} = await db.query(
          `select member_id, phone, sequence from member_phones
          where member_id in (${idsForQuery}) and deleted_at is null`
        );
        phones.forEach((phone) => {
          const member = members.find(member => member.id === phone.member_id.toString());
          if (member) {
            if (phone.sequence === 1) {
              member.phone1 = phone.phone.toString();
            } else if (phone.sequence === 2) {
              member.phone2 = phone.phone.toString();
            }
          }
        });
      }

      res.json({
        status: 'OK',
        data: mapMemberDbToObject(members),
        totalMemberCount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function addNewMember(req: Request, res: Response) {
  try {
    const member: TMember = req.body;
    member.regNumber = member.regNumber.toString().trim();
    member.name = member.name.toString().trim();
    if (member.regNumber.length === 0) {
      res.status(400).json({ status: 'Error', message:'regNumberRequired' });
      return;
    }
    if (member.name.length === 0) {
      res.status(400).json({ status: 'Error', message:'nameRequired' });
      return;
    }
    if (member.address) {
      member.address = member.address.toString().trim();
    }
    if (member.phone1) {
      member.phone1 = member.phone1.toString().trim();
    }
    if (member.phone2) {
      member.phone2 = member.phone2.toString().trim();
    }
    if (member.birthDate === '') {
      member.birthDate = null;
    }
    if (member.marriageDate === '') {
      member.marriageDate = null;
    }

    try {
      const timeStamp = getCurrentDateTimeSql();

      const {rowCount, rows} = await db.query(
        'select id, deleted_at from members where reg_number=$1',
        [member.regNumber],
      );

      if (!rowCount) {
        member.id = nanoid();

        await db.query(
          `insert into members
          (id, reg_number, name, gender, birth_date, marriage_date, category, created_at, updated_at)
          values ($1,$2,$3,$4,$5,$6,$7,$8,$8)`,
          [
            member.id,
            member.regNumber,
            member.name,
            member.gender,
            member.birthDate,
            member.marriageDate,
            member.category,
            timeStamp,
          ],
        );
      } else {
        if (rows[0]["deleted_at"] === null) {
          res.status(400).json({ status: 'Error', message: 'regNumberAlreadyExists' });
          return;
        } else {
          member.id = rows[0]["id"];
          await db.query(
            `update members set
              name=$1,
              gender=$2,
              birth_date=$3,
              marriage_date=$4,
              category=$5,
              updated_at=$6,
              deleted_at=null
            where id=$7`,
            [member.name, member.gender, member.birthDate, member.marriageDate,
              member.category, timeStamp, member.id],
          );
        }
      }

      if (!member.address) {
        await db.query(
          'update member_addresses set deleted_at=$1 where member_id=$2',
          [timeStamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, address from member_addresses where member_id=$1',
          [member.id],
        );
        if (rows.length === 0) {
          await db.query(
            `insert into member_addresses (id, member_id, address, created_at, updated_at)
            values ($1,$2,$3,$4,$4)`,
            [nanoid(), member.id, member.address, timeStamp],
          );
        } else {
          await db.query(
            'update member_addresses set address=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.address, timeStamp, rows[0].id],
          );
        }
      }

      if (!member.phone1) {
        await db.query(
          'update member_phones set deleted_at=$1 where member_id=$2 and sequence=1',
          [timeStamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, phone from member_phones where member_id=$1 and sequence=1',
          [member.id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), member.id, member.phone1, 1, timeStamp],
          );
        } else {
          await db.query(
            'update member_phones set phone=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.phone1, timeStamp, rows[0].id],
          );
        }
      }

      if (!member.phone2) {
        await db.query(
          'update member_phones set deleted_at=$1 where member_id=$2 and sequence=2',
          [timeStamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, phone from member_phones where member_id=$1 and sequence=2',
          [member.id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), member.id, member.phone2, 2, timeStamp],
          );
        } else {
          await db.query(
            'update member_phones set phone=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.phone2, timeStamp, rows[0].id],
          );
        }
      }

      res.json({status: 'OK', id: member.id});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function updateMember(req: Request, res: Response) {
  try {
    const member: TMember = req.body;
    member.regNumber = member.regNumber.toString().trim();
    member.name = member.name.toString().trim();
    if (member.regNumber.length === 0) {
      res.status(400).json({ status: 'Error', message:'regNumberRequired' });
      return;
    }
    if (member.name.length === 0) {
      res.status(400).json({ status: 'Error', message:'nameRequired' });
      return;
    }
    if (member.address) {
      member.address = member.address.toString().trim();
    }
    if (member.phone1) {
      member.phone1 = member.phone1.toString().trim();
    }
    if (member.phone2) {
      member.phone2 = member.phone2.toString().trim();
    }
    if (member.birthDate === '') {
      member.birthDate = null;
    }
    if (member.marriageDate === '') {
      member.marriageDate = null;
    }

    try {
      const {rowCount, rows} = await db.query(
        'select id from members where reg_number=$1 and id<>$2 and deleted_at is null',
        [member.regNumber, member.id],
      );
      if (rowCount) {
        res.status(400).json({ status: 'Error', message: 'regNumberAlreadyExists' });
        return;
      }

      const timestamp = getCurrentDateTimeSql();
      await db.query(
        `update members set reg_number=$1, name=$2, gender=$3, birth_date=$4, marriage_date=$5,
        category=$6, updated_at=$7 where id=$8`,
        [
          member.regNumber,
          member.name,
          member.gender,
          member.birthDate,
          member.marriageDate,
          member.category,
          timestamp,
          member.id,
        ],
      );

      if (!member.address) {
        await db.query(
          'update member_addresses set deleted_at=$1 where member_id=$2',
          [timestamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, address from member_addresses where member_id=$1',
          [member.id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_addresses (id, member_id, address, created_at, updated_at)
            values ($1,$2,$3,$4,$4)`,
            [nanoid(), member.id, member.address, timestamp],
          );
        } else {
          await db.query(
            'update member_addresses set address=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.address, timestamp, rows[0].id],
          );
        }
      }

      if (!member.phone1) {
        await db.query(
          'update member_phones set deleted_at=$1 where member_id=$2 and sequence=1',
          [timestamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, phone from member_phones where member_id=$1 and sequence=1',
          [member.id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), member.id, member.phone1, 1, timestamp],
          );
        } else {
          await db.query(
            'update member_phones set phone=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.phone1, timestamp, rows[0].id],
          );
        }
      }

      if (!member.phone2) {
        await db.query(
          'update member_phones set deleted_at=$1 where member_id=$2 and sequence=2',
          [timestamp, member.id],
        );
      } else {
        const {rowCount, rows} = await db.query(
          'select id, phone from member_phones where member_id=$1 and sequence=2',
          [member.id],
        );
        if (!rowCount) {
          await db.query(
            `insert into member_phones (id, member_id, phone, sequence, created_at, updated_at)
            values ($1,$2,$3,$4,$5,$5)`,
            [nanoid(), member.id, member.phone2, 2, timestamp],
          );
        } else {
          await db.query(
            'update member_phones set phone=$1, updated_at=$2, deleted_at=null where id=$3',
            [member.phone2, timestamp, rows[0].id],
          );
        }
      }

      res.json({status: 'OK'});
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    const { id } = req.params;

    try {
      const timeStamp = getCurrentDateTimeSql();
      await db.query(
        'update members set deleted_at=$1 where id=$2',
        [timeStamp, id],
      );
      await db.query(
        'update member_addresses set deleted_at=$1 where member_id=$2',
        [timeStamp, id],
      );
      await db.query(
        'update member_phones set deleted_at=$1 where member_id=$2',
        [timeStamp, id],
      );
      res.json({status: 'OK'});
    } catch(error) {
      res.status(500).json({ status: 'Error', message: 'internalServerError' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Error', message: 'Bad request' });
  }
}
