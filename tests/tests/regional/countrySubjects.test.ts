import * as shared from '../../shared';
import * as base from '../../baseTests';

// const includeTestNames: string[] = null;
// const includeTestNames = ['filter[slug]=asia-singapore-english - no included param'];
const includeTestNames = ['filter[slug]=asia-singapore-english'];

let baseUrl = `regional-countrySubjects`;

var tests = shared.addTestGroups(
  [],
  [
    // {
    //   getUrl: (data) => `regional-countrySubjects`,
    //   tests: [
    //     {
    //       name: 'no query params',
    //       userEmail: 'signedOut',
    //       expectedStatus: 400, // schema must be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `regional-countrySubjects?schema=abc`,
    //   tests: [
    //     {
    //       name: 'schema=abc',
    //       userEmail: 'signedOut',
    //       expectedStatus: 400, // schema must be correct
    //     },
    //   ],
    // },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english - no included param',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country,subject,jobs,country.subjects,country.attractions,country.photos,country.ambassador,subject.regions,subject.advisers,jobs.school`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-thailand-biology&include=country,subject,jobs,country.subjects,country.attractions,country.photos,country.ambassador,subject.regions,subject.advisers,jobs.school`,
      tests: [
        {
          name: 'filter[slug]=asia-thailand-biology',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter(
  (t) => includeTestNames == null || includeTestNames.includes(t.name)
  // (t) => t.name === 'schema=not-signed-in&filter[slug]=europe&include=staff'
  // (t) => t.name === 'no query params'
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
        // expect(response.data.data.length).toEqual(t.expectedDataLength);
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
