const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../tmp');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = [
  {
    "Amount": "+2.00",
    "Date": "21/12/2025",
    "Time": "15:54:25",
    "Other Transaction Details (UPI ID or A/c No)": "poweraccess.paytm3@axisbank",
    "Transaction Details": "Cashback Received from One97 Communications Limited",
    "UPI Ref No.": "501230863555",
    "Your Account": "Jio Payments Bank - 97",
    "Tags": "#💰 Cashback",
  },
  {
    "Amount": "-150.00",
    "Date": "22/12/2025",
    "Time": "10:00:00",
    "Other Transaction Details (UPI ID or A/c No)": "merchant@bank",
    "Transaction Details": "Purchase at Store",
    "UPI Ref No.": "",
    "Your Account": "Jio Payments Bank - 97",
    "Tags": "#Shopping",
  },
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
const outPath = path.join(outDir, 'sample.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Wrote sample XLSX to', outPath);
