import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/1?schema=admin`,
      tests: [
        {
          name: 'applications/1?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications/1?schema=admin',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications/1?schema=admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications/1?schema=admin',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `applications/1?schema=teacher`,
      tests: [
        {
          name: 'applications/1?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications/1?schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications/1?schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications/1?schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `applications/1?schema=school`,
      tests: [
        {
          name: 'applications/1?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications/1?schema=school',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications/1?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications/1?schema=school',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('applications/{id}', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response).toSatisfyApiSpec();
    } else {
      try {
        await api.get(url);
      } catch (error) {
        expect(error.response.status).toEqual(t.expectedStatus);
        expect(error.response).toSatisfyApiSpec();
      }
    }
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
