import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import mysqlUtil from '../lib/mysqlUtil';

const parameter = {
  type: 'object',
  properties: {
    userEmail: { type: 'string' },
    year: { type: 'integer' },
    month: { type: 'integer' },
  },
  required: ['year', 'month'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  const { userEmail, year, month } = JSON.parse(event.body) as FromSchema<typeof parameter>;

  // 조회할 유저 선택
  let userIdx: number;
  if (userEmail) userIdx = (await mysqlUtil.getOne('tb_user', ['idx'], { user_email: userEmail })).idx;
  else userIdx = event.requestContext.authorizer.lambda.idx;

  // 캘린더 포스트 조회
  const calendarPostArray = await mysqlUtil.raw(
    `SELECT * FROM tb_calendar_post 
        WHERE user_idx = '${userIdx}' 
        AND YEAR(date) = '${year}' 
        AND MONTH(date) = '${month}'`
  );
  // 데이터 가공
  let calendar = {};
  calendarPostArray.forEach((post) => {
    const day = parseInt(post.date.split('-')[2], 10);
    if (!calendar[day]) calendar[day] = []; // 일자에 해당하는 배열이 없으면 새로 생성
    calendar[day].push(post);
  });
  console.log('[calendar]', calendar);

  return { statusCode: 200, body: JSON.stringify({ calendar }) };
};
