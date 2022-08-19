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

import config from '../../config';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      // 400	missingMandatoryParameter	schema must be passed
      tests: [
        {
          name: '|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        // {
        //   name: '|schema must be passed',
        //   userEmail: 'school-1-school@th.test',
        //   expectedStatus: 400,
        // },
        // {
        //   name: '|schema must be passed',
        //   userEmail: 'endorsed@th.test',
        //   expectedStatus: 400,
        // },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin`,
      tests: [
        // {
        //   name: '${data.applications[0].id}?schema=admin|Must be signed in',
        //   userEmail: 'signedOut',
        //   expectedStatus: 401,
        // },
        {
          name: '${data.applications[0].id}?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: '${data.applications[0].id}?schema=admin|Schema invalid',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //schema invalid, must be school
        },
        {
          name: '${data.applications[0].id}?schema=admin|Schema invalid',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=school`,
      tests: [
        // {
        //   name: '${data.applications[0].id}?schema=school|Must be signed in',
        //   userEmail: 'signedOut',
        //   expectedStatus: 401,
        // },
        {
          name: '${data.applications[0].id}?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: '${data.applications[0].id}?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: '${data.applications[0].id}?schema=school|accessNotPermitted',
          userEmail: 'school-2-schools@th.test',
          expectedStatus: 401, //User does not have access to related school
        },
        {
          name: '${data.applications[0].id}?schema=school|Schema invalid',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=teacher`,
      tests: [
        {
          name: '${data.applications[0].id}?schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '${data.applications[0].id}?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: '${data.applications[0].id}?schema=teacher|schema invalid',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //schema invalid, must be school
        },
        {
          name: '${data.applications[0].id}?schema=teacher|accessNotPermitted',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //User does not have access to related teacher
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[3].id}?schema=teacher`,
      tests: [
        {
          name: '${data.applications[3].id}?schema=teacher|accessNotPermitted',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${9999999}?schema=admin`,
      // 404 ApplicationId not found (works for admin) (unreal value)
      tests: [
        {
          name: '${9999999}?schema=admin|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${9999999}?schema=school`,
      // 404 ApplicationId not found (works for admin+school) (unreal value)
      tests: [
        {
          name: 'applications/${9999999}?schema=school|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: 'applications/${9999999}?schema=school|ApplicationId not found',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${9999999}?schema=teacher`,
      // 404 ApplicationId not found (works for admin+teacher) (unreal value)
      tests: [
        {
          name: '${9999999}?schema=teacher|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: '${9999999}?schema=teacher|ApplicationId not found',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('application', () => {
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
