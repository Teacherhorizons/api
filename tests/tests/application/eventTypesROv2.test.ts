import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `application-eventTypes`;

var tests = shared.addTestGroups(
  [],
  [
    // base.signedOutAdminSchema(baseUrl, ``, 401, null),
    // base.adminNoSchema(baseUrl, ``, 400, null),
    base.adminAdminSchemaAdminUser(baseUrl, ``, 200, 24, 'admin-v2'),
    // base.adminAdminSchemaSchoolUser(baseUrl, ``, 400, null),
    // base.adminSchoolSchemaSchoolUser(baseUrl, ``, 200, 16),
    // base.adminTeacherSchemaTeacherUser(baseUrl, ``, 200, 24),
    // base.schoolSchoolSchema(baseUrl, ``, 200, 16),
    // base.techerTeacherSchema(baseUrl, ``, 200, 24),
    // base.techerTeacherSchemaTeacherUser(baseUrl, ``, 401, null),
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-eventTypes', () => {
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
        expect(response.data.data.length).toEqual(t.expectedDataLength);
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
