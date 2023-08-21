import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['filter[slug]=asia-singapore-english - no included param'];
// const includeTestNames = ['filter[slug]=asia-singapore-english'];

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
          expectedStatus: 400, // schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `regional-countrySubjects?schema=abc`,
      tests: [
        {
          name: 'schema=abc',
          userEmail: 'signedOut',
          expectedStatus: 400, // schema must be correct
        },
      ],
    },
    {
      // Note: if asia-thailand-biology is created, this will give back a 200
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-thailand-biology`,
      tests: [
        {
          name: 'filter[slug]=asia-thailand-biology',
          userEmail: 'signedOut',
          expectedStatus: 404,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=jobs.school`,
      tests: [
        {
          name: 'jobs.school included but jobs not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=subject.subjectRegions`,
      tests: [
        {
          name: 'subject.subjectRegions included but subject not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=subject.advisers`,
      tests: [
        {
          name: 'subject.advisers included but subject not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country.countrySubjects`,
      tests: [
        {
          name: 'country.countrySubjects included but country not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country.photos`,
      tests: [
        {
          name: 'country.photos included but country not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country.ambassador`,
      tests: [
        {
          name: 'country.ambassador included but country not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country.attractions`,
      tests: [
        {
          name: 'country.attractions included but country not included',
          userEmail: 'signedOut',
          expectedStatus: 400,
        },
      ],
    },
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
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english - country',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=subject`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english - subject',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=jobs`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english - jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countrySubjects?useCache=false&schema=not-signed-in-single&filter[slug]=asia-singapore-english&include=country,subject,jobs,country.countrySubjects,country.attractions,country.photos,country.ambassador,subject.subjectRegions,subject.advisers,jobs.school`,
      tests: [
        {
          name: 'filter[slug]=asia-singapore-english - all params',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

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

        // spec test
        // const isResponseValid = shared.getIsResponseValid(response.data);
        // expect(isResponseValid).toBe(true);
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
