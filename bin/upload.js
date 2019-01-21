const upload = require('../lib/upload-image');
const colors = require('colors');
const { readFilesProcessed, writeFilesProcessed } = require('../lib/utils');

async function uploadImages() {
  const files = readFilesProcessed();
  const filtered = files.filter(i => !i.uploaded); // skip uploaded files
  if (!filtered.length) {
    console.log(
      ' Nothing to process '.yellow.inverse,
      'All files already uploaded.'.yellow
    );
    return;
  }
  const list = filtered.map(async image => {
    // Upload in parallel
    const promises = image.size_ids.map(key => upload(image.sizes[key]));
    await Promise.all(promises);
    image.uploaded = true;
    return image;
  });

  try {
    const res = await Promise.all(list);
    // Write files-processed
    writeFilesProcessed(res);
    console.log(
      ' Upload Done '.green.inverse,
      `${res.length}`.green,
      'images uploaded'
    );
  } catch (e) {
    console.log('File Upload General Error', e);
  }
}

uploadImages();
