const fs = require('fs');
const path = require('path');
const colors = require('colors');
const { upload } = require('./utils');

module.exports = async img => {
  try {
    const Body = fs.readFileSync(img.output_path);
    await upload
      .putObject({
        Bucket: img.s3_bucket,
        Key: img.s3_key,
        Body,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
        CacheControl: 'max-age=6280000'
      })
      .promise();
    console.log(
      '✓ Image uploaded'.green,
      path.join('https://s3.amazonaws.com/', img.s3_bucket, img.s3_key)
    );
  } catch (e) {
    throw new Error(e);
  }
};
