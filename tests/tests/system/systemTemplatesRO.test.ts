import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
  getIsResponseValid,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `system-templates`,
      tests: [
        {
          name: 'system-templates',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },

        {
          name: 'system-templates',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'system-templates',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `system-templates/foo`,
      tests: [
        {
          name: 'system-templates/foo',
          userEmail: 'signedOut',
          expectedStatus: 400, // invalidParameterValue - templateId
        },
        {
          name: 'system-templates/foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - templateId
        },
        {
          name: 'system-templates/foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - templateId
        },
        {
          name: 'system-templates/foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - templateId
        },
      ],
    },
    {
      getUrl: (data) => `system-templates?schema=foo`,
      tests: [
        {
          name: 'system-templates?schema=foo',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'system-templates?schema=foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'system-templates?schema=foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `system-templates?schema=default`,
      tests: [
        {
          name: 'system-templates?schema=default - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates?schema=default - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'system-templates?schema=default - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'system-templates?schema=default - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('system-templates', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);

      if (t.getPassesCustomChecks) {
        expect(t.getPassesCustomChecks(response.data, data)).toBe(true);
      }

      const isResponseValid = getIsResponseValid(response.data);
      expect(isResponseValid).toBe(true);

      expect(response).toSatisfyApiSpec();
    } else {
      try {
        await api.get(url);
      } catch (error) {
        expect(error.response.status).toEqual(t.expectedStatus);
        expect(error.response).toSatisfyApiSpec();
      }
    }
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
