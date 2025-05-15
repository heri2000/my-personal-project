const ExcelJS = require('exceljs');

function swap(date) {
  const arr = date.split('-');
  return `${arr[2]}-${arr[1]}-${arr[0]}`;
}

async function swapDates() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('../sample-data.xlsx');
  const worksheet = workbook.getWorksheet(1);

  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    let birthDate = row.getCell('F').value;
    let marriageDate = row.getCell('I').value;

    if (birthDate === 'Birth Date') {
      return;
    }

    if (birthDate) {
      row.getCell('F').value = swap(birthDate);
    }
    if (marriageDate) {
      row.getCell('I').value = swap(marriageDate);
    }

    console.log(`${birthDate} - ${marriageDate}`)
  });

  await workbook.xlsx.writeFile('../sample-data-swap.xlsx');

  process.exit(0);
}

swapDates();
