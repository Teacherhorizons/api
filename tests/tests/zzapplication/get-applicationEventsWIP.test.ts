import * as shared from '../../shared';

var testsForGet = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents`,
      tests: [
        {
          name: 'application-applicationEvents',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationEvents',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'application-applicationEvents',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'application-applicationEvents',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-allApplications`,
      tests: [
        {
          name: '?schema=admin-allApplications',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-allApplications',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter filter[application.teacher.memberNumber] must be passed for schema admin-allApplications
        },
        {
          name: '?schema=admin-allApplications',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
        {
          name: '?schema=admin-allApplications',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-oneApplication`,
      tests: [
        {
          name: '?schema=admin-oneApplication',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-oneApplication',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter filter[application.id] must be passed
        },
        {
          name: '?schema=admin-oneApplication',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
        {
          name: '?schema=admin-oneApplication',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school`,
      tests: [
        {
          name: '?schema=school',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	filter[application.id] must be passed
        },
        {
          name: '?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	filter[application.id] must be passed
        },
        {
          name: '?schema=school',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=teacher`,
      tests: [
        {
          name: '?schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	filter[application.id] must be passed
        },
        {
          name: '?schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
        {
          name: '?schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	filter[application.id] must be passed
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}`,
      tests: [
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'admin@th.test',
          expectedStatus: 200, //works for admin only (known value)
          expectedDataLength: 9,
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=9999999`,
      tests: [
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 200, // works for admin only (unreal value)
          expectedDataLength: 0,
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=9999999',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-allApplications&filter[application.teacher.memberNumber]=9999999',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&asUserId=${data.asUserId[0].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}`,
      tests: [
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[0].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[0].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'admin@th.test',
          expectedStatus: 200, //works for admin only (known value)
          expectedDataLength: 9,
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[0].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[0].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&asUserId=${data.asUserId[1].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}`,
      tests: [
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[1].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[1].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[1].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[1].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&asUserId=${data.asUserId[2].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}`,
      tests: [
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[2].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[2].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[2].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: '?schema=admin-allApplications&asUserId=${data.asUserId[2].id}&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-allApplications&asUserId=abc&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}`,
      tests: [
        {
          name: '?schema=admin-allApplications&asUserId=abc&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'signedOut',
          expectedStatus: 422, //wrongDataType	abc
        },
        {
          name: '?schema=admin-allApplications&asUserId=abc&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'admin@th.test',
          expectedStatus: 422, //wrongDataType	abc
        },
        {
          name: '?schema=admin-allApplications&asUserId=abc&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 422, //wrongDataType	abc
        },
        {
          name: '?schema=admin-allApplications&asUserId=abc&filter[application.teacher.memberNumber]=${data.teachers[0].memberNumber}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 422, //wrongDataType	abc
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=9999999`,
      tests: [
        {
          name: '?schema=admin-oneApplication&filter[application.id]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found (unreal value)
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=9999999',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=9999999',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=teacher&filter[application.id]=9999999`,
      tests: [
        {
          name: '?schema=teacher&filter[application.id]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=teacher&filter[application.id]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found
        },
        {
          name: '?schema=teacher&filter[application.id]=9999999',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=teacher&filter[application.id]=9999999',
          userEmail: 'endorsed@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=9999999`,
      // 404 ApplicationId not found (works for admin+school) (unreal value)
      tests: [
        {
          name: '?schema=school&filter[application.id]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=school&filter[application.id]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found
        },
        {
          name: '?schema=school&filter[application.id]=9999999',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found
        },
        {
          name: '?schema=school&filter[application.id]=9999999',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    // here
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          name: '?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          name: '?schema=school&filter[application.id]=${data.applications[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[0].id}',
          userEmail: 'school-2-schools@th.test',
          // accessNotPermitted | User does not have access to related school
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[2].id}`,
      tests: [
        {
          name: '?schema=school&filter[application.id]=${data.applications[2].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[2].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[2].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[2].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[4].id}`,
      tests: [
        {
          name: '?schema=school&filter[application.id]=${data.applications[4].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[4].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[4].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          expectedDataLength: 0,
        },
        {
          name: '?schema=school&filter[application.id]=${data.applications[4].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=teacher&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User does not have access to related teacher
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=teacher&filter[application.id]=${data.applications[3].id}`,
      tests: [
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[3].id}',
          userEmail: 'signedOut',
          expectedStatus: 401,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[3].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[3].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400,
        },
        {
          name: '?schema=teacher&filter[application.id]=${data.applications[3].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(shared.compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationEvents', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
    if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
    const url = t.getUrl(shared.data);

    if (t.expectedStatus === 200) {
      const response = await shared.api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response.data.data.length).toEqual(t.expectedDataLength);
      expect(response).toSatisfyApiSpec();
    } else {
      try {
        await shared.api.get(url);
      } catch (error) {
        expect(error.response.status).toEqual(t.expectedStatus);
        expect(error.response).toSatisfyApiSpec();
      }
    }
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await shared.setupAfterAll();
  });
});
