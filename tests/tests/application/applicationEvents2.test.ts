import { api, setupBeforeAll, setupAfterAll, setup, signIn, signOut, data } from '../../shared';

export interface FooTest {
  getUrl?: (data: Config.Data) => string;
  details?: string;
  expectedStatus: number[];
  expectedDataLength: number[];
  expectedErrorStatus: number[];
  testNumber: number;
}
const fooTests: FooTest[] = [
  // [failing, signed-out, admin, school1, teacher]
  {
    getUrl: (data) => `application-applicationEvents`,
    details: '400	missingMandatoryParameter	schema must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 1,
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=admin-allApplications`,
    details:
      '400	missingMandatoryParameter	filter[application.teacher.memberNumber] must be passed for schema admin-allApplications',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 2,
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=admin-oneApplication`,
    details: '400	missingMandatoryParameter	filter[application.id] must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 3,
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=school`,
    details: '400	missingMandatoryParameter	filter[application.id] must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 4,
  },
  {
    getUrl: (data) => `application-applicationEvents?schema=teacher`,
    details: '400	missingMandatoryParameter	filter[application.id] must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 5,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=teacher`,
    details: '400	missingMandatoryParameter	filter[application.id] must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 6,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=school`,
    details: '400	missingMandatoryParameter	filter[application.id] must be passed',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 7,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=62080&schema=admin-allApplications`,
    details:
      'missingMandatoryParameter	filter[application.teacher.memberNumber] must be passed for schema admin-allApplications',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 400, 400, 400],
    testNumber: 8,
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications`,
    details: 'works for admin only (known value)',
    expectedStatus: [0, 0, 200, 0, 0],
    expectedDataLength: [99999, 99999, 9, 99999, 99999],
    expectedErrorStatus: [400, 401, 0, 400, 400],
    testNumber: 9,
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications`,
    details: 'works for admin only (unreal value)',
    expectedStatus: [0, 0, 200, 0, 0],
    expectedDataLength: [99999, 99999, 0, 99999, 99999],
    expectedErrorStatus: [400, 401, 0, 400, 400],
    testNumber: 10,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=admin-oneApplication`,
    details: '404 ApplicationId not found (works for admin) (unreal value)',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 404, 400, 400],
    testNumber: 11,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=teacher`,
    details: '404 ApplicationId not found (works for admin+teacher) (unreal value)',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 404, 400, 404],
    testNumber: 12,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=school`,
    details: '404 ApplicationId not found (works for admin+school) (unreal value)',
    expectedStatus: [0, 0, 0, 0, 0],
    expectedDataLength: [99999, 99999, 99999, 99999, 99999],
    expectedErrorStatus: [400, 401, 404, 404, 400],
    testNumber: 13,
  },
  {
    getUrl: (data) =>
      `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication`,
    details: 'works for admin (real value)',
    expectedStatus: [0, 0, 200, 0, 0],
    expectedDataLength: [99999, 99999, 4, 99999, 99999],
    expectedErrorStatus: [400, 401, 0, 400, 400],
    testNumber: 14,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=school`,
    details: 'works for admin+school (real value)',
    expectedStatus: [0, 0, 200, 200, 0],
    expectedDataLength: [99999, 99999, 3, 3, 99999],
    expectedErrorStatus: [400, 401, 0, 0, 400],
    testNumber: 15,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[2].id}&schema=school`,
    details: 'works for admin+school (real value)',
    expectedStatus: [0, 0, 200, 200, 0],
    expectedDataLength: [99999, 99999, 2, 2, 99999],
    expectedErrorStatus: [400, 401, 0, 0, 400],
    testNumber: 16,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[4].id}&schema=school`,
    details: 'works for admin+school (real value)',
    expectedStatus: [0, 0, 200, 200, 0],
    expectedDataLength: [99999, 99999, 0, 0, 99999],
    expectedErrorStatus: [400, 401, 0, 0, 400],
    testNumber: 17,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=teacher`,
    details: 'works for admin+teacher (real value, 401	accessNotPermitted	User does not have access to related teacher)',
    expectedStatus: [0, 0, 200, 0, 200],
    expectedDataLength: [99999, 99999, 4, 99999, 99999],
    expectedErrorStatus: [400, 401, 0, 400, 401],
    testNumber: 18,
  },
  {
    getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[3].id}&schema=teacher`,
    details: 'works for admin+teacher (real value, correct teacher)',
    expectedStatus: [0, 0, 200, 0, 200],
    expectedDataLength: [99999, 99999, 2, 99999, 2],
    expectedErrorStatus: [400, 401, 0, 400, 0],
    testNumber: 19,
  },
];

describe('test.each setup', () => {
  jest.setTimeout(60 * 1000);
  beforeAll(async () => {
    await signIn('admin@th.test');
    await setupBeforeAll();
  });

  describe('signedOut', () => {
    beforeAll(async () => {
      await signIn('signedOut');
    });

    test.each(fooTests)('test.each test number: $testNumber', async (fooTest: FooTest) => {
      try {
        // console.log('signoutTest101:', api);
        // console.log('signoutTest102:', fooTest.getUrl(data));
        const response = await api.get(fooTest.getUrl(data));
        expect(response.status).toEqual(fooTest.expectedStatus[1]);
        expect(response.data.data.length).toEqual(fooTest.expectedDataLength[1]);
        expect(response).toSatisfyApiSpec();
      } catch (error) {
        expect(error.response.status).toEqual(fooTest.expectedErrorStatus[1]);
        expect(error.response).toSatisfyApiSpec();
      }
    });
  });
  describe('admin@th.test', () => {
    beforeAll(async () => {
      await signIn('admin@th.test');
    });

    test.each(fooTests)('test.each test number: $testNumber', async (fooTest: FooTest) => {
      try {
        const response = await api.get(fooTest.getUrl(data));
        expect(response.status).toEqual(fooTest.expectedStatus[2]);
        expect(response.data.data.length).toEqual(fooTest.expectedDataLength[2]);
        expect(response).toSatisfyApiSpec();
      } catch (error) {
        expect(error.response.status).toEqual(fooTest.expectedErrorStatus[2]);
        expect(error.response).toSatisfyApiSpec();
      }
    });

    afterAll(async () => {
      await signOut();
    });
  });

  describe('school-1-school@th.test', () => {
    beforeAll(async () => {
      await signIn('school-1-school@th.test');
    });

    test.each(fooTests)('test.each test number: $testNumber', async (fooTest: FooTest) => {
      try {
        const response = await api.get(fooTest.getUrl(data));
        expect(response.status).toEqual(fooTest.expectedStatus[3]);
        expect(response.data.data.length).toEqual(fooTest.expectedDataLength[3]);
        expect(response).toSatisfyApiSpec();
      } catch (error) {
        expect(error.response.status).toEqual(fooTest.expectedErrorStatus[3]);
        expect(error.response).toSatisfyApiSpec();
      }
    });

    afterAll(async () => {
      await signOut();
    });
  });

  describe('endorsed@th.test', () => {
    beforeAll(async () => {
      await signIn('endorsed@th.test');
    });

    test.each(fooTests)('test.each test number: $testNumber', async (fooTest: FooTest) => {
      try {
        const response = await api.get(fooTest.getUrl(data));
        expect(response.status).toEqual(fooTest.expectedStatus[4]);
        expect(response.data.data.length).toEqual(fooTest.expectedDataLength[4]);
        expect(response).toSatisfyApiSpec();
      } catch (error) {
        expect(error.response.status).toEqual(fooTest.expectedErrorStatus[4]);
        expect(error.response).toSatisfyApiSpec();
      }
    });

    afterAll(async () => {
      await signOut();
    });
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

    afterAll(async () => {
      await signOut();
    });
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await signIn('admin@th.test');
    await setupAfterAll();
  });
});
