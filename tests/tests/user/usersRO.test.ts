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
      getUrl: (data) => `users`,
      tests: [
        {
          name: 'users - no schema',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=foo`,
      tests: [
        {
          name: 'users?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default`,
      tests: [
        {
          name: 'users?schema=default - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: 'users?schema=default - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'users?schema=default - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'users?schema=default - endorsed teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[uniqueName][matches]=al`,
      tests: [
        {
          name: 'users?schema=default&filter[uniqueName][matches]=al',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const users = response.data as ResourceObject[];
            return users.every((user) => (user.attributes.uniqueName as string).toLowerCase().includes('al'));
          },
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[uniqueName][matches]=129792`,
      tests: [
        {
          name: 'users?schema=default&filter[uniqueName][matches]=129792',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const users = response.data as ResourceObject[];
            return users.every((user) => (user.attributes.uniqueName as string).includes('129792'));
          },
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[uniqueName][matches]=a&page[size]=5`,
      tests: [
        {
          name: 'users?schema=default&filter[uniqueName][matches]=a&page[size]=5',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length === 5;
          },
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[context]=explorerActivities&filter[uniqueName][matches]=a`,
      tests: [
        {
          name: 'users?schema=default&filter[context]=explorerActivities&filter[uniqueName][matches]=a - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length === 0;
          },
        },
        {
          name: 'users?schema=default&filter[context]=explorerActivities&filter[uniqueName][matches]=a - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length > 0;
          },
        },
        {
          name: 'users?schema=default&filter[context]=explorerActivities&filter[uniqueName][matches]=a - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length === 0;
          },
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[uniqueName][matches]=a&filter[typeSlug][contains]=admin,school`,
      tests: [
        {
          name: 'users?schema=default&filter[uniqueName][matches]=a&filter[typeSlug][contains]=admin,school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length > 0;
          },
        },
      ],
    },
    {
      getUrl: (data) => `users?schema=default&filter[uniqueName][matches]=a&filter[typeSlug][contains]=admin,school`,
      tests: [
        {
          name: 'users?schema=default&filter[uniqueName][matches]=a&filter[typeSlug][contains]=admin,school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length > 0;
          },
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('users', () => {
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
