import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = ['subjects - standard response 2'];
// const includeTestNames = ['subjects - included pages'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english`,
      tests: [
        {
          name: 'subjects - base response - no included params',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=world`,
      tests: [
        {
          name: 'subjects - included world',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=regions`,
      tests: [
        {
          name: 'subjects - included regions',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=jobs`,
      tests: [
        {
          name: 'subjects - included jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=ambassador`,
      tests: [
        {
          name: 'subjects - included ambassador',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=pages`,
      tests: [
        {
          name: 'subjects - included pages',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=subjects`,
      tests: [
        {
          name: 'subjects - included subjects',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=advisers`,
      tests: [
        {
          name: 'subjects - included advisers',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=subjectMonths`,
      tests: [
        {
          name: 'subjects - included subjectMonths',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=maths&include=trainingProviders`,
      tests: [
        {
          name: 'subjects - included trainingProviders',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=maths&include=resources`,
      tests: [
        {
          name: 'subjects - included resources',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=articles`,
      tests: [
        {
          name: 'subjects - included articles',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `subjects?schema=not-signed-in-single&filter[slug]=english&include=subjectTeachers`,
      tests: [
        {
          name: 'subjects - included subjectTeachers',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `subjects?schema=not-signed-in-single&filter[slug]=english&include=subjects,subjectTeachers&useCache=false`,
      tests: [
        {
          name: 'subjects - standard response 2',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `subjects?schema=not-signed-in-single&filter[slug]=english&include=world,regions,ambassador,jobs,subjects,subjectTeachers,articles,pages,advisers,trainingProviders,resources,subjectMonths&useCache=false`,
      tests: [
        {
          name: 'subjects - standard response',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-subjects', () => {
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
        const isResponseValid = shared.getIsResponseValid(response.data);
        expect(isResponseValid).toBe(true);

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
