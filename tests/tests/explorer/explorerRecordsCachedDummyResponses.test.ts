import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = ['explorer-records - admin'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `system-cachedApiResponses/5101?path=/explorer-records&schema=admin`,
      tests: [
        {
          name: 'explorer-records - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `system-cachedApiResponses/5102?path=/explorer-records&schema=school`,
      tests: [
        {
          name: 'explorer-records - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `system-cachedApiResponses/5103?path=/explorer-records&schema=teacher`,
      tests: [
        {
          name: 'explorer-records - teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-dummy-explorer-records', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
  });

  describe('GET', () => {
    test.each(tests)('$name => $expectedStatus', async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);

      if (t.expectedStatus === 200) {
        const response = await shared.api.get(url);
        expect(response.status).toEqual(t.expectedStatus);

        if (t.getPassesCustomChecks) {
          expect(t.getPassesCustomChecks(response.data, shared.data)).toBe(true);
        }

        const isResponseValid = shared.getIsResponseValid(response.data);
        expect(isResponseValid).toBe(true);

        response.request.path = '/th/api/explorer-records';
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await shared.api.get(url);
          console.log('successful by accident');
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await shared.setupAfterAll();
  });
});
