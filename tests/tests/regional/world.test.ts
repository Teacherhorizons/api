import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = ['regional-world - standard response'];
// const includeTestNames = ['regional-world - include jobs'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-world/1?useCache=false&schema=not-signed-in&include=staff`,
      tests: [
        {
          name: 'regional-world - include staff',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-world/1?useCache=false&schema=not-signed-in&include=regions`,
      tests: [
        {
          name: 'regional-world - include regions',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-world/1?useCache=false&schema=not-signed-in&include=jobs`,
      tests: [
        {
          name: 'regional-world - include jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-world/1?useCache=false&schema=not-signed-in&include=schools`,
      tests: [
        {
          name: 'regional-world - include schools',
          userEmail: 'signedOut',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const schools = response.included.filter((x) => x.type === 'school');
            return schools.length >= 4 && schools.length <= 8;
          },
        },
      ],
    },
    {
      getUrl: (data) => `regional-world/1?useCache=false&schema=not-signed-in&include=ambassadors`,
      tests: [
        {
          name: 'regional-world - include ambassadors',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-world/1?useCache=false&schema=not-signed-in&include=staff,regions,jobs,schools,ambassadors`,
      tests: [
        {
          name: 'regional-world - standard response',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-world', () => {
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

        const isResponseValid = shared.getIsResponseValid(response.data);
        expect(isResponseValid).toBe(true);

        if (t.getPassesCustomChecks) {
          expect(t.getPassesCustomChecks(response.data, shared.data)).toBe(true);
        }

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
