const path = require('path');
const argv = require('yargs').argv;
const colors = require('colors');
const del = require('../lib/delete-image');
const Photo = require('../lib/model');
const { connect, disconnect } = require('../lib/utils');

async function batchDelete(ids, bucket, dir) {
  try {
    if (!dir) throw new Error('Please update Directory');
    if (!bucket) throw new Error('Please update Bucket');
    // Remove from S3
    const toRemove = ids.map(id => path.join(dir, id));
    console.log(`Removing ${toRemove.length} files`.yellow);
    const deleted = await del(toRemove, bucket);
    console.log(
      `${deleted.reduce((a, v) => a + v)}`.green,
      'images removed from S3'
    );
    // Remove from Mongo
    await connect();
    const deleteMany = await Photo.deleteMany({ id: { $in: ids } });
    console.log(`${deleteMany.n}`.green, `entries removed from MongoDB`);
    disconnect();
  } catch (e) {
    console.log('Failed to delete', e);
    throw new Error(e);
  }
}

async function run() {
  try {
    const dir = argv.dir || argv.d;
    const bucket = argv.bucket || argv.b;
    let ids = argv.id || argv.i;
    if (!dir) throw new Error('Please provide --dir or -d');
    if (!bucket) throw new Error('Please provide --bucket or -b');
    if (!ids) throw new Error('Please provide --id');
    if (!Array.isArray(ids)) ids = [ids];
    await batchDelete(ids, bucket, dir);
  } catch (e) {
    console.log(e);
  }
}

run();
