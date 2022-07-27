import { api, setupBeforeAll, setup, signIn, signOut, data } from '../../shared';

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
    getUrl: (data) => `general-manualEmailTemplates/1`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema must be passed
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema must be passed
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema must be passed
      },
      {
        userEmail: 'signedOut',
        expectedStatus: 401, // accessNotPermitted | Must be signed in
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates/1?schema=admin`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 401, // accessNotPermitted | user type must be correct
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 401, // accessNotPermitted | user type must be correct
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates/10?schema=admin`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200, // isVisibleToAdmin = 0, should this fail?
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates/1000?schema=admin`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 404, // entityNotFoundForId | General_manualEmailTemplateId not found
      },
    ],
  },
]);

describe('test.each general-manualEmailTemplate', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(tests)(`test.each WIP2 $userEmail, $expectedStatus`, async (fooTest: Test) => {
    await signIn(fooTest.userEmail);
    const url = fooTest.getUrl(data);
    try {
      const response = await api.get(url);
      expect(response.status).toEqual(fooTest.expectedStatus);
      expect(response).toSatisfyApiSpec();
    } catch (error) {
      expect(error.response.status).toEqual(fooTest.expectedStatus);
      expect(error.response).toSatisfyApiSpec();
    }
  });
});

// indivual test example:
// describe('indivual test example 101', () => {
//   beforeAll(async () => {
//     await signIn('admin@th.test');
//     await setupBeforeAll();
//   });
//   test('GET general-manualEmailTemplates/1?schema=admin', async () => {
//     const response = await api.get('general-manualEmailTemplates/1?schema=admin');
//     expect(response.status).toEqual(200);
//     expect(response).toSatisfyApiSpec();
//   });
// });
