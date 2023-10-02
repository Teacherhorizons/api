import * as shared from '../../shared';
import * as base from '../../baseTests';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `application-eventTypeActions`;

var tests = shared.addTestGroups(
  [],
  [
    base.signedOutAdminSchema(baseUrl, ``, 401, null),
    base.adminNoSchema(baseUrl, ``, 400, null),
    base.adminAdminSchemaAdminUser(baseUrl, ``, 200, 29),
    base.adminAdminSchemaSchoolUser(baseUrl, ``, 401, null),
    base.adminSchoolSchemaSchoolUser(baseUrl, ``, 400, null),
    base.adminTeacherSchemaTeacherUser(baseUrl, ``, 400, null),
    base.schoolSchoolSchema(baseUrl, ``, 400, null),
    base.techerTeacherSchema(baseUrl, ``, 400, null),
    base.techerTeacherSchemaTeacherUser(baseUrl, ``, 401, null),
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('get-eventTypeActions', () => {
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
