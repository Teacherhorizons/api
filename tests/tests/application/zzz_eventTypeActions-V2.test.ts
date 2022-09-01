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

import config from '../../config';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      // 400	missingMandatoryParameter	schema must be passed
      tests: [
        {
          name: '|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '|schema must be passed',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '|schema must be passed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin`,
      // 200
      tests: [
        {
          name: '?schema=admin|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: config.local ? 4 : 29,
        },
        {
          name: '?schema=admin|user type must be correct',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin|user type must be correct',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applications', () => {
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
