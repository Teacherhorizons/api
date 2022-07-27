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
    getUrl: (data) => `general-manualEmailTemplates?filter[id][contains]=1,2`,
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
    getUrl: (data) => `general-manualEmailTemplates?schema=admin&filter[id][contains]=2,3,4,5,6,7,8,9,10,11,12,13`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 10,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates?schema=admin`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 11,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates?schema=teacher&filter[id][contains]=2,3,4,5,6,7,8,9,10,11,12,13`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 8,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 200,
        expectedDataLength: 8,
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates?schema=teacher`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 9,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 200,
        expectedDataLength: 9,
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates?schema=school&filter[id][contains]=2,3,4,5,6,7,8,9,10,11,12,13`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 9,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 200,
        expectedDataLength: 9,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
      },
    ],
  },
  {
    getUrl: (data) => `general-manualEmailTemplates?schema=school`,
    tests: [
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 10,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 200,
        expectedDataLength: 10,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
      },
    ],
  },
]);

describe('test.each general-manualEmailTemplates', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(tests)(`test.each WIP2 $userEmail, $expectedStatus, $expectedDataLength`, async (fooTest: Test) => {
    await signIn(fooTest.userEmail);
    const url = fooTest.getUrl(data);
    try {
      const response = await api.get(url);
      expect(response.status).toEqual(fooTest.expectedStatus);
      expect(response.data.data.length).toEqual(fooTest.expectedDataLength);
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
//   test('GET general-manualEmailTemplates?schema=admin&filter[id][contains]=13', async () => {
//     const response = await api.get('general-manualEmailTemplates?schema=admin&filter[id][contains]=13');
//     expect(response.status).toEqual(200);
//     expect(response.data.data.length).toEqual(1);
//     expect(response).toSatisfyApiSpec();
//   });
// });
