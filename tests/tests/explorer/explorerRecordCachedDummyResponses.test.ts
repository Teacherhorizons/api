import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = ['explorer-records - admin 101', 'explorer-records - admin 102'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-records/101?schema=admin&include=activities,schoolUser,schoolUser.schools,teacher`,
      tests: [
        {
          name: 'explorer-records - admin 101',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/102?schema=admin&include=activities,schoolUser,schoolUser.schools,teacher`,
      tests: [
        {
          name: 'explorer-records - admin 102',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/101?schema=school&include=activities,teacher`,
      tests: [
        {
          name: 'explorer-records - school 101',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/102?schema=school&include=activities,teacher`,
      tests: [
        {
          name: 'explorer-records - school 102',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/101?schema=teacher&include=activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records - teacher 101',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/102?schema=teacher&include=activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records - teacher 102',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-dummy-explorer-record', () => {
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
