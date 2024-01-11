import { getPrePost } from '../../../lib/naver/OCR';
import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

const parameter = {
  type: 'object',
  properties: {
    image: { type: 'string' }, // Base64 encoded image
    format: { type: 'string' }, // file format
    bank: { type: 'string' }, // bank name
  },
  required: ['image', 'format', 'bank'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { image, format, bank } = JSON.parse(event.body) as FromSchema<typeof parameter>;

  const prePost = await getPrePost(image, format, bank);

  return {
    statusCode: 200,
    body: JSON.stringify({ prePost }),
  };
};
