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
      getUrl: (data) => `application-applicationEvents`,
      // 400	missingMandatoryParameter	schema must be passed
      tests: [
        {
          name: 'application-applicationEvents|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: 'application-applicationEvents|schema must be passed',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: 'application-applicationEvents|schema must be passed',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: 'application-applicationEvents|schema must be passed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-allApplications`,
      // 400 missingMandatoryParameter filter[application.teacher.memberNumber] must be passed for schema admin-allApplications
      tests: [
        {
          name: '?schema=admin-allApplications|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-oneApplication`,
      // 400	missingMandatoryParameter	filter[application.id] must be passed
      tests: [
        {
          name: '?schema=admin-oneApplication|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin-oneApplication|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-oneApplication|Missing [application.id]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-oneApplication|Missing [application.id]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school`,
      // 400	missingMandatoryParameter	filter[application.id] must be passed
      tests: [
        {
          name: '?schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=school|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=school|Missing [application.id]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=school|Missing [application.id]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=teacher`,
      // 400	missingMandatoryParameter	filter[application.id] must be passed
      tests: [
        {
          name: '?schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=teacher|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=teacher|Missing [application.id]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=teacher|Missing [application.id]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=teacher`,
      // 400	missingMandatoryParameter	filter[application.id] must be passed
      tests: [
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=teacher|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=teacher|Missing [application.id]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=teacher|Missing [application.id]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.teacher.memberNumber]=2223610&schema=school`,
      // 400	missingMandatoryParameter	filter[application.id] must be passed
      tests: [
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=school|Missing [application.id]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=school|Missing [application.id]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=2223610&schema=school|Missing [application.id]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=62080&schema=admin-allApplications`,
      // missingMandatoryParameter	filter[application.teacher.memberNumber] must be passed for schema admin-allApplications
      tests: [
        {
          name: '?filter[application.id]=62080&schema=admin-allApplications|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=62080&schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'admin@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=62080&schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=62080&schema=admin-allApplications|Missing [application.teacher.memberNumber]',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications`,
      // works for admin only (known value)
      tests: [
        {
          name: '?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 9,
        },
        {
          name: '?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}&schema=admin-allApplications|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications`,
      // works for admin only (unreal value)
      tests: [
        {
          name: '?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
        {
          name: '?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.teacher.memberNumber]=9999999&schema=admin-allApplications|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=admin-oneApplication`,
      // 404 ApplicationId not found (works for admin) (unreal value)
      tests: [
        {
          name: '?filter[application.id]=9999999&schema=admin-oneApplication|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=9999999&schema=admin-oneApplication|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: '?filter[application.id]=9999999&schema=admin-oneApplication|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=9999999&schema=admin-oneApplication|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=teacher`,
      // 404 ApplicationId not found (works for admin+teacher) (unreal value)
      tests: [
        {
          name: '?filter[application.id]=9999999&schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=9999999&schema=teacher|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: '?filter[application.id]=9999999&schema=teacher|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=9999999&schema=teacher|ApplicationId not found',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=9999999&schema=school`,
      // 404 ApplicationId not found (works for admin+school) (unreal value)
      tests: [
        {
          name: '?filter[application.id]=9999999&schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=9999999&schema=school|ApplicationId not found',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: '?filter[application.id]=9999999&schema=school|ApplicationId not found',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404,
        },
        {
          name: '?filter[application.id]=9999999&schema=school|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication`,
      // works for admin (real value)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=admin-oneApplication|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=school`,
      // works for admin+school (real value)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=school|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=school|accessNotPermitted|User does not have access to related school',
          userEmail: 'school-2-schools@th.test',
          // accessNotPermitted | User does not have access to related school
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[2].id}&schema=school`,
      // works for admin+school (real value)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[2].id}&schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[2].id}&schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?filter[application.id]=${data.applications[2].id}&schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?filter[application.id]=${data.applications[2].id}&schema=school|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?filter[application.id]=${data.applications[4].id}&schema=school`,
      // works for admin+school (real value)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[4].id}&schema=school|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[4].id}&schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
        {
          name: '?filter[application.id]=${data.applications[4].id}&schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
        {
          name: '?filter[application.id]=${data.applications[4].id}&schema=school|schema invalid, must be teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?filter[application.id]=${data.applications[0].id}&schema=teacher`,
      // works for admin+teacher (real value, 401	accessNotPermitted	User does not have access to related teacher)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=teacher|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=${data.applications[0].id}&schema=teacher|accessNotPermitted|User does not have access to related teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?filter[application.id]=${data.applications[3].id}&schema=teacher`,
      // works for admin+teacher (real value, correct teacher)
      tests: [
        {
          name: '?filter[application.id]=${data.applications[3].id}&schema=teacher|Must be signed in',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?filter[application.id]=${data.applications[3].id}&schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?filter[application.id]=${data.applications[3].id}&schema=teacher|schema invalid, must be school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?filter[application.id]=${data.applications[3].id}&schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationEvents', () => {
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
