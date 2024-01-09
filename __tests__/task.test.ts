import { generateTokens, USER_JWT_CONTENTS } from "../src/lib/jwt";
import mysqlUtil from "../src/lib/mysqlUtil";
import * as authorizer from "../src/auth/authorizer";
import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { handler as getUser } from "../src/user/get";
import { handler as putUser } from "../src/user/put";
import { handler as postFollow } from "../src/follow/post";
import { handler as getFollow } from "../src/follow/get";
import { handler as deleteFollow } from "../src/follow/delete";
import util from "util";

describe("ZZip test", () => {
  // test('GET test', async () => {
  //   const parameters = { name: 's', age: 12 };
  //   const res = await getTest(parameters, createPublicLambdaEvent(parameters));
  //   console.log('res', res);
  //   expect(res).toHaveProperty('statusCode', 200);
  // });

  test.only("GET user", async () => {
    const response = await privateFunctionTest(getUser, {});
    expect(response).toHaveProperty("statusCode", 200);
  });

  test("PUT user", async () => {
    const response = await privateFunctionTest(putUser, { profileImage: true });
    expect(response).toHaveProperty("statusCode", 200);
  });

  test("POST follow", async () => {
    const response = await privateFunctionTest(postFollow, { followedUserIdx: 2 });
    expect(response).toHaveProperty("statusCode", 200);
  });
  test("GET follow", async () => {
    const response = await privateFunctionTest(getFollow, {});
    expect(response).toHaveProperty("statusCode", 200);
  });
  test("DELETE follow", async () => {
    const response = await privateFunctionTest(deleteFollow, { followedUserIdx: 2 });
    expect(response).toHaveProperty("statusCode", 200);
  });
});

async function localLogin(userEmail: string = "gyrms9412@test.com"): Promise<string> {
  const user = await mysqlUtil.getOne("tb_user", USER_JWT_CONTENTS, { user_email: userEmail });
  return (await generateTokens(createPublicLambdaEvent({}), user!.idx)).accessToken;
}

async function privateFunctionTest(testFunction, parameters: { [key: string]: any }) {
  const userAccessToken = await localLogin();
  const event = await createPrivateLambdaEvent(parameters, userAccessToken);
  const response = await testFunction(event);
  console.log(util.inspect(JSON.parse(response.body), { depth: null }));
  return response;
}

const createPublicLambdaEvent = (parameters: { [key: string]: any }): APIGatewayProxyEventV2 => {
  return {
    version: "2.0",
    routeKey: "",
    rawPath: "",
    rawQueryString: "",
    headers: {},
    queryStringParameters: parameters,
    body: JSON.stringify(parameters),
    requestContext: {
      accountId: "testAccountId",
      apiId: "testApiId",
      domainName: "test.execute-api.ap-northeast-2.amazonaws.com",
      domainPrefix: "test",
      http: {
        method: "",
        path: "/",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "local",
      },
      requestId: "",
      routeKey: "",
      stage: "dev",
      time: "1/Jan/2024:00:00:00 +0000",
      timeEpoch: 0,
    },
    pathParameters: {},
    isBase64Encoded: false,
  };
};

const createPrivateLambdaEvent = async (
  parameters: { [key: string]: any },
  userAccessToken: string
): Promise<APIGatewayProxyEventV2WithLambdaAuthorizer<{ [key: string]: any }>> => {
  const { context: jwtClaims } = await authorizer.handler({
    ...createPublicLambdaEvent(parameters),
    headers: { authorization: `Bearer ${userAccessToken}` },
  });
  return {
    version: "2.0",
    routeKey: "",
    rawPath: "",
    rawQueryString: "",
    headers: { authorization: `Bearer ${userAccessToken}` },
    queryStringParameters: parameters,
    body: JSON.stringify(parameters),
    requestContext: {
      accountId: "testAccountId",
      apiId: "testApiId",
      domainName: "test.execute-api.ap-northeast-2.amazonaws.com",
      domainPrefix: "test",
      http: {
        method: "",
        path: "/",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "local",
      },
      requestId: "",
      routeKey: "",
      stage: "dev",
      time: "1/Jan/2023:00:00:00 +0000",
      timeEpoch: 0,
      authorizer: { lambda: { ...jwtClaims } },
    },
    pathParameters: {},
    isBase64Encoded: false,
  };
};
