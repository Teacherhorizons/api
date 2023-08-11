import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;

let baseUrl = `regional-worldArticles`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-worldArticles`,
      tests: [
        {
          name: 'regional-worldArticles - No schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-worldArticles?schema=foo`,
      tests: [
        {
          name: 'schema=foo - Invalid schema',
          userEmail: 'signedOut',
          expectedStatus: 400, // missingMandatoryParameter schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `regional-worldArticles?schema=not-signed-in&asUserId=${data.users[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&asUserId=${data.users[0].id} - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.users[0].id} - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.users[0].id} - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.users[0].id} - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-worldArticles?schema=not-signed-in`,
      tests: [
        {
          name: 'schema=not-signed-in',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-regionArticles', () => {
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
