import { handler as getUser } from '../src/user/get';
import { handler as putUser } from '../src/user/put';
import { handler as postFollow } from "../src/follow/post";
import { handler as getFollow } from "../src/follow/get";
import { handler as deleteFollow } from "../src/follow/delete";
import { handler as postPostCalendar } from '../src/calendar/post/post';
import { handler as getPostCalendar } from '../src/calendar/post/get';
import { handler as getCalendar } from '../src/calendar/get';
import { privateFunctionTest } from './testUtil';

describe("ZZip test", () => {
  // test('GET test', async () => {
  //   const parameters = { name: 's', age: 12 };
  //   const res = await getTest(parameters, createPublicLambdaEvent(parameters));
  //   console.log('res', res);
  //   expect(res).toHaveProperty('statusCode', 200);
  // });

  test('GET user', async () => {
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

  test('POST calendar post', async () => {
    const response = await privateFunctionTest(postPostCalendar, {
      useLocation: '깐부치킨',
      price: 39000,
      reason: '치팅데이',
      date: '2024-01-09',
    });
    expect(response).toHaveProperty('statusCode', 200);
  });

  test('GET calendar post', async () => {
    const response = await privateFunctionTest(getPostCalendar, { uid: 'abcd' });
    expect(response).toHaveProperty('statusCode', 200);
  });

  test.only('GET calendar', async () => {
    const response = await privateFunctionTest(getCalendar, { year: 2024, month: 1 });
    expect(response).toHaveProperty('statusCode', 200);
  });
});
