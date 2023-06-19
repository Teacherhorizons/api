import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = ['regional-city - standard response'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=staff,countryPhotos,photos,climate,attractions,ambassadors,jobs,schools`,
      tests: [
        {
          name: 'regional-city - standard response',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-city', () => {
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
        // expect(response.data.data.length).toEqual(t.expectedDataLength); // undefined?

        // custom tests (for standard response)
        const included: JsonApi.ResourceObject[] = response.data.included;

        const schools = included.filter((x) => x.type === 'school');
        expect(schools.length).toBeGreaterThanOrEqual(4);
        expect(schools.length).toBeLessThanOrEqual(8);

        const jobs = included.filter((x) => x.type === 'job');
        expect(jobs.length).toBeLessThanOrEqual(4);

        // spec test
        expect(response).toSatisfyApiSpec();
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
