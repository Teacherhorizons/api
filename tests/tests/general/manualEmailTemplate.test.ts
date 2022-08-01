import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `general-manualEmailTemplates/1`,
      tests: [
        {
          name: '1|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '1|schema must be passed',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '1|schema must be passed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '1| Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates/1?schema=admin`,
      tests: [
        {
          name: '1?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: '1?schema=admin|accessNotPermitted|user type must be correct',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted | user type must be correct
        },
        {
          name: '1?schema=admin|accessNotPermitted|user type must be correct',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted | user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates/16?schema=admin`,
      //  subject = null, body = null, isBisibleToSchool = 1
      tests: [
        {
          name: '16?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates/10?schema=admin`,
      tests: [
        {
          name: '10?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200, // isVisibleToAdmin = 0, should this fail?
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates/1000?schema=admin`,
      tests: [
        {
          name: '1000?schema=admin|General_manualEmailTemplateId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404, // entityNotFoundForId | General_manualEmailTemplateId not found
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('general-manualEmailTemplate', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response.data.data.length).toEqual(t.expectedDataLength);
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
