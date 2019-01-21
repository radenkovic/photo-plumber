const { S3 } = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const yaml = require('js-yaml');
const Photo = require('./model');

require('dotenv').config();

const FILES_PROCESSED_PATH = path.join(
  __dirname,
  '../temp/files-processed.json'
);

const CONFIG_PATH = path.join(__dirname, '../config.yml');

const readConfig = () => {
  try {
    var config = yaml.safeLoad(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (!config) throw new Error();
    return config;
  } catch (e) {
    throw new Error('Could not find "config.yml" file.');
  }
};

const readFilesProcessed = () => {
  try {
    const files = fs.readFileSync(FILES_PROCESSED_PATH, 'UTF-8');
    return JSON.parse(files);
  } catch (e) {
    throw new Error(
      'files-processed.json not found. Did you run "yarn resize"?'
    );
  }
};

const writeFilesProcessed = data => {
  fs.writeFileSync(FILES_PROCESSED_PATH, JSON.stringify(data, null, 2));
};

const connect = () =>
  mongoose.connect(process.env.MONGODB_DB, {
    useNewUrlParser: true,
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD
  });

const disconnect = () => mongoose.connection.close();

const upsert = async data => {
  try {
    const find = await Photo.findOne({ id: data.id });
    return find
      ? Photo.findOneAndReplace({ id: data.id }, data)
      : Photo.create(data);
  } catch (e) {
    console.log('Upsert failed', e);
    throw e;
  }
};

const upload = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

module.exports = {
  readConfig,
  readFilesProcessed,
  writeFilesProcessed,
  connect,
  disconnect,
  upsert,
  upload
};
