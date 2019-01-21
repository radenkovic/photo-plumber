const colors = require('colors');
const {
  connect,
  disconnect,
  readFilesProcessed,
  writeFilesProcessed,
  upsert
} = require('../lib/utils');

const reshapeData = image => {
  const output = {
    ...image,
    sizes: {}
  };
  // Reshape sizes
  image.size_ids.map(key => {
    const size = image.sizes[key];
    output.sizes[key] = {
      width: image.sizes[key].resize_info.width,
      height: image.sizes[key].resize_info.height,
      filesize: image.sizes[key].resize_info.size,
      filename: image.sizes[key].output_filename,
      url: image.sizes[key].url
    };
  });
  return output;
};

async function uploadToDatabase() {
  try {
    // Connect
    await connect();
    const files = readFilesProcessed();
    // Filter out uplaoded files and reshape
    const payload = files
      .filter(f => f.uploaded && !f.stored_in_database)
      .map(reshapeData);
    if (!payload.length) {
      console.log(
        ' Nothing to process '.yellow.inverse,
        'All files already uploaded.'.yellow
      );
      disconnect();
      return;
    }
    const promises = payload.map(upsert);
    const res = await Promise.all(promises);
    // Update Log File
    writeFilesProcessed(
      files.map(f => {
        f.stored_in_database = true;
        return f;
      })
    );
    console.log(
      ' Database Insert Done '.green.inverse,
      `${res.length}`.green,
      'files stored'
    );
    disconnect();
  } catch (e) {
    console.log('Database General Error', e);
    throw new Error(e);
  }
}

uploadToDatabase();
