import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import mysqlUtil from '../../lib/mysqlUtil';
import { nanoid } from 'nanoid';

const parameter = {
  type: 'object',
  properties: {
    toWhat: { type: 'string' },
    price: { type: 'integer' },
    reason: { type: 'string' },
    date: { type: 'string' }, // YYYY-MM-DD
  },
  required: ['price', 'date'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { toWhat, price, reason, date } = JSON.parse(event.body) as FromSchema<typeof parameter>;
  const userIdx = event.requestContext.authorizer.lambda.idx;

  const postUid = nanoid();
  await mysqlUtil.create('tb_calendar_post', {
    uid: postUid,
    user_idx: userIdx,
    to_what: toWhat,
    price,
    reason,
    date,
  });
  const post = await mysqlUtil.getOne('tb_calendar_post', [], { uid: postUid });

  return { statusCode: 200, body: JSON.stringify({ post }) };
};
