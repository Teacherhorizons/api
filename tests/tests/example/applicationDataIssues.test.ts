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
      getUrl: (data) => `application-applicationDataIssues`,
      // 400	missingMandatoryParameter	schema must be passed
      tests: [
        {
          name: 'application-applicationDataIssues|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=school`,
      // 400	missingMandatoryParameter	schema must be correct
      tests: [
        {
          name: '?schema=school|schema must be correct',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=teacher`,
      // 400	missingMandatoryParameter	schema must be correct
      tests: [
        {
          name: '?schema=teacher|schema must be correct',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=admin`,
      // 400 missingMandatoryParameter filter[application.id] must be passed
      tests: [
        {
          name: '?schema=admin|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=admin&filter[application.id]=34`,
      // working for admin only
      tests: [
        {
          name: '?filter[application.id]=10&schema=admin|accessNotPermitted',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin&filter[application.id]=34',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 5,
        },
        {
          name: '?filter[application.id]=10&schema=admin|accessNotPermitted',
          userEmail: 'school-1-school@th.test', //accessNotPermitted|user type must be correct
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=10&schema=admin|accessNotPermitted',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted|user type must be correct
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('application-applicationDataIssues', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response.data.data.length).toEqual(t.expectedDataLength);
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
