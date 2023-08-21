import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = [
//   'regional-country - standard response - sparse data',
//   'regional-country - standard response - full data',
// ];
// const includeTestNames = ['schema=not-signed-in&filter[slug]=europe-portugal&include=jobs'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=staff`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=staff',
          userEmail: 'signedOut',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            if (!shared.isArrayOfLength1(response.data)) return false;
            return true;
          },
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=cities`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=cities',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=photos`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=photos',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=attractions`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=attractions',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=schools`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=schools',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=jobs`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe-portugal&include=jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countries?useCache=false&filter[slug]=europe-portugal&schema=not-signed-in&include=staff,cities,photos,attractions,ambassadors,schools,jobs`,
      tests: [
        {
          name: 'regional-country - standard response - full data',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countries?useCache=false&filter[slug]=europe-belarus&schema=not-signed-in&include=staff,cities,photos,attractions,ambassadors,schools,jobs`,
      tests: [
        {
          name: 'regional-country - standard response - sparse data',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-country', () => {
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
