import AWS from 'aws-sdk';

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION;

const s3: AWS.S3 = new AWS.S3({
  endpoint,
  region,
});

export default s3;
