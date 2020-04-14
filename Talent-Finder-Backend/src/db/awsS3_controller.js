require("dotenv").config();
const chalk = require("chalk");

//AWS S3 config
const bluebird = require("bluebird");
const S3_IMAGE_BUCKET = process.env.AWS_IMAGE_BUCKET_NAME;
const S3_VIDEO_BUCKET = process.env.AWS_VIDEO_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION =process.env.AWS_REGION
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();

//Test S3 connection
const checkS3Connection = async () => {
  const image_bucket_params = {
    Bucket: S3_IMAGE_BUCKET,
    //empty file in the bucket to check the connection
    Key: "s3-connection-tester"
  };
  const video_bucket_params = {
    Bucket: S3_VIDEO_BUCKET,
    //empty file in the bucket to check the connection
    Key: "s3-connection-tester"
  };
  console.log(AWS_REGION)
  console.log(video_bucket_params.Bucket)
  try {
    await s3.headObject(image_bucket_params).promise();
    console.log(
      chalk.green("[INIT]: ") +
        "S3 bucket connection to " +
        chalk.yellow(S3_IMAGE_BUCKET) +
        " successful"
    );
    await s3.headObject(video_bucket_params).promise();
    console.log(
      chalk.green("[INIT]: ") +
        "S3 bucket connection to " +
        chalk.yellow(S3_VIDEO_BUCKET) +
        " successful"
    );
  } catch (err) {
      console.log(err)
      console.log(
      chalk.red("ERROR: Staging S3 bucket connection failure; check .env file")
    );
  }
};

//Upload a user file
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: S3_IMAGE_BUCKET,
    ContentType: type.mime,
    //Object key for which the multipart upload is to be initiated.
    Key: `${name}.${type.ext}`,
    //The server-side encryption algorithm used when storing this object in Amazon S3 (for example, AES256, aws:kms).
    ServerSideEncryption:"aws:kms"
  };
  return s3
    .upload(params)
    .promise()
    .catch();
};
//delete a file by  passing (filename, and extention)
const deleteFile = (key) => {
  const params = {
    Bucket: S3_IMAGE_BUCKET,
    Key: key
  };
  return s3
    .deleteObject(params)
    .promise()
    .catch();
};
//get a file by decrypting
const getFile= (key) => {
  const params = {
    Bucket: S3_IMAGE_BUCKET,
    Key: key
  };
  return s3
    .getObject(params)
    .promise()
    .catch();
};
//Delete the folder in S3
async function deleteDirectory( dir) {
  const listParams = {
      Bucket: S3_IMAGE_BUCKET,
      Prefix: dir
  };
  //console.log(dir)
  const listedObjects = await s3.listObjectsV2(listParams).promise();
  //if no content then 
  //console.log(listedObjects)
  //console.log(listedObjects.Contents.length)
  if (listedObjects.Contents.length === 0) return;
  const deleteParams = {
      Bucket: S3_IMAGE_BUCKET,
      Delete: { Objects: [] }
  };
  listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
  });
  await s3.deleteObjects(deleteParams).promise();
  if (listedObjects.IsTruncated) await deleteDirectory(dir);
}
module.exports = {
  s3,
  checkS3Connection,
  uploadFile,
  deleteFile,
  getFile,
  deleteDirectory
};