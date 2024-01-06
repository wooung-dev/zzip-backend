import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'ap-northeast-2' });
const Bucket = 'zzip';

export const getPresignedPostUrl = async (Key: string) => {
  const { url, fields } = await createPresignedPost(client, {
    Bucket,
    Key,
    Conditions: [],
    Fields: {},
    Expires: 600, // seconds
  });
  console.log('[getPresignedPostUrl]', { url, fields });

  return { url, fields };
};

export const getPresignedUrl = async (Key: string) => {
  const command = new GetObjectCommand({ Bucket, Key });
  const url = await getSignedUrl(client, command, { expiresIn: 600 });
  console.log('[getPresignedUrl]', url);

  return url;
};

export const getHeadObject = async (Key: string) => {
  const command = new HeadObjectCommand({ Bucket, Key });
  const res = await client.send(command);
  console.log('[getHeadObject]', res);
  
  return res;
};
