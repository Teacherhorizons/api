import { api, setupBeforeAll, setup, signIn, signOut, data } from '../shared';

export interface FooTest {
  getUrl?: (data: Config.Data) => string;
  expectedStatus: number;
  expectedDataLength: number;
}

const fooTests: FooTest[] = [
  {
    getUrl: (data) =>
      `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}`,
    expectedStatus: 200,
    expectedDataLength: 9,
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[0].id}`,
    expectedStatus: 200,
    expectedDataLength: 8,
  },
];

describe('test.each WIP1', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
    await setupBeforeAll();
  });

  test.each(fooTests)('test.each WIP2', async (fooTest: FooTest) => {
    console.log(101, fooTest, data);

    const url = fooTest.getUrl(data);
    const response = await api.get(url);
    expect(response.status).toEqual(fooTest.expectedStatus);
    expect(response.data.data.length).toEqual(fooTest.expectedDataLength);
    expect(response).toSatisfyApiSpec();
  });
});
