import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';

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
