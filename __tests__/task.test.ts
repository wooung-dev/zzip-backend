import { handler as getUser } from '../src/user/get';
import { handler as putUser } from '../src/user/put';
import { handler as postPostCalendar } from '../src/calendar/post/post';
import { handler as getPostCalendar } from '../src/calendar/post/get';
import { privateFunctionTest } from './testUtil';

describe('ZZip test', () => {
  // test('GET test', async () => {
  //   const parameters = { name: 's', age: 12 };
  //   const res = await getTest(parameters, createPublicLambdaEvent(parameters));
  //   console.log('res', res);
  //   expect(res).toHaveProperty('statusCode', 200);
  // });

  test('GET user', async () => {
    const response = await privateFunctionTest(getUser, {});
    expect(response).toHaveProperty('statusCode', 200);
  });

  test('PUT user', async () => {
    const response = await privateFunctionTest(putUser, { profileImage: true });
    expect(response).toHaveProperty('statusCode', 200);
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

  test.only('GET calendar post', async () => {
    const response = await privateFunctionTest(getPostCalendar, { uid: 'abcd' });
    expect(response).toHaveProperty('statusCode', 200);
  });
});
