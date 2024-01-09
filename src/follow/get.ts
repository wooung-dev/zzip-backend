import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import mysqlUtil from "@lib/mysqlUtil";

export const handler = async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>) => {
  console.log("[event]", event);
  const userIdx = event.requestContext.authorizer.lambda.idx;

  const followers = await mysqlUtil.getMany("tb_follow", ["follower_idx", "followed_idx"], {
    where: { follower_idx: userIdx },
    order: [["weight", "desc"]],
  });

  // TODO: followers의 어떤 정보를 줄지 결정해야
  return { statusCode: 200, body: { followedUser: followers } };
};
