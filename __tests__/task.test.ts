import { handler as getUser } from "../src/user/get";
import { handler as putUser } from "../src/user/put";
import { handler as postFollow } from "../src/follow/post";
import { handler as getFollow } from "../src/follow/get";
import { handler as deleteFollow } from "../src/follow/delete";
import { privateFunctionTest } from "./testUtil";

describe("ZZip test", () => {
  // test('GET test', async () => {
  //   const parameters = { name: 's', age: 12 };
  //   const res = await getTest(parameters, createPublicLambdaEvent(parameters));
  //   console.log('res', res);
  //   expect(res).toHaveProperty('statusCode', 200);
  // });

  test("GET user", async () => {
    const response = await privateFunctionTest(getUser, {});
    expect(response).toHaveProperty("statusCode", 200);
  });
  test("PUT user", async () => {
    const response = await privateFunctionTest(putUser, { profileImage: true });
    expect(response).toHaveProperty("statusCode", 200);
  });

  test("POST follow", async () => {
    const response = await privateFunctionTest(postFollow, { followedUserIdx: 3 });
    expect(response).toHaveProperty("statusCode", 200);
  });
  test("GET follow", async () => {
    const response = await privateFunctionTest(getFollow, {});
    expect(response).toHaveProperty("statusCode", 200);
  });
  test("DELETE follow", async () => {
    const response = await privateFunctionTest(deleteFollow, { followedUserIdx: 3 });
    expect(response).toHaveProperty("statusCode", 200);
  });
});
