const { upload } = require('./utils');

async function emptyDir(dir, bucket) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };
  const listedObjects = await upload.listObjectsV2(listParams).promise();
  if (listedObjects.Contents.length === 0) return 0;
  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await upload.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyDir(bucket, dir);
  return 1;
}

module.exports = (ids, bucket) => {
  return Promise.all(
    ids.map(id => {
      return emptyDir(id, bucket);
    })
  );
};
