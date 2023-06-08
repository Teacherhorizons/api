import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `regional-regions`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-regions`,
      tests: [
        {
          name: 'regional-regions',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-regions',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-regions',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-regions',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=abc`,
      tests: [
        {
          name: 'schema=abc',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter	schema must be correct
        },
        {
          name: 'schema=abc',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be correct
        },
        {
          name: 'schema=abc',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be correct
        },
        {
          name: 'schema=abc',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be correct
        },
      ],
    },
    // not-signed-in-multiple -------------------------------------------------
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&include=jobs`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&include=jobs',
          userEmail: 'signedOut',
          expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&include=jobs',
          userEmail: 'admin@th.test',
          expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&include=jobs',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&include=jobs',
          userEmail: 'endorsed@th.test',
          expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&filter[slug]=europe`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&filter[slug]=europe',
          userEmail: 'signedOut',
          expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&filter[slug]=europe',
          userEmail: 'admin@th.test',
          expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&filter[slug]=europe',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
        },
        {
          name: 'schema=not-signed-in-multiple&filter[slug]=europe',
          userEmail: 'endorsed@th.test',
          expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
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
          expectedDataLength: 8,
        },
        {
          name: 'schema=not-signed-in-multiple',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 8,
        },
        {
          name: 'schema=not-signed-in-multiple',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 8,
        },
        {
          name: 'schema=not-signed-in-multiple',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 8,
        },
      ],
    },
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in-multiple&asUserId=${data.users[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 8,
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in-multiple&asUserId=${data.users[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    // not-signed-in- -----------------------------------------------------------
    {
      getUrl: (data) => `regional-regions?schema=not-signed-in`,
      tests: [
        {
          name: 'schema=not-signed-in',
          userEmail: 'signedOut',
          expectedStatus: 404, //missingMandatoryParameter
          // regionId value or filter[slug] must be passed
        },
        {
          name: 'schema=not-signed-in',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //missingMandatoryParameter
          // regionId value or filter[slug] must be passed
        },
        {
          name: 'schema=not-signed-in',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //missingMandatoryParameter
          // regionId value or filter[slug] must be passed
        },
        {
          name: 'schema=not-signed-in',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404, //missingMandatoryParameter
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
          expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europeabc',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europeabc',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europeabc',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter include must be passed
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter include must be passed
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter include must be passed
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter include must be passed
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
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=egg',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForInclude include must be correct
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=egg',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //entityNotFoundForInclude include must be correct
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=egg',
          userEmail: 'endorsed@th.test',
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
        {
          name: '/19?schema=not-signed-in&filter[slug]=europe',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //missingMandatoryParameter
          // Only one of regionId value or filter[slug] may be passed
        },
        {
          name: '/19?schema=not-signed-in&filter[slug]=europe',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //missingMandatoryParameter
          // Only one of regionId value or filter[slug] may be passed
        },
        {
          name: '/19?schema=not-signed-in&filter[slug]=europe',
          userEmail: 'endorsed@th.test',
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
        {
          name: '/999?schema=not-signed-in&include=staff',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //missingMandatoryParameter regionId not found
        },
        {
          name: '/999?schema=not-signed-in&include=staff',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //missingMandatoryParameter regionId not found
        },
        {
          name: '/999?schema=not-signed-in&include=staff',
          userEmail: 'endorsed@th.test',
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
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=staff',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=staff',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=staff',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) => `/regional-regions?schema=not-signed-in&filter[slug]=europe&include=countries`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=countries',
          userEmail: 'signedOut',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=countries',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=countries',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=countries',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
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
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=schools',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=schools',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
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
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=jobs',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=jobs',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=jobs',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
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
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=ambassadors',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=ambassadors',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: 'schema=not-signed-in&filter[slug]=europe&include=ambassadors',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter(
  // (t) => includeTestNames == null || includeTestNames.includes(t.name)
  // (t) => t.name === 'schema=not-signed-in&filter[slug]=europe&include=staff'
  (t) => t.name === 'schema=not-signed-in&filter[slug]=europe&include=staff' && t.userEmail === 'signedOut'
);

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
        expect(response.data.data.length).toEqual(t.expectedDataLength);
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
