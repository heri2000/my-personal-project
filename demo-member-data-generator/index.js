const { faker } = require('@faker-js/faker');
const ExcelJS = require('exceljs');

function dateToString(jsDate) {
  if (!(jsDate instanceof Date) || isNaN(jsDate)) {
    throw new Error("Invalid date");
  }

  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
  const day = String(jsDate.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
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

for (let i = 0; i < 20; i++) {
  const name = faker.person.fullName();
  const address = `${faker.location.streetAddress()}, ${faker.location.city()}`;
  const birthDate = dateToString(faker.date.birthdate());
  const phone1 = Math.random() > 0.5 ? faker.phone.number() : null;
  const phone2 = Math.random() > 0.5 && phone1 ? faker.phone.number() : null;
  const marriageDate = Math.random() > 0.5 ? dateToString(faker.date.past()) : null;
  
  let category = 'General';
  const randomNumber = Math.random();
  if (randomNumber > 0.33333 && randomNumber < 0.66666) {
    category = 'Child';
  } else if (randomNumber >= 0.66666) {
    category = 'Associate';
  }
  
  console.log(`${name} - ${address} - ${birthDate} - ${phone1} - ${phone2} - ${marriageDate} - ${category}`);

  row = worksheet.getRow(i+2);
  row.getCell("A").value = i+1;

  row.getCell("C").value = name;

  row.getCell("E").value = address;
  row.getCell("F").value = birthDate;
  row.getCell("G").value = phone1;
  row.getCell("H").value = phone2;
  row.getCell("I").value = marriageDate;
  row.getCell("J").value = category;
}

const destinationFilePath = '../sample-data.xlsx';
workbook.xlsx.writeFile(destinationFilePath); 
