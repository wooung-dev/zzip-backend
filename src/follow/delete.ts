import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import mysqlUtil from "@lib/mysqlUtil";
import { FromSchema } from "json-schema-to-ts";

const parameter = {
  type: "object",
  properties: {
    followedUserIdx: { type: "string" },
  },
  required: ["user"],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log("[event]", event);
  const { followedUserIdx } = JSON.parse(event.body) as FromSchema<typeof parameter>;
  const userIdx = event.requestContext.authorizer.lambda.idx;

  await mysqlUtil.deleteMany("tb_follow", { follower_idx: userIdx, followed_idx: followedUserIdx });

  return { statusCode: 200, body: { followedUser: followedUserIdx } };
};
