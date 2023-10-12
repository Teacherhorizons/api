import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `application-applicationEvents`;

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents?schema=admin-v2-oneApplication&filter[application.id]=1`,
      tests: [
        {
          name: 'application-applicationEvents?schema=admin-v2-oneApplication&filter[application.id]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'application-applicationEvents?schema=admin-v2-oneApplication&filter[application.id]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationEvents?schema=admin-v2-oneApplication&filter[application.id]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'application-applicationEvents?schema=admin-v2-oneApplication&filter[application.id]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-v2-allApplications&filter[application.teacher.memberNumber]=111627`,
      tests: [
        {
          name: 'application-applicationEvents',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=111627',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=111627',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=111627',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school-v2&filter[application.id]=1`,
      tests: [
        {
          name: 'application-applicationEvents',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'application-applicationEvents?schema=school&filter[application.id]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationEvents?schema=school&filter[application.id]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'application-applicationEvents?schema=school&filter[application.id]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=teacher-v2&filter[application.id]=1`,
      tests: [
        {
          name: 'application-applicationEvents',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'application-applicationEvents?schema=teacher&filter[application.id]=1',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationEvents?schema=teacher&filter[application.id]=1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'application-applicationEvents?schema=teacher&filter[application.id]=1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-applicationEvent', () => {
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
