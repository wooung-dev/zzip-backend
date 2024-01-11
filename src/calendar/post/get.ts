import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import mysqlUtil from '../../lib/mysqlUtil';
import { updateFriendScore } from '../../lib/friendScore';

const parameter = {
  type: 'object',
  properties: {
    uid: { type: 'string' },
  },
  required: ['uid'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { uid } = event.queryStringParameters as FromSchema<typeof parameter>;
  const userIdx = event.requestContext.authorizer.lambda.idx;

  const post = await mysqlUtil.getOne('tb_calendar_post', [], { uid });
  // 다른 유저 포스트 조회시 친밀도 업데이트
  if (userIdx !== post.user_idx) await updateFriendScore(userIdx, post.user_idx);

  return { statusCode: 200, body: JSON.stringify({ post }) };
};
