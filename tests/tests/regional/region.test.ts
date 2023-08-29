import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['schema=not-signed-in&filter[slug]=europe&include=ambassadors'];

let baseUrl = `regional-regions`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-regions`,
      tests: [
        {
          name: 'regional-regions - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=abc`,
      tests: [
        {
          name: 'schema=abc',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter	schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&include=jobs`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&include=jobs',
          userEmail: 'signedOut',
          expectedStatus: 422, // nonExistentParameterPassed	include must not be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&filter[slug]=europe`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&filter[slug]=europe',
          userEmail: 'signedOut',
          expectedStatus: 422, // nonExistentParameterPassed filter[slug] must not be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple',
          userEmail: 'signedOut',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            if (!shared.isArrayOfLengthN(response.data, 8)) return false;
            return true;
          },
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&asUserId=${data.users[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id} - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id} - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id} - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id} - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            if (!shared.isArrayOfLengthN(response.data, 8)) return false;
            return true;
          },
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in`,
      tests: [
        {
          name: 'schema=not-signed-in',
          userEmail: 'signedOut',
          expectedStatus: 404, // missingMandatoryParameter
          // regionId value or filter[slug] must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in&filter[slug]=europeabc`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europeabc',
          userEmail: 'signedOut',
          expectedStatus: 404, // entityNotFoundForSlug filter[slug] must be correct
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter include must be passed
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=egg`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=egg',
          userEmail: 'signedOut',
          expectedStatus: 404, //entityNotFoundForInclude include must be correct
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions/19?schema=not-signed-in&filter[slug]=europe`,
      tests: [
        {
          name: '/19?schema=not-signed-in&filter[slug]=europe',
          userEmail: 'signedOut',
          expectedStatus: 404, //missingMandatoryParameter
          // Only one of regionId value or filter[slug] may be passed
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions/999?schema=not-signed-in&include=staff`,
      tests: [
        {
          name: '/999?schema=not-signed-in&include=staff',
          userEmail: 'signedOut',
          expectedStatus: 404, //missingMandatoryParameter regionId not found
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=staff`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=staff',
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
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=${data.regions[0].slug}&include=countries`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=${data.regions[0].slug}&include=countries - 200',
          userEmail: 'signedOut',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            if (!shared.isArrayOfLength1(response.data)) return false;
            if (!shared.numberOfIncludedMatches(response, 'regional-country', data.regions[0].numberOfCountries))
              return false;
            return true;
          },
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=schools`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=schools',
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
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=jobs`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=jobs',
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
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=ambassadors`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=ambassadors',
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
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=environment`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=environment',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=pages`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=pages',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=staff,countries,jobs,schools,ambassadors,environment,pages`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=staff,countries,jobs,schools,ambassadors,environment,pages',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-regions', () => {
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

        if (response.data.schema !== 'not-signed-in-multiple') {
          const isResponseValid = shared.getIsResponseValid(response.data);
          expect(isResponseValid).toBe(true);
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
