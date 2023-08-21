import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['schema=not-signed-in&asUserId=${data.users[0].id} - 200'];

let baseUrl = `regional-cityArticles`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-cityArticles?filter[city.id]=${data.cities[0].id}`,
      tests: [
        {
          name: 'regional-cityArticles - No schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=foo&filter[city.id]=${data.cities[0].id}`,
      tests: [
        {
          name: 'schema=foo - Invalid schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in`,
      tests: [
        {
          name: 'schema=not-signed-in - No filter[city.id] nor filter[city.slug]',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter filter[city.id] or filter[city.slug] must be passed
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cityArticles?schema=not-signed-in&filter[city.id]=${data.cities[0].id}&filter[city.slug]=africa-angola-luanda`,
      tests: [
        {
          name: 'schema=not-signed-in - Both filter[city.id] and filter[city.slug]',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter only one of filter[city.id] or filter[city.slug] can be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in&filter[city.id]=${data.cities[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in&filter[city.id]=${data.cities[1].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[1].id',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in&filter[city.slug]=${data.cities[1].slug}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[city.slug]=${data.cities[1].slug}',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in&filter[city.id]=${data.cities[2].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[2].id}',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cityArticles?schema=not-signed-in&filter[city.id]=${data.cities[1].id}&asUserId=${data.users[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[1].id}&asUserId=${data.users[0].id} - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[1].id}&asUserId=${data.users[0].id} - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[1].id}&asUserId=${data.users[0].id} - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&filter[city.id]=${data.cities[1].id}&asUserId=${data.users[0].id} - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-cityArticles', () => {
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
