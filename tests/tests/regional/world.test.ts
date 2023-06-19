import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = ['regional-world - standard response'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `regional-world/1?useCache=false&schema=not-signed-in&include=staff,regions,jobs,schools,ambassadors`,
      // `regional-world/1?useCache=false&schema=not-signed-in&include=regions,schools,jobs,staff`,
      tests: [
        {
          name: 'regional-world - standard response',
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
  // (t) => t.name === 'schema=not-signed-in&filter[slug]=europe&include=staff' && t.userEmail === 'signedOut'
);

describe('get-regional-world', () => {
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

        // custom tests (for standard response)
        const included: JsonApi.ResourceObject[] = response.data.included;

        const schools = included.filter((x) => x.type === 'school');
        expect(schools.length).toBeGreaterThanOrEqual(4);
        expect(schools.length).toBeLessThanOrEqual(8);

        const jobs = included.filter((x) => x.type === 'job');
        expect(jobs.length).toBeLessThanOrEqual(4);

        // spec test
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
