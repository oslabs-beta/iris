const csvWriter = require('csv-write-stream');
const fs = require('fs');

function writeCSV(pathFile, fileObj) {
  let writer = csvWriter()

  if (!fs.existsSync(pathFile)) writer = csvWriter({ headers: ["id", "duration(s)"]});
  else writer = csvWriter({sendHeaders: false});

  writer.pipe(fs.createWriteStream(pathFile, {flags: 'a'}));
  writer.write(fileObj);
  writer.end();
}

module.exports = writeCSV;