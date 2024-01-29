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
      getUrl: (data) => `explorer-summary`,
      tests: [
        {
          name: 'explorer-summary - no schema',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-summary?schema=foo`,
      tests: [
        {
          name: 'explorer-summary?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-summary?schema=default`,
      tests: [
        {
          name: 'explorer-summary?schema=default',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-summary?schema=default&asUserId=${data.users[1].id}`,
      tests: [
        {
          name: 'explorer-summary?schema=default&asUserId=${data.users[1].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-summary?schema=default&asUserId=${data.users[1].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-summary?schema=default&asUserId=${data.users[1].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-summary?schema=default&asUserId=${data.users[1].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-summary?schema=default&filter[explorer-record.creationDate][gte]=2022-09-01T00:00:00Z`,
      tests: [
        {
          name: 'explorer-summary?schema=default&filter[explorer-record.creationDate][gte]=2022-09-01T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-summary?schema=default&filter[explorer-record.creationDate][lt]=2024-09-01T00:00:00Z`,
      tests: [
        {
          name: 'explorer-summary?schema=default&filter[explorer-record.creationDate][lt]=2024-09-01T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-summary?schema=default&filter[explorer-record.creationDate][gte]=2022-09-01T00:00:00Z&filter[explorer-record.creationDate][lt]=2024-09-01T00:00:00Z`,
      tests: [
        {
          name: 'explorer-summary?schema=default&filter[explorer-record.creationDate][gte]=2022-09-01T00:00:00Z&filter[explorer-record.creationDate][lt]=2024-09-01T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('explorer-summary', () => {
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
