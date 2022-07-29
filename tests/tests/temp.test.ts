import { addTestGroups, api, setupBeforeAll, signIn, data, compareFnGenerator } from '../shared';

var tests = addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 5,
          signIn: true,
        },
        {
          userEmail: 'school1@th.test',
          expectedStatus: 401,
          signIn: true,
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
  ]
);

tests = tests.sort(compareFnGenerator(['userEmail']));

describe('Sign in every user', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(tests)('Sign in every user - $userEmail - $signIn', async (fooTest: Test.Test) => {
    if (fooTest.signIn) await signIn(fooTest.userEmail);
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
