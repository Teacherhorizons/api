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
    getUrl: (data) => `application-applicationEvents`,
    // 400	missingMandatoryParameter	schema must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=admin-allApplications`,
    // 400 missingMandatoryParameter filter[application.teacher.memberNumber] must be passed for schema admin-allApplications
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=admin-oneApplication`,
    // 400	missingMandatoryParameter	filter[application.id] must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=school`,
    // 400	missingMandatoryParameter	filter[application.id] must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=teacher`,
    // 400	missingMandatoryParameter	filter[application.id] must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=teacher`,
    // 400	missingMandatoryParameter	filter[application.id] must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=school`,
    // 400	missingMandatoryParameter	filter[application.id] must be passed
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=62080&schema=admin-allApplications`,
    // missingMandatoryParameter	filter[application.teacher.memberNumber] must be passed for schema admin-allApplications
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications`,
    // works for admin only (known value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 9,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications`,
    // works for admin only (unreal value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 0,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=admin-oneApplication`,
    // 404 ApplicationId not found (works for admin) (unreal value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 404,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=teacher`,
    // 404 ApplicationId not found (works for admin+teacher) (unreal value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 404,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 404,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=school`,
    // 404 ApplicationId not found (works for admin+school) (unreal value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 404,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 404,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication`,
    // works for admin (real value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 4,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=school`,
    // works for admin+school (real value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 3,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 200,
        expectedDataLength: 3,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[2].id}&schema=school`,
    // works for admin+school (real value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[4].id}&schema=school`,
    // works for admin+school (real value)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 0,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 200,
        expectedDataLength: 0,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 400,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=teacher`,
    // works for admin+teacher (real value, 401	accessNotPermitted	User does not have access to related teacher)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 4,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 401,
      },
    ],
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[3].id}&schema=teacher`,
    // works for admin+teacher (real value, correct teacher)
    tests: [
      {
        userEmail: 'signedOut',
        expectedStatus: 401,
      },
      {
        userEmail: 'admin@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
      {
        userEmail: 'school-1-school@th.test',
        expectedStatus: 400,
      },
      {
        userEmail: 'endorsed@th.test',
        expectedStatus: 200,
        expectedDataLength: 2,
      },
    ],
  },
]);

describe('test.each applicationEvents', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(tests)('test.each WIP2', async (fooTest: Test) => {
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

  describe('school-2-schools@th.test', () => {
    beforeAll(async () => {
      await signIn('school-2-schools@th.test');
    });
    test('GET applicationEvents (school2 | school | application.id = value | 401  - accessNotPermitted | User does not have access to related school)', async () => {
      // Fails due to school-2-schools@th.test NOT being set as ManagedBy in School
      try {
        const response = await api.get(
          `application-applicationEvents?schema=school&filter[application.id]=` + `${data.applications[0].id}`
        );
        expect(response.status).toEqual(999999999999);
      } catch (error) {
        expect(error.response.status).toEqual(401);
        // accessNotPermitted | User does not have access to related school
        expect(error.response).toSatisfyApiSpec();
      }
    });
  });
});
