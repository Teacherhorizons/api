import { ResourceObject } from 'ts-json-api';

import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
  getIsResponseValid,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `user-notifications`,
      tests: [
        {
          name: 'user-notifications - no schema',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=foo`,
      tests: [
        {
          name: 'uuser-notifications?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default`,
      tests: [
        {
          name: 'user-notifications?schema=default',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&filter[text][matches]=foo`,
      tests: [
        {
          name: 'user-notifications?schema=default&filter[text][matches]=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&filter[status.id][contains]=1,2`,
      tests: [
        {
          name: 'user-notifications?schema=default&filter[status.id][contains]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&filter[importance.id][contains]=1,2`,
      tests: [
        {
          name: 'user-notifications?schema=default&filter[importance.id][contains]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&filter[type.id][contains]=1,2`,
      tests: [
        {
          name: 'user-notifications?schema=default&filter[type.id][contains]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&page[size]=2`,
      tests: [
        {
          name: 'user-notifications?schema=default&page[size]=2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length === 2;
          },
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&page[number]=1`,
      tests: [
        {
          name: 'user-notifications?schema=default&page[number]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length <= 20;
          },
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&page[number]=1&page[size]=2`,
      tests: [
        {
          name: 'user-notifications?schema=default&page[number]=1&page[size]=2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length === 2;
          },
        },
      ],
    },
    {
      getUrl: (data) => `user-notifications?schema=default&asUserId=23401`,
      tests: [
        {
          name: 'user-notifications?schema=default&asUserId=23401',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'user-notifications?schema=default&asUserId=23401',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'user-notifications?schema=default&asUserId=23401',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'user-notifications?schema=default&asUserId=23401',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('user-notifications', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);

      if (t.getPassesCustomChecks) {
        expect(t.getPassesCustomChecks(response.data, data)).toBe(true);
      }

      const isResponseValid = getIsResponseValid(response.data);
      expect(isResponseValid).toBe(true);

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
