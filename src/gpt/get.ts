import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const parameter = {
  type: 'object',
  properties: {
    monthlyGoal: { type: 'string' },
    expenseItem: { type: 'string' },
    expenseAmount: { type: 'number' },
    expenseReason: { type: 'string' },
  },
  required: ['expenseItem', 'expenseAmount', 'expenseReason'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log('[event]', event);
  const { monthlyGoal, expenseItem, expenseAmount, expenseReason } = event.queryStringParameters as FromSchema<
    typeof parameter
  >;

  const prompt = `나는 절약하고 아껴쓰는 습관을 가지려고 하는 사람이야. 이번달 목표는 ${monthlyGoal}이야. 
    오늘은 ${expenseItem}에 ${expenseAmount}만큼 썼어. 그 이유는 ${expenseReason}이야.
    이거에 대해서 긍정적인 쪽과 부정적인 쪽, 두 쪽중 어느쪽에 더 해당하는지 비율로 나타내고 극단적인 피드백을 해줘. 
    피드백은 친구가 말하는 컨셉이어야해.
    (응답 형식은 다음과 같은 JSON.stringfy 형식이어야해 : {positive : {rate: some integer, feedback : some string}, negative : {rate: some integer, feedback : some string }}`;
  console.log('[prompt]', prompt);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are the assistant who makes cool and critical judgments.' },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo', // gpt-3.5-turbo-1106
  });
  console.log('[completion]', completion);
  console.log('[completion message]', completion.choices[0]);
  const result = JSON.parse(completion.choices[0].message.content);

  return { statusCode: 200, body: JSON.stringify({ result }) };
};
