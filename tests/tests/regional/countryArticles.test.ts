import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `regional-countryArticles`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-countryArticles`,
      tests: [
        {
          name: 'regional-countryArticles - No schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-countryArticles?schema=foo&filter[country.id]=${data.countries[0].id}`,
      tests: [
        {
          name: 'schema=foo - Invalid schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `regional-countryArticles?schema=not-signed-in`,
      tests: [
        {
          name: 'regional-countryArticles?schema=not-signed-in - No filter',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter filter[country.id] or filter[country.slug] must be passed
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countryArticles?schema=not-signed-in&filter[country.id]=${data.countries[0].id}&filter[country.slug]=europe-albania`,
      tests: [
        {
          name: 'schema=not-signed-in - Both filter[country.id] and filter[country.slug]',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter only one of filter[country.id] or filter[country.slug] can be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-countryArticles?schema=not-signed-in&filter[country.id]=${data.countries[1].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[country.id]=${data.countries[1].id',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-countryArticles?schema=not-signed-in&filter[country.slug]=${data.countries[1].slug}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[country.slug]=${data.countries[1].slug}',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countryArticles?schema=not-signed-in&filter[country.id]=${data.countries[1].id}&asUserId=${data.users[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[country.id]=${data.countries[1].id}&asUserId=${data.users[0].id} - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in&filter[country.id]=${data.countries[1].id}&asUserId=${data.users[0].id} - school-1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&filter[country.id]=${data.countries[1].id}&asUserId=${data.users[0].id} - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&filter[country.id]=${data.countries[1].id}&asUserId=${data.users[0].id} - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-countryArticles', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
  });

  describe('GET', () => {
    test.each(tests)('$name => $expectedStatus', async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);
      console.log('URL: ', url);
      if (t.expectedStatus === 200) {
        const response = await shared.api.get(url);
        expect(response.status).toEqual(t.expectedStatus);
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
