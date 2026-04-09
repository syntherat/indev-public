const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const env = require("../config/env");

function createS3Client() {
  if (!env.awsRegion || !env.awsAccessKeyId || !env.awsSecretAccessKey) {
    return null;
  }

  return new S3Client({
    region: env.awsRegion,
    credentials: {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
    },
  });
}

const s3Client = createS3Client();

async function createDownloadSignedUrl({ key, fileName, expiresIn = 300 }) {
  if (!s3Client || !env.s3BucketName) {
    const error = new Error("AWS S3 is not configured on public server");
    error.statusCode = 500;
    throw error;
  }

  const command = new GetObjectCommand({
    Bucket: env.s3BucketName,
    Key: key,
    ResponseContentDisposition: `attachment; filename=\"${String(fileName || "download").replace(/\"/g, "") }\"`,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

module.exports = {
  createDownloadSignedUrl,
};
