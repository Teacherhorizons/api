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
      getUrl: (data) => `applications?schema=admin-v2&filter[id][contains]=1`,
      tests: [
        {
          name: 'applications?schema=admin-v2&filter[id][contains]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications?schema=admin-v2&filter[id][contains]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications?schema=admin-v2&filter[id][contains]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications?schema=admin-v2&filter[id][contains]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `applications?schema=school-v2&filter[id][contains]=1`,
      tests: [
        {
          name: 'applications?schema=school-v2&filter[id][contains]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications?schema=school-v2&filter[id][contains]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications?schema=school-v2&filter[id][contains]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications?schema=school-v2&filter[id][contains]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `applications?schema=teacher-v2&filter[id][contains]=1`,
      tests: [
        {
          name: 'applications?schema=teacher-v2&filter[id][contains]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'applications?schema=teacher-v2&filter[id][contains]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'applications?schema=teacher-v2&filter[id][contains]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'applications?schema=teacher-v2&filter[id][contains]=1',
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

describe('applications', () => {
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
