import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import mysqlUtil from '../../lib/mysqlUtil';

const parameter = {
  type: 'object',
  properties: {
    uid: { type: 'string' },
    useLocation: { type: 'string' },
    price: { type: 'integer' },
    reason: { type: 'string' },
    date: { type: 'string' }, // YYYY-MM-DD
  },
  required: ['uid'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { uid, useLocation, price, reason, date } = JSON.parse(event.body) as FromSchema<typeof parameter>;
  const userIdx = event.requestContext.authorizer.lambda.idx;

  // 자신의 포스트가 아닌 경우 오류 반환
  let post = await mysqlUtil.getOne('tb_calendar_post', [], { uid });
  if (post.user_idx !== userIdx) return { statusCode: 403, body: JSON.stringify({ message: 'Permission Denied' }) };

  // 업데이트 요청한 항목들만 object화
  const updateObject: { [key: string]: any } = {};
  typeof useLocation === 'string' && (updateObject.use_location = useLocation);
  typeof price === 'number' && (updateObject.price = price);
  typeof reason === 'string' && (updateObject.reason = reason);
  typeof date === 'string' && (updateObject.date = date);

  // 업데이트
  await mysqlUtil.update('tb_calendar_post', updateObject, { uid });
  post = await mysqlUtil.getOne('tb_calendar_post', [], { uid });

  return { statusCode: 200, body: JSON.stringify({ post }) };
};
