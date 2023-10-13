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
      getUrl: (data) => `application-applicationDataIssues?schema=admin&filter[application.id]=1`,
      tests: [
        {
          name: 'schema=admin&filter[application.id]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=admin&filter[application.id]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'schema=admin&filter[application.id]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'schema=admin&filter[application.id]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues`,
      tests: [
        {
          name: 'application-applicationDataIssues',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationDataIssues',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=admin&filter[application.id]=9999999`,
      tests: [
        {
          name: 'schema=admin&filter[application.id]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=admin&filter[application.id]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?filter[application.id]=1`,
      tests: [
        {
          name: 'filter[application.id]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=admin&filter[application.id]=a`,
      tests: [
        {
          name: 'schema=admin&filter[application.id]=a',
          userEmail: 'signedOut',
          expectedStatus: 422, // wrongDataType	a
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationDataIssues', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
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
