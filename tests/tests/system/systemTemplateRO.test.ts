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
      getUrl: (data) => `system-templates/${data.systemTemplates[0].id}`,
      tests: [
        {
          name: 'system-templates/${data.systemTemplates[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },

        {
          name: 'system-templates/${data.systemTemplates[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}',
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
      getUrl: (data) => `system-templates/${data.systemTemplates[0].id}?schema=foo`,
      tests: [
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=foo',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `system-templates/${data.systemTemplates[0].id}?schema=default`,
      tests: [
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=default - signedOut',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=default - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 404, // notFound - Must be visible to admin
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=default - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'system-templates/${data.systemTemplates[0].id}?schema=default - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404, // notFound - Must be visible to teacher
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('system-templates/{id}', () => {
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
