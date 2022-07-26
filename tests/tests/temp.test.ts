import { api, setupBeforeAll, setup, signIn, signOut, data } from '../shared';

export interface Test {
  getUrl: (data: Config.Data) => string;
  userEmail: string;
  expectedStatus: number;
  expectedDataLength?: number;
}

export interface TestGroup {
  getUrl: (data: Config.Data) => string;
  tests: Pick<Test, 'userEmail' | 'expectedStatus' | 'expectedDataLength'>[];
}

const tests: Test[] = [];

const addTestGroup = (testGroup: TestGroup) => {
  testGroup.tests.forEach((testGroupTest) => {
    tests.push({ getUrl: testGroup.getUrl, ...testGroupTest });
  });
};

const addTestGroups = (testGroups: TestGroup[]) => {
  testGroups.forEach(addTestGroup);
};

addTestGroups([
  {
    getUrl: (data) =>
      `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 5,
      },
      {
        userEmail: 'school1@th.test',
        expectedStatus: 401,
      },
    ],
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[1].id}`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
      {
        userEmail: 'school1@th.test',
        expectedStatus: 401,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[0].id}`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
    ],
  },
]);

describe('test.each WIP1', () => {
  beforeAll(async () => {
    // await signIn('admin@th.test');
    await setupBeforeAll();
  });

  test.each(tests)('test.each WIP2', async (fooTest: Test) => {
    console.log(101, fooTest, data);
    await signIn(fooTest.userEmail);
    const url = fooTest.getUrl(data);
    try {
      const response = await api.get(url);
      expect(response.status).toEqual(fooTest.expectedStatus);
      expect(response.data.data.length).toEqual(fooTest.expectedDataLength);
      expect(response).toSatisfyApiSpec();
    } catch (error) {
      console.log(103, error);
      expect(error.response.status).toEqual(fooTest.expectedStatus);
      expect(error.response).toSatisfyApiSpec();
    }
  });
});
