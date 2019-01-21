const shortId = require('shortid');
const uniqId = require('uniqid');
var path = require('path');
const md5File = require('md5-file');
const moment = require('moment');
const { readConfig } = require('./utils');

var config = readConfig();

const createOutputPath = (id, size, extension = '.jpg') => {
  return path.join(__dirname, '../temp', id + '_' + size + extension);
};

const createOutputFilename = (id, size, extension = '.jpg') => {
  return path.join(id + '_' + size + extension);
};

const createId = input_path => {
  if (config.id_create === 'md5') {
    return md5File.sync(input_path);
  } else if (config.id_create === 'shortId') {
    return shortId.generate();
  } else {
    return uniqId();
  }
};

module.exports = filenames => {
  const images = filenames.filter(filename =>
    ['.jpg', 'jpeg'].includes(path.extname(filename).toLowerCase())
  );
  return images.map(image => {
    const input_path = path.join(__dirname, '../input', image);
    const id = createId(input_path);
    const input_filename = path.basename(input_path);
    const extension = path.extname(input_path);
    const size_ids = Object.keys(config.sizes);
    const sizes = {};
    size_ids.map(key => {
      const output_filename = createOutputFilename(id, key);
      sizes[key] = {
        ...config.sizes[key],
        input_path,
        input_filename,
        url: path.join(
          config.upload.cloudfront_url || 'https://s3.amazonaws.com/',
          config.upload.s3_bucket,
          path.join(config.upload.s3_directory, id, output_filename)
        ),
        s3_bucket: config.upload.s3_bucket,
        s3_key: path.join(config.upload.s3_directory, id, output_filename),
        output_path: createOutputPath(id, key),
        output_filename
      };
    });
    const o = {
      ...config.metadata,
      id,
      uploaded: false,
      stored_in_database: false,
      s3_bucket: config.upload.s3_bucket,
      s3_directory: config.upload.s3_directory,
      created_at: moment().unix(),
      size_ids,
      sizes,
      extension
    };
    return o;
  });
};
