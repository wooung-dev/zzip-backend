import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

const parameter = {
  type: 'object',
  properties: {
    parameterA: { type: 'string' },
  },
  required: ['parameterA'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log('[event]', event);
  const { parameterA } = event.queryStringParameters as FromSchema<typeof parameter>; // query string
  //   const { parameterA } = JSON.parse(event.body) as FromSchema<typeof parameter>; // body
  console.log('[parameters]', parameterA);

  // business logic

  return { statusCode: 200, body: JSON.stringify({}) };
};
