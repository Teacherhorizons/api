import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = ['regional-city - standard response'];
// const includeTestNames = ['regional-city - include jobs'];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=staff`,
      tests: [
        {
          name: 'regional-city - include staff',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=countryPhotos`,
      tests: [
        {
          name: 'regional-city - include countryPhotos',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=photos`,
      tests: [
        {
          name: 'regional-city - include photos',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=climate`,
      tests: [
        {
          name: 'regional-city - include climate',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=attractions`,
      tests: [
        {
          name: 'regional-city - include attractions',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=ambassadors`,
      tests: [
        {
          name: 'regional-city - include ambassadors',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=jobs`,
      tests: [
        {
          name: 'regional-city - include jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=schools`,
      tests: [
        {
          name: 'regional-city - include schools',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=environment`,
      tests: [
        {
          name: 'regional-city - include environment',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=pages`,
      tests: [
        {
          name: 'regional-city - include pages',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `regional-cities?useCache=false&schema=not-signed-in&filter[slug]=europe-portugal-lisbon&include=staff,countryPhotos,photos,climate,attractions,ambassadors,jobs,schools,environment,pages`,
      tests: [
        {
          name: 'regional-city - standard response',
          userEmail: 'signedOut',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const schools = response.included.filter((x) => x.type === 'school');
            const jobs = response.included.filter((x) => x.type === 'job');
            return schools.length >= 4 && schools.length <= 8 && jobs.length <= 4;
          },
        },
      ],
    },
    {
      getUrl: (data) => `regional-cities/?schema=not-signed-in&filter[slug]=africa-mali-bamako&include=schools`,
      tests: [
        {
          name: 'city with no schools',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `regional-cities/?schema=not-signed-in&filter[slug]=africa-mali-bamako&include=schools,jobs`,
      tests: [
        {
          name: 'city with no schools + jobs',
          userEmail: 'signedOut',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

// TODO: better name
var getPassesFooBar = (url: string, response: JsonApi.Response, data: Config.Data): boolean => {
  /*
      general rule: if include relates to a list and there are no related records,
                    the response should contain an empty array (rather than no attribute)
                    e.g. include=schools should respond with school: [] (rather than nothing at all)
  */
  // TODO JP
  // check if include=...schools... then data.relationships.schools is present and is an array
  // check if include=...jobs... then data.relationships.jobs is present and is an array
  return true;
};

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

        const isResponseValid = shared.getIsResponseValid(response.data);
        expect(isResponseValid).toBe(true);

        expect(getPassesFooBar(url, response.data, shared.data)).toBe(true);

        if (t.getPassesCustomChecks) {
          expect(t.getPassesCustomChecks(response.data, shared.data)).toBe(true);
        }

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
