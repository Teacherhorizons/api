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
      getUrl: (data) => `general-manualEmailTemplates?filter[id][contains]=1,2`,
      tests: [
        {
          name: '?filter[id][contains]=1,2|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '?filter[id][contains]=1,2|schema must be passed',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '?filter[id][contains]=1,2|schema must be passed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema must be passed
        },
        {
          name: '?filter[id][contains]=1,2|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=admin&filter[id][contains]=1,2,3`,
      tests: [
        {
          name: '?schema=admin&filter[id][contains]=1,2,3',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
        {
          name: '?schema=admin&filter[id][contains]=1,2,3',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
        },
        {
          name: '?schema=admin&filter[id][contains]=1,2,3',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=admin`,
      tests: [
        {
          name: '?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 14,
        },
        {
          name: '?schema=admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
        },
        {
          name: '?schema=admin',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=teacher&filter[id][contains]=1,2,19`,
      tests: [
        {
          name: '?schema=teacher&filter[id][contains]=1,2,19',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: '?schema=teacher&filter[id][contains]=1,2,19',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
        },
        {
          name: '?schema=teacher&filter[id][contains]=1,2,19',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=teacher`,
      tests: [
        {
          name: '?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be school
        },
        {
          name: '?schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=school&filter[id][contains]=1,2,15,16`,
      tests: [
        {
          name: '?schema=school&filter[id][contains]=1,2,15,16',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=school&filter[id][contains]=1,2,15,16',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=school&filter[id][contains]=1,2,15,16',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `general-manualEmailTemplates?schema=school`,
      tests: [
        {
          name: '?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?schema=school',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter | schema invalid, must be teacher
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('general-manualEmailTemplates', () => {
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
