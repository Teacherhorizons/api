import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `application-eventTypeActions`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-eventTypeActions?schema=admin`,
      tests: [
        {
          name: 'admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 33,
        },
        {
          name: 'notSignedIn',
          userEmail: 'notSignedIn',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'teacher PATCH 101',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted | unauthorised
        },
        {
          name: 'school, eventTypeId equal 14',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted | unauthorised
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-eventTypeActions', () => {
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
