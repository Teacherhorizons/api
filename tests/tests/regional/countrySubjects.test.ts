import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `regional-countrySubjects`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `regional-countrySubjects`,
      tests: [
        {
          name: 'no query params',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameter schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-countrySubjects?schema=abc`,
      tests: [
        {
          name: 'schema=abc',
          userEmail: 'signedOut',
          expectedStatus: 400, //missingMandatoryParameterschema must be correct
        },
      ],
    },
    // not-signed-in-single -------------------------------------------------
    {
      getUrl: (data) => `regional-countrySubjects?schema=not-signed-in-single&include=jobs`,
      tests: [
        {
          name: 'schema=not-signed-in-single&include=jobs',
          userEmail: 'signedOut',
          expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter(
  // (t) => includeTestNames == null || includeTestNames.includes(t.name)
  // (t) => t.name === 'schema=not-signed-in&filter[slug]=europe&include=staff'
  (t) => t.name === 'no query params'
);

describe('get-regional-countrySubjects', () => {
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
