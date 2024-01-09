import { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';
import { FromSchema } from 'json-schema-to-ts';

const parameter = {
  type: 'object',
  properties: {
    parameterA: { type: 'string' },
  },
  required: ['parameterA'],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log('[event]', event);
  //   const { parameterA } = event.queryStringParameters as FromSchema<typeof parameter>; // query string
  const { parameterA } = JSON.parse(event.body) as FromSchema<typeof parameter>; // body
  const userEmail = event.requestContext.authorizer.lambda.user_email; // USER_JWT_CONTENTS in @lib/jwt
  console.log('[parameters]', parameterA, userEmail);

  // business logic

  return { statusCode: 200, body: JSON.stringify({}) };
};
