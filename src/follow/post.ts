import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import mysqlUtil from "../lib/mysqlUtil";
import { FromSchema } from "json-schema-to-ts";

const parameter = {
  type: "object",
  properties: {
    followedUserIdx: { type: "string" },
  },
  required: ["followedUserIdx"],
} as const;

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log("[event]", event);
  const { followedUserIdx } = JSON.parse(event.body) as FromSchema<typeof parameter>;
  if (!followedUserIdx) return { statusCode: 400, body: JSON.stringify({ message: "followedUserIdx is required" }) };

  const userIdx = event.requestContext.authorizer.lambda.idx;

  const followers = await mysqlUtil.getMany("tb_follow", ["followed_idx"], { follower_idx: userIdx });
  if (followers.some((row) => row.followed_idx === followedUserIdx)) {
    console.log("이미 팔로우 중인 유저입니다.");
    return { statusCode: 200, body: JSON.stringify({ followedUser: followedUserIdx }) };
  }

  await mysqlUtil.create("tb_follow", { follower_idx: userIdx, followed_idx: followedUserIdx });

  return { statusCode: 200, body: JSON.stringify({ followedUser: followedUserIdx }) };
};
