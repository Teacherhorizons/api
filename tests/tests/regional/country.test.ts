import * as shared from '../../shared';

// const includeTestNames: string[] = null;
const includeTestNames = [
  'regional-country - standard response - sparse data',
  'regional-country - standard response - full data',
];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `regional-countries?useCache=false&filter[slug]=europe-belarus&schema=not-signed-in&include=cities`,
      tests: [
        {
          name: 'regional-country - standard response - sparse data',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-countries?useCache=false&filter[slug]=europe-portugal&schema=not-signed-in&include=staff,cities,photos,attractions,ambassadors,schools,jobs`,
      tests: [
        {
          name: 'regional-country - standard response - full data',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-regional-country', () => {
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
        // expect(response.data.data.length).toEqual(t.expectedDataLength); undefined?

        // custom tests (for standard response)
        // const included: JsonApi.ResourceObject[] = response.data.included;

        // const schools = included.filter((x) => x.type === 'school');
        // expect(schools.length).toBeGreaterThanOrEqual(4);
        // expect(schools.length).toBeLessThanOrEqual(8);

        // const jobs = included.filter((x) => x.type === 'job');
        // expect(jobs.length).toBeLessThanOrEqual(4);

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
