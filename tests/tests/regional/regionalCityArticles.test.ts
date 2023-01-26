import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `regional-cityArticles`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-cityArticles`,
      tests: [
        {
          name: 'regional-cityArticles',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-cityArticles',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-cityArticles',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'regional-cityArticles',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=admin`,
      tests: [
        {
          name: 'schema=admin',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
        {
          name: 'schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
        {
          name: 'schema=admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
        {
          name: 'schema=admin',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in`,
      tests: [
        {
          name: 'schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: 'schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: 'schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: 'schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed=in&filter[city.id]=${1}`,
      tests: [
        {
          name: 'schema=not-signed=in&filter[city.id]=${1}',
          userEmail: 'signedOut',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed=in&filter[city.id]=${3}`,
      tests: [
        {
          name: 'schema=not-signed=in&filter[city.id]=${3}',
          userEmail: 'signedOut',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed=in&filter[city.id]=${3000}`,
      tests: [
        {
          name: 'schema=not-signed=in&filter[city.id]=${3000}',
          userEmail: 'signedOut',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cityArticles?schema=not-signed-in&asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'schema=not-signed-in&asUserId=${data.asUserId[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.asUserId[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.asUserId[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=not-signed-in&asUserId=${data.asUserId[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
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
