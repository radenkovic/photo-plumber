const fs = require('fs');
const colors = require('colors');
const { readFilesProcessed } = require('../lib/utils');
const files = readFilesProcessed();

console.log('---LAST BATCH---');
console.log('Total Files:'.cyan, files.length);
if (files.length) {
  const file = files[0];
  console.log('S3 Bucket:'.cyan, file.s3_bucket);
  console.log('S3 Directory:'.cyan, file.s3_directory);
}
console.log(
  'All files (ids)'.yellow,
  files.map(x => x.id),
  `(${files.length} files total)`
);
console.log(
  'Uploaded to S3 (ids):'.yellow,
  files.filter(x => x.uploaded).map(x => x.id),
  `(${files.length} files total)`
);
console.log(
  'Stored in database (ids):'.yellow,
  files.filter(x => x.stored_in_database).map(x => x.id),
  `(${files.length} files total)`
);

if (files.length) {
  const file = files[0];
  const ids = files.map(f => `--id ${f.id}`).join(' ');
  console.log('---');
  console.log(
    'To remove the images from S3 and Mongo, paste command below:'.red
  );
  console.log(
    `yarn delete --bucket ${file.s3_bucket} --dir ${file.s3_directory} ${ids}`
      .red.inverse
  );
}
