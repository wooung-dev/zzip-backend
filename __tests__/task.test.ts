import { handler as getUser } from '../src/user/get';
import { handler as putUser } from '../src/user/put';
import { privateFunctionTest } from './testUtil';

describe('ZZip test', () => {
  // test('GET test', async () => {
  //   const parameters = { name: 's', age: 12 };
  //   const res = await getTest(parameters, createPublicLambdaEvent(parameters));
  //   console.log('res', res);
  //   expect(res).toHaveProperty('statusCode', 200);
  // });

  test.only('GET user', async () => {
    const response = await privateFunctionTest(getUser, {});
    expect(response).toHaveProperty('statusCode', 200);
  });

  test('PUT user', async () => {
    const response = await privateFunctionTest(putUser, { profileImage: true });
    expect(response).toHaveProperty('statusCode', 200);
  });
});
