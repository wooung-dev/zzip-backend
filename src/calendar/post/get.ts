import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import mysqlUtil from '../../lib/mysqlUtil';

const parameter = {
  type: 'object',
  properties: {
    uid: { type: 'string' },
  },
  required: ['uid'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { uid } = JSON.parse(event.body) as FromSchema<typeof parameter>;

  const post = await mysqlUtil.getOne('tb_calendar_post', [], { uid });

  return { statusCode: 200, body: JSON.stringify({ post }) };
};
